'use strict';

/**
 * @param {Egg.Application} app - egg application
 */
module.exports = app => {
  const { router, controller, io } = app;
  router.get('/admin', controller.admin.home.index);

  router.get('/admin/manager/delete/:id', controller.admin.manager.delete);
  router.get('/admin/manager/edit/:id', controller.admin.manager.edit);
  router.get('/admin/manager/create', controller.admin.manager.create);
  router.get('/admin/manager', controller.admin.manager.index);
  router.post('/admin/manager', controller.admin.manager.save);
  router.post('/admin/manager/:id', controller.admin.manager.update);

  router.get('/admin/login', controller.admin.home.login);
  router.post('/admin/loginevent', controller.admin.home.loginevent);
  router.get('/admin/logout', controller.admin.home.logout);

  // userManager
  router.get('/admin/user/delete/:id', controller.admin.user.delete);
  router.get('/admin/user/edit/:id', controller.admin.user.edit);
  router.get('/admin/user', controller.admin.user.index);
  router.get('/admin/user/create', controller.admin.user.create);
  router.post('/admin/user', controller.admin.user.save);
  router.post('/admin/user/:id', controller.admin.user.update);

  // giftManager
  router.get('/admin/gift/delete/:id', controller.admin.gift.delete);
  router.get('/admin/gift/edit/:id', controller.admin.gift.edit);
  router.get('/admin/gift/create', controller.admin.gift.create);
  router.post('/admin/gift', controller.admin.gift.save);
  router.get('/admin/gift', controller.admin.gift.index);
  router.post('/admin/gift/:id', controller.admin.gift.update);

  router.post('/admin/upload', controller.admin.common.upload);

  // orderManager
  router.get('/admin/order/delete/:id', controller.admin.order.delete);
  router.get('/admin/order', controller.admin.order.index);

  // liveManager
  router.get('/admin/live', controller.admin.live.index);
  router.get('/admin/live/look/:id', controller.admin.live.look); // 观看记录
  router.get('/admin/live/gift/:id', controller.admin.live.gift);
  router.get('/admin/live/comment/:id', controller.admin.live.comment);
  router.get('/admin/live/close/:id', controller.admin.live.close);
  router.get('/admin/live/delete/:id', controller.admin.live.delete);

  // apiUser
  router.post('/api/reg', controller.api.user.reg);
  // 用户登录
  router.post('/api/login', controller.api.user.login);
  // 退出登录
  router.post('/api/logout', controller.api.user.logout);
  // 获取用户信息
  router.post('/api/user/info', controller.api.user.info);
  // 根据user_id获取用户id
  router.post('/api/user/query', controller.api.user.query);
  // 修改用户头像
  router.post('/api/user/updateAvatar', controller.api.user.updateAvatar);
  // 更新用户名
  router.post('/api/user/updateUserName', controller.api.user.updateUserName);
  // 更新性别
  router.post('/api/user/updateGender', controller.api.user.updateGender);
  // 更新简介
  router.post('/api/user/updateDesc', controller.api.user.updateDesc);
  // 更新标签
  router.post('/api/user/updateTags', controller.api.user.updateTags);
  // 更新硬币
  router.post('/api/user/updateCoin', controller.api.user.updateCoin);
  // 获取用户
  router.post('/api/live/userLive', controller.api.live.userLive);
  // 创建直播间
  router.post('/api/live/create', controller.api.live.save);
  // 修改直播状态
  router.post('/api/live/changestatus', controller.api.live.changeStatus);
  // 直播间列表
  router.get('/api/live/list/:page', controller.api.live.list);
  // 查看直播间
  router.get('/api/live/read/:id', controller.api.live.read);
  // 礼物列表
  router.get('/api/gift/list', controller.api.gift.list);
  // 图片上传： 返回路径地址与路径名
  router.post('/api/upload/imgUpload', controller.admin.common.upload);
  // 视频信息上传
  router.post('/api/upload/vedioMes', controller.api.vedio.vedioMes);
  // 获取所有粉丝
  router.post('/api/fans/getAllFans', controller.api.fans.getAllFans);
  // 获取所有关注者
  router.post('/api/fans/getAllFllowers', controller.api.fans.getAllFllowers);
  // 统计关注的数量与粉丝的数量
  router.post('/api/fans/getNumCount', controller.api.fans.getNumCount);
  // 是否是对方粉丝
  router.post('/api/fans/isFlower', controller.api.fans.isFlower);
  // 取关或者关注
  router.post('/api/fans/delFans', controller.api.fans.delFans);
  // 获取用户的所有作品
  router.post('/api/vedio/getAllPost', controller.api.vedio.getAllPost);
  // 新增视频评论
  router.post('/api/vedio/addComment', controller.api.vedio.addComment);
  // 获取所有评论
  router.post('/api/vedio/getAllComment', controller.api.vedio.getAllComment);
  // 获取用户点赞视频状态
  router.post('/api/vedio/getLikeStatue', controller.api.vedio.getLikeStatue);
  // 改变用户点赞状态
  router.post('/api/vedio/changeState', controller.api.vedio.changeStatus);
  // 获取用户所有的点赞视频
  router.post('/api/vedio/getAllLike', controller.api.vedio.getAllLike);
  // 根据vedio_tag返回视频类型
  router.post('/api/vedio/getVedioByTag', controller.api.vedio.getVedioByTag);
  // 根据用户的tag返回视频类型
  router.post('/api/vedio/getVedioByUserTags', controller.api.vedio.getVedioByUserTags);
  // 获取用户的评论
  router.post('/api/video/getCommentByUser', controller.api.vedio.getCommentByUser);
  // 获取离线消息
  router.post('/api/chat/getChatHistory', controller.api.chat.getChatHistory);
  // 发送消息
  router.post('/api/chat/send', controller.api.chat.send);
  // 获取历史记录
  router.post('/api/chat/getHistoryMessage', controller.api.chat.getHistoryMessage);
  // 直播间礼物
  io.of('/').route('joinLive', io.controller.live.joinLive);
  io.of('/').route('leaveLive', io.controller.live.leaveLive);
  io.of('/').route('comment', io.controller.live.comment);
  io.of('/').route('gift', io.controller.live.gift);
  io.of('/').route('chatConnect', io.controller.live.chatConnect);
  io.of('/').route('chatSend', io.controller.live.chatSend);
  // 用户验证
  // app.ws.use(async (ctx, next) => {
  //   // 获取参数 ws://localhost:7001/ws?token=123456
  //   // ctx.query.token
  //   // 验证用户token
  //   let user = {};
  //   const token = ctx.query.token;
  //   try {
  //     user = ctx.checkToken(token);
  //     // 验证用户状态
  //     // const userCheck = await app.model.User.findByPk(user.id);
  //     // if (!userCheck) {
  //     //   ctx.websocket.send(JSON.stringify({
  //     //     msg: 'fail',
  //     //     data: '用户不存在',
  //     //   }));
  //     //   return ctx.websocket.close();
  //     // }
  //     // if (!userCheck.status) {
  //     //   ctx.websocket.send(JSON.stringify({
  //     //     msg: 'fail',
  //     //     data: '你已被禁用',
  //     //   }));
  //     //   return ctx.websocket.close();
  //     // }
  //     // 用户上线
  //     app.ws.user = app.ws.user ? app.ws.user : {};
  //     // 下线其他设备
  //     // if (app.ws.user[user.id]) {
  //     //   app.ws.user[user.id].send(JSON.stringify({
  //     //     msg: "fail",
  //     //     data: '你的账号在其他设备登录'
  //     //   }));
  //     //   app.ws.user[user.id].close();
  //     // }
  //     // 记录当前用户id
  //     ctx.websocket.user_id = user.id;
  //     app.ws.user[user.id] = ctx.websocket;

  //     ctx.online(user.id);

  //     await next();
  //   } catch (err) {
  //     console.log(err);
  //     const fail = err.name === 'TokenExpiredError' ? 'token 已过期! 请重新获取令牌' : 'Token 令牌不合法!';
  //     ctx.websocket.send(JSON.stringify({
  //       msg: 'fail',
  //       data: fail,
  //     }));
  //     // 关闭连接
  //     ctx.websocket.close();
  //   }
  // });
  // app.ws.route('/ws', app.controller.api.chat.connect);
};
