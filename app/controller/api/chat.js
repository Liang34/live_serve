'use strict';

// app/controller/chat.js
const Controller = require('egg').Controller;
const { Op } = require('sequelize');
class ChatController extends Controller {
  // 连接socket
  async connect() {
    const { ctx, app, service } = this;
    if (!ctx.websocket) {
      ctx.throw(400, '非法访问');
    }

    // console.log(`clients: ${app.ws.clients.size}`);

    // 监听接收消息和关闭socket
    ctx.websocket
      .on('message', msg => {
        console.log('接收消息', msg);
      })
      .on('close', (code, reason) => {
        // 用户下线
        console.log('用户下线', code, reason);
        const user_id = ctx.websocket.user_id;
        // 移除redis中的用户上线记录
        service.cache.remove('online_' + user_id);
        if (app.ws.user && app.ws.user[user_id]) {
          delete app.ws.user[user_id];
        }
      });

  }
  // 发送消息
  async send() {
    const { ctx, app } = this;
    const { from_id, from_name, from_avatar,
      to_id, to_name, to_avatar, data, create_time } = ctx.request.body;
    const chat = await app.model.Chat.create({
      from_id,
      from_name,
      from_avatar,
      to_id,
      to_name,
      to_avatar,
      data,
      create_time,
    });
    // 获取对方的socket
    const socket = app.ws.user[to_id];
    if (socket) {
      socket.send(JSON.stringify({
        msg: 'ok',
        data: chat,
      }));
    }
    ctx.apiSuccess(chat);
  }

  // 获取历史消息
  async getChatHistory() {
    const { ctx, app } = this;
    const { to_id } = ctx.request.body;
    const chat = await app.model.Chat.findAll({
      where: {
        to_id,
      },
    });
    ctx.apiSuccess(chat);
  }
  // 获取历史聊天记录
  async getHistoryMessage() {
    const { ctx, app } = this;
    const { from_id, to_id } = ctx.request.body;
    const chatHistory = await app.model.Chat.findAll({
      where: {
        [Op.or]: [{ from_id, to_id }, { from_id: to_id, to_id: from_id }],
      },
    });
    ctx.apiSuccess(chatHistory);
  }
}
module.exports = ChatController;
