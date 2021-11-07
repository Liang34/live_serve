'use strict';

const Controller = require('egg').Controller;
class HomeController extends Controller {
  // 后台首页
  async index() {
    const { ctx } = this;
    await ctx.render('admin/home/index.html');
  }
  // 登录页
  async login() {
    const { ctx } = this;
    let toast = ctx.cookies.get('toast', { encrypt: true });
    toast = toast ? JSON.parse(toast) : null;
    await ctx.render('/admin/home/login.html', {
      toast,
    });
  }
  // 登录逻辑
  async loginevent() {
    const { ctx, app } = this;
    // 参数验证
    ctx.validate({
      username: {
        type: 'string',
        required: true,
        desc: '用户名',
      },
      password: {
        type: 'string',
        required: true,
        desc: '密码',
      },
    });

    const { username, password } = ctx.request.body;

    const manager = await app.model.Manager.findOne({
      where: {
        username,
      },
    });
    if (!manager) {
      ctx.throw(400, '用户不存在或已经被禁用');
    }

    // 密码验证
    await ctx.checkPassword(password, manager.password);

    // 存于session中
    ctx.session.auth = manager;

    return ctx.apiSuccess('ok');
  }
  // 退出登录
  async logout() {
    const { ctx } = this;
    ctx.session.auth = null;
    ctx.toast('退出登录成功', 'success');
    ctx.redirect('/admin/login');
  }
}
module.exports = HomeController;
