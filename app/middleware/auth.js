'use strict';
module.exports = (option, app) => {
  return async (ctx, next) => {
    // 1.获取token
    const token = ctx.header.token || ctx.query.token;
    if (!token) {
      ctx.throw(400, '您没有权限访问该接口');
    }

    // 2.token解密，换取用户信息
    let user = {};

    try {
      user = ctx.checkToken(token);
    } catch (error) {
      const fail = error.name === 'TokenExpiredError' ? 'token 已过期! 请重新获取令牌' : 'Token 令牌不合法!';
      ctx.throw(400, fail);
    }

    // 3.判断用户是否登录
    const t = await ctx.service.cache.get('user_' + user.id);
    if (!t || t !== token) {
      ctx.throw(400, 'Token 令牌不合法!');
    }

    // 4.判断用户是否存在
    user = await app.model.User.findOne({
      where: {
        id: user.id,
      },
    });
    if (!user) {
      ctx.throw(400, '用户不存在');
    }

    // 5.挂在到全局ctx
    ctx.authUser = user;

    await next();
  };
};
