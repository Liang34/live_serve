'use strict';

const Controller = require('egg').Controller;
// 引入模块
const md5 = require('md5');
class LiveController extends Controller {
  // 创建直播间
  async save() {
    const { ctx, app } = this;
    const user_id = ctx.authUser.id;
    const { title, cover, tag } = ctx.request.body;
    const key = ctx.randomString(20);
    const res = await app.model.Live.create({
      title,
      cover,
      key,
      user_id,
      live_tag: tag,
    });
    // 生成签名,用于直播推流链接地址推流
    const sign = this.sign(key);
    ctx.apiSuccess({
      data: res,
      sign,
    });
  }
  // 修改直播间
  async changeStatus() {
    const { ctx, app } = this;
    const user_id = ctx.authUser.id;
    // 参数验证
    ctx.validate({
      id: {
        type: 'int',
        required: true,
        desc: '直播间ID',
      },
      type: {
        type: 'string',
        required: true,
        range: {
          in: [ 'play', 'pause', 'stop' ],
        },
      },
    });
    const { id, type } = ctx.request.body;
    const live = await app.model.Live.findOne({
      where: {
        id,
        user_id,
      },
    });
    if (!live) {
      return ctx.apiFail('该直播间不存在');
    }
    // 停播的不能修改状态
    if (live.status === 3) {
      return ctx.apiFail('该直播已结束');
    }
    const status = {
      play: 1,
      pause: 2,
      stop: 3,
    };
    live.status = status[type];
    await live.save();
    ctx.apiSuccess('ok');
  }
  sign(key) {
    const { app } = this;
    const secret = app.config.mediaServer.auth.secret;
    const expire = parseInt((Date.now() + 100000000) / 1000);
    const hashValue = md5(`/live/${key}-${expire}-${secret}`);
    return `${expire}-${hashValue}`;
  }
  // 直播列表
  async list() {
    const { ctx, app } = this;
    ctx.validate({
      page: {
        required: true,
        desc: '页码',
        type: 'int',
      },
    });
    const page = ctx.params.page;
    const limit = 8;
    const offset = (page - 1) * limit;
    const rows = await app.model.Live.findAll({
      limit, offset,
      where: {
        status: 1,
      },
      include: app.model.User,
    });
    ctx.apiSuccess(rows);
  }
  async read() {
    const { ctx, app } = this;
    ctx.validate({
      id: {
        required: true,
        desc: '直播间ID',
        type: 'int',
      },
    });
    const id = ctx.params.id;
    const live = await app.model.Live.findOne({
      where: {
        id,
      },
      include: [{
        model: app.model.User,
        attributes: [ 'id', 'username', 'avatar' ],
      }],
    });
    if (!live) {
      return ctx.apiFail('该直播间不存在');
    }
    // 生成签名
    let sign = null;
    // 直播未结束
    if (live.status !== 3) {
      sign = this.sign(live.key);
    }
    ctx.apiSuccess({
      data: live,
      sign,
    });
  }
  // 查询某人直播
  async userLive() {
    const { ctx, app } = this;
    const { id } = ctx.request.body;
    const lives = await app.model.Live.findAll({
      where: {
        user_id: id,
      },
      include: app.model.User,
    });
    ctx.apiSuccess(lives);
  }
}
module.exports = LiveController;
