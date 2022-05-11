'use strict';

const Controller = require('egg').Controller;

class NspController extends Controller {
  // 验证用户token
  async checkToken(token) {
    const { ctx, app } = this;
    // 当前连接
    const socket = ctx.socket;
    const id = socket.id;

    // 用户验证
    if (!token) {
      // 通知前端 您没有访问该接口的权限
      socket.emit(id, ctx.helper.parseMsg('error', '您没有权限访问该接口'));
      return false;
    }

    // 根据token解密，换取用户信息
    let user = {};
    try {
      user = ctx.checkToken(token);
    } catch (error) {
      const fail = error.name === 'TokenExpiredError' ? 'token 已过期! 请重新获取令牌' : 'Token 令牌不合法!';
      socket.emit(id, ctx.helper.parseMsg('error', fail));
      return false;
    }

    // 判断用户是否登录
    const t = await ctx.service.cache.get('user_' + user.id);
    if (!t || t !== token) {
      socket.emit(id, ctx.helper.parseMsg('error', 'Token 令牌不合法!'));
      return false;
    }

    // 4.判断用户是否存在
    user = await app.model.User.findOne({
      where: {
        id: user.id,
      },
    });
    if (!user) {
      socket.emit(id, ctx.helper.parseMsg('error', '用户不存在'));
      return false;
    }

    return user;
  }
  // 进入直播间
  async joinLive() {
    console.log('joinLive');
    const { ctx, app, service } = this;
    const nsp = app.io.of('/');
    // 接收参数
    const message = ctx.args[0] || {};

    // 当前连接
    const socket = ctx.socket;
    const id = socket.id;
    const { live_id, token } = message;

    // 验证用户token
    const user = await this.checkToken(token);
    if (!user) {
      return;
    }
    // 验证当前直播间是否存在或是否处于直播中
    const msg = await service.live.checkStatus(live_id);

    if (msg) {
      socket.emit(id, ctx.helper.parseMsg('error', msg));
      return;
    }

    const room = 'live_' + live_id;
    // 用户加入房间,socket就是当前房间
    socket.join(room);

    const rooms = [ room ];
    // 加入redis存储中
    let list = await service.cache.get('userList_' + room);
    list = list ? list : [];
    list = list.filter(item => item.id !== user.id);
    list.unshift({
      id: user.id,
      name: user.username,
      avatar: user.avatar,
    });
    service.cache.set('userList_' + room, list);

    // 更新在线用户列表
    nsp.adapter.clients(rooms, (err, clients) => {
      nsp.to(room).emit('online', {
        clients,
        action: 'join',
        user: {
          id: user.id,
          name: user.username,
          avatar: user.avatar,
        },
        data: list,
      });
    });

    // 加入播放历史记录
    const liveUser = await app.model.LiveUser.findOne({
      where: {
        user_id: user.id,
        live_id,
      },
    });

    if (!liveUser) {
      app.model.LiveUser.create({
        user_id: user.id,
        live_id,
      });
      // 总观看人数+1
      const live = await service.live.exist(live_id);
      if (live) {
        live.increment({
          look_count: 1,
        });
      }
    }
  }
  // 离开直播间
  async leaveLive() {
    const { ctx, app, service } = this;
    const nsp = app.io.of('/');
    // 接收参数
    const message = ctx.args[0] || {};

    // 当前连接
    const socket = ctx.socket;
    const id = socket.id;

    const { live_id, token } = message;

    // 验证用户token
    const user = await this.checkToken(token);
    if (!user) {
      return;
    }
    // 验证当前直播间是否存在或是否处于直播中
    const msg = await service.live.checkStatus(live_id);
    if (msg) {
      socket.emit(id, ctx.helper.parseMsg('error', msg, {
        notoast: true,
      }));
      return;
    }

    const room = 'live_' + live_id;
    // 用户离开房间
    socket.leave(room);
    const rooms = [ room ];

    // 更新在线用户列表
    nsp.adapter.clients(rooms, (err, clients) => {
      nsp.to(room).emit('online', {
        clients,
        action: 'leave',
        user: {
          id: user.id,
          name: user.username,
          avatar: user.avatar,
        },
      });
    });

    // 更新redis存储
    let list = await service.cache.get('userList_' + room);
    if (list) {
      list = list.filter(item => item.id !== user.id);
      service.cache.set('userList_' + room, list);
    }

  }
  // 聊天链接
  async chatConnect() {
    console.log('chatConnect');
    const { ctx, service } = this;
    const socket = ctx.socket;
    const id = socket.id;
    const message = ctx.args[0] || {};
    const { userId } = message;
    let list = await service.cache.get('chatList');
    list = list ? list : [];
    list = list.filter(item => item.id !== userId);
    list.push({
      id: userId,
      socketId: id,
    });
    service.cache.set('chatList', list);
  }
  // 聊天记录发送
  async chatSend() {
    const { ctx, service, app } = this;
    const message = ctx.args[0] || {};
    const { from_id, from_name, from_avatar,
      to_id, to_name, to_avatar, data, create_time } = message;
    await app.model.Chat.create({
      from_id,
      from_name,
      from_avatar,
      to_id,
      to_name,
      to_avatar,
      data,
      create_time,
    });
    // 获取对方的socket.id
    const list = await service.cache.get('chatList');
    let socketId = '';
    list.forEach(item => {
      if (item.id === to_id) {
        socketId = item.socketId;
      }
    });
    const nsp = app.io.of('/');
    if (socketId !== '') { // 对方在线
      if (nsp.sockets[socketId]) {
        nsp.sockets[socketId].emit('chat', message);// 发送
      }
    }
  }
  // 直播间发送消息
  async comment() {
    const { ctx, app, service } = this;
    const nsp = app.io.of('/');
    // 接收参数
    const message = ctx.args[0] || {};
    // 当前连接
    const socket = ctx.socket;
    const id = socket.id;
    const { live_id, token, data } = message;
    if (!data) {
      socket.emit(id, ctx.helper.parseMsg('error', '评论内容不能为空'));
      return;
    }
    // 验证用户token
    const user = await this.checkToken(token);
    if (!user) {
      return;
    }
    // 验证当前直播间是否存在或是否处于直播中
    const msg = await service.live.checkStatus(live_id);
    if (msg) {
      socket.emit(id, ctx.helper.parseMsg('error', msg));
      return;
    }
    const room = 'live_' + live_id;
    // 推送消息到直播间
    nsp.to(room).emit('comment', {
      user: {
        id: user.id,
        name: user.nickname || user.username,
        avatar: user.avatar,
      },
      id: ctx.randomString(10),
      content: data,
    });

    app.model.Comment.create({
      content: data,
      live_id,
      user_id: user.id,
    });

  }

  // 直播间送礼物
  async gift() {
    const { ctx, app, service } = this;
    const nsp = app.io.of('/');
    // 接收参数
    const message = ctx.args[0] || {};

    // 当前连接
    const socket = ctx.socket;
    const id = socket.id;

    const { live_id, token, gift_id } = message;

    // 验证用户token
    const user = await this.checkToken(token);
    if (!user) {
      return;
    }
    // 验证当前直播间是否存在或是否处于直播中
    const msg = await service.live.checkStatus(live_id);
    if (msg) {
      socket.emit(id, ctx.helper.parseMsg('error', msg));
      return;
    }

    const room = 'live_' + live_id;

    // 验证礼物是否存在
    const gift = await app.model.Gift.findOne({
      where: {
        id: gift_id,
      },
    });

    if (!gift) {
      socket.emit(id, ctx.helper.parseMsg('error', '该礼物不存在'));
      return;
    }

    // 当前用户金币是否不足
    if (user.coin < gift.coin) {
      socket.emit(id, ctx.helper.parseMsg('error', '硬币不足'));
      return;
    }

    // 扣除金币
    user.coin -= gift.coin;
    await user.save();

    // 写入到礼物记录表
    app.model.LiveGift.create({
      live_id,
      user_id: user.id,
      gift_id,
    });

    // 直播间总金币数+1
    const live = await app.model.Live.findOne({
      where: {
        id: live_id,
      },
    });
    live.coin += gift.coin;
    live.save();

    // 推送消息到直播间
    nsp.to(room).emit('gift', {
      avatar: user.avatar,
      username: user.nickname || user.username,
      gift_name: gift.name,
      gift_image: gift.image,
      gift_coin: gift.coin,
      num: 1,
    });

  }
}

module.exports = NspController;
