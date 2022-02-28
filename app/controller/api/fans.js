'use strict';
const { Op } = require('sequelize');
const Controller = require('egg').Controller;
class FansControll extends Controller {
  async getAllFans() {
    const { ctx, app } = this;
    const { fllower_id } = ctx.request.body;
    const res = await app.model.Fans.findAll({
      where: {
        fllower_id,
      },
      attributes: [ 'fans_id' ],
    });
    if (res.length > 0) {
      const nextRes = res.map(item => item.dataValues.fans_id);
      const finalRes = await app.model.User.findAll({
        where: {
          id: {
            [Op.or]: nextRes,
          },
        },
        attributes: [ 'username', 'description', 'avatar', 'id' ],
      });
      ctx.apiSuccess(finalRes);
    } else {
      ctx.apiSuccess([], '还没有粉丝呢!多发动态吸引别人吧~');
    }
  }
  async getAllFllowers() {
    const { ctx, app } = this;
    const { fans_id } = ctx.request.body;
    const res = await app.model.Fans.findAll({
      where: {
        fans_id,
      },
      attributes: [ 'fllower_id' ],
    });
    if (res.length > 0) {
      const nextRes = res.map(item => item.dataValues.fllower_id);
      const finalRes = await app.model.User.findAll({
        where: {
          id: {
            [Op.or]: nextRes,
          },
        },
        attributes: [ 'username', 'description', 'avatar', 'id' ],
      });
      ctx.apiSuccess(finalRes);
    } else {
      ctx.apiSuccess([], '还没有关注的人呢~');
    }
  }
  async getNumCount() {
    const { ctx, app } = this;
    const { id } = ctx.request.body;
    // 查找我关注的人数
    const fllowerCount = await app.model.Fans.count({
      where: {
        fans_id: id,
      },
    });
    // 查找粉丝数
    const fansCount = await app.model.Fans.count({
      where: {
        fllower_id: id,
      },
    });
    const res = { fllowerCount, fansCount };
    ctx.apiSuccess(res);
  }
}
module.exports = FansControll;
