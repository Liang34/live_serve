'use strict';

const Controller = require('egg').Controller;
class VedioController extends Controller {
  // 上传视频
  async vedioMes() {
    const { ctx, app } = this;
    console.log(ctx.request.body);
    const {
      vedio_name,
      vedio_path,
      vedio_desc,
      like_count,
      vedio_cover,
      vedio_tag,
      user_id,
    } = ctx.request.body;
    const updated_time = new Date();
    const created_time = new Date();
    console.log(vedio_path);
    const vedio = await app.model.Vedio.create({
      vedio_name,
      vedio_path,
      vedio_desc,
      like_count,
      vedio_cover,
      vedio_tag,
      user_id,
      updated_time,
      created_time,
    });
    if (!vedio) {
      ctx.throw(400, '上传失败，请稍后再试');
    }
    ctx.apiSuccess(vedio);
  }
  // 获取用户的视频
  async getAllPost() {
    const { ctx, app } = this;
    const { id } = ctx.request.body;
    const res = await app.model.Vedio.findAll({
      where: {
        user_id: id,
      },
    });
    ctx.apiSuccess(res);
  }
  // 添加视频评论
  async addComment() {
    const { app, ctx } = this;
    const { user_id, vedio_id, content } = ctx.request.body;
    const res = await app.model.VedioComment.create({
      user_id,
      vedio_id,
      content,
    });
    ctx.apiSuccess(res);
  }
  // 获取所有评论
  async getAllComment() {
    const { ctx, app } = this;
    const { vedio_id } = ctx.request.body;
    const res = await app.model.VedioComment.findAll({
      where: {
        vedio_id,
      },
      include: app.model.User,
    });
    const fRes = res.map(item => {
      const newItem = {};
      newItem.id = item.id;
      newItem.content = item.content;
      newItem.created_time = item.user.created_time;
      newItem.username = item.user.username;
      newItem.avatar = item.user.avatar;
      return newItem;
    });
    ctx.apiSuccess(fRes);
  }
  // 获取点赞状态
  async getLikeStatue() {
    const { ctx, app } = this;
    const { user_id, vedio_id } = ctx.request.body;
    // 如果不存在则创建
    const res = await app.model.Like.findOrCreate({
      where: {
        user_id,
        vedio_id,
      },
      defaults: {
        status: false,
      },
    });
    ctx.apiSuccess(res);
  }
  // 改变状态
  async changeStatus() {
    const { ctx, app } = this;
    const { user_id, vedio_id, status } = ctx.request.body;
    const like = await app.model.Like.findOne({
      where: {
        user_id,
        vedio_id,
      },
    });
    console.log(like);
    like.status = status;
    // const res = await like.update({
    //   state: false,
    // });
    ctx.apiSuccess(await like.save());
  }
  // 获取用户所有的点赞视频
  async getAllLike() {
    const { app, ctx } = this;
    const { user_id } = ctx.request.body;
    const res = await app.model.Like.findAll({
      where: {
        user_id,
        status: true,
      },
      include: app.model.Vedio,
    });
    ctx.apiSuccess(res);
  }
}
module.exports = VedioController;
