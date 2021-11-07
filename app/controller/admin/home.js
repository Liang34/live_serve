'use strict';

const Controller = require('egg').Controller;
class HomeController extends Controller {
  // 后台首页
  async index() {
    const { ctx } = this;
    await ctx.render('admin/home/index.html');
  }
}
module.exports = HomeController;
