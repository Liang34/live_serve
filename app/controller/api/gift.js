'use strict';

const Controller = require('egg').Controller;
class GiftController extends Controller {
  // 礼物列表
  async list() {
    const { ctx, app } = this;
    ctx.apiSuccess(await app.model.Gift.findAll());
  }
  // 微信支付
  async wxpay() {
    const { ctx, app } = this;
    const user_id = ctx.authUser.id;
    ctx.validate({
      price: {
        type: 'int',
        required: true,
        desc: '充值费用',
      },
    });
    const { price } = ctx.request.body;
    if (price < 1) {
      return ctx.apiFail('至少充值1元');
    }
    // 创建订单
    const no = ctx.randomString(20);
    const order = await app.model.Order.create({
      no,
      user_id,
      price,
    });
    if (!order) {
      return ctx.apiFail('创建订单失败');
    }
    // 支付
    const result = await app.tenpay.getAppParams({
      out_trade_no: no,
      body: '充值',
      total_fee: price * 100,
      trade_type: 'APP',
    });
    ctx.apiSuccess(result);
  }
  // 支付回调
  async notify() {
    const { ctx, app, service } = this;
    const info = ctx.request.weixin;
    if (!info || info.result_code !== 'SUCCESS') {
      return ctx.reply('支付失败');
    }

    // 查询当前订单
    const order = await app.model.Order.findOne({
      where: {
        no: info.out_trade_no,
      },
    });

    if (!order) {
      return ctx.reply('订单不存在');
    }

    // 修改订单状态
    order.status = 'success';
    order.save();

    // 修改用户余额
    const user = await service.user.exist(order.user_id);
    if (user) {
      user.coin += info.total_fee / 100;
      user.save();
    }

    ctx.reply();
  }
}
module.exports = GiftController;
