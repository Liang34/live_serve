'use strict';

module.exports = () => {
  return async (ctx, next) => {
    const menus = [{
      name: '主面板',
      icon: 'fe-home',
      url: '/admin',
    }, {
      name: '用户管理',
      icon: 'fe-user-plus',
      url: '/admin/user',
    }, {
      name: '直播间管理',
      icon: 'fe-document',
      url: '/admin/live',
    }, {
      name: '礼物管理',
      icon: 'fe-vector',
      url: '/admin/gift',
    }, {
      name: '订单管理',
      icon: 'fe-cart',
      url: '/admin/order',
    }, {
      name: '管理员管理',
      icon: 'fe-table',
      url: '/admin/manager',
    }];

    ctx.locals.sidebar = menus.map(item => {
      if ((ctx.request.url === '/admin' && item.url === '/admin') || (ctx.request.url.startsWith(item.url) && ctx.request.url !== '/admin') && item.url !== '/admin') {
        item.active = 'active';
      }
      return item;
    });

    await next();
  };
};
