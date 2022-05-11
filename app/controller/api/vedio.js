'use strict';

const Controller = require('egg').Controller;
class VedioController extends Controller {
  // 上传视频
  async vedioMes() {
    const { ctx, app } = this;
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
      comment_count: 0,
      hot_count: 0,
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
      include: app.model.User,
    });
    ctx.apiSuccess(res);
  }
  // 添加视频评论
  async addComment() {
    const { app, ctx } = this;
    const { user_id, vedio_id, content, orign_user_id } = ctx.request.body;
    const res = await app.model.VedioComment.create({
      user_id,
      vedio_id,
      content,
      orign_user_id,
    });
    // 更新视频热度
    // 更新视频的点赞数量
    const video = await app.model.Vedio.findOne({
      where: {
        id: vedio_id,
      },
    });
    video.comment_count += 1;
    video.hot_count += 1;
    await video.save();
    ctx.apiSuccess(res);
  }
  async getCommentByUser() {
    const { app, ctx } = this;
    const { orign_user_id } = ctx.request.body;
    const res = await app.model.VedioComment.findAll({
      where: {
        orign_user_id,
      },
      include: [ app.model.User, app.model.Vedio ],
    });
    console.log(res);
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
    const { user_id, vedio_id, status, orign_user_id } = ctx.request.body;
    const like = await app.model.Like.findOne({// 更新喜爱列表
      where: {
        user_id,
        vedio_id,
      },
    });
    like.status = status;
    // 更新视频的点赞数量
    const video = await app.model.Vedio.findOne({
      where: {
        id: vedio_id,
      },
    });
    if (status === true) {
      video.like_count += 1;
      video.hot_count += 1;
    } else {
      video.like_count -= 1;
      video.hot_count -= 1;
    }
    const user = await app.model.User.findOne({
      where: {
        id: orign_user_id,
      },
    });
    user.get_likes += 1;
    await user.save();
    await video.save();
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
  // 根据点击标签，返回根据热度排行的数据
  async getVedioByTag() {
    const { app, ctx } = this;
    const { vedio_tag } = ctx.request.body;
    const res = await app.model.Vedio.findAll({
      where: {
        vedio_tag,
      },
      order: [[ 'hot_count', 'DESC' ]],
    });
    ctx.apiSuccess(res);
  }
  // 根据用户的tag返回相关的视频或直播
  async getVedioByUserTags() {
    const { app, ctx } = this;
    const { user } = ctx.request.body;
    // 取到用户的tags
    let tags = user.tags;
    if (typeof tags === 'string') {
      tags = JSON.parse(tags);
    }
    // 查询用户感兴趣的直播
    const res = {
      video: [],
      live: [],
    };
    // 查询用户感兴趣的直播
    for (let i = 0; i < tags.length; i++) {
      const lives = await app.model.Live.findAll({
        limit: 2,
        where: {
          live_tag: tags[i],
          status: 1,
        },
        include: app.model.User,
      });
      if (Array.isArray(lives)) {
        res.live.push(...lives);
      } else {
        res.live.push(lives);
      }
    }
    // 分组查询用户感兴趣的视频
    for (let i = 0; i < tags.length; i++) {
      // 查询用户感兴趣的视频
      const video = await app.model.Vedio.findAll({
        where: {
          vedio_tag: tags[i],
        },
      });
      if (Array.isArray(video)) {
        res.video.push(...video);
      } else {
        res.video.push(video);
      }
    }
    res.video.sort((a, b) => b.hot_count - a.hot_count);// 短视频热度排行
    ctx.apiSuccess(res);
  }
}
module.exports = VedioController;
