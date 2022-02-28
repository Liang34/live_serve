/* eslint valid-jsdoc: "off" */

'use strict';

/**
 * @param {Egg.EggAppInfo} appInfo app info
 */
module.exports = appInfo => {
  /**
   * built-in config
   * @type {Egg.EggAppConfig}
   **/
  const config = exports = {};

  // use for cookie sign key, should change to your own and keep security
  config.keys = appInfo.name + '_1636162922921_7970';

  // add your middleware config here
  config.middleware = [ 'adminSidebar', 'auth' ];

  // add your user config here
  config.auth = {
    match: [
      '/api/logout',
      '/api/live/create',
      '/api/live/changestatus',
      '/api/gift/wxpay',
      '/api/user/info',
    ],
  };
  const userConfig = {
    // myAppName: 'egg',
  };
  config.mediaServer = {
    rtmp: {
      port: 23480,
      chunk_size: 60000,
      gop_cache: true,
      ping: 30,
      ping_timeout: 60,
    },
    http: {
      port: 23481,
      allow_origin: '*',
    },
    auth: {
      play: true,
      publish: true,
      secret: 'nodemedia2017privatekey',
    },
  };
  config.security = {
    // csrf
    csrf: {
      headerName: 'x-csrf-token',
      ignore: ctx => {
        return ctx.request.url.startsWith('/api');
      },
    },
    // 跨域白名单
    // domainWhiteList: ['http://localhost:3000'],
  };
  // 允许跨域的方法
  config.cors = {
    origin: '*',
    allowMethods: 'GET, PUT, POST, DELETE, PATCH',
  };
  config.sequelize = {
    dialect: 'mysql',
    host: '127.0.0.1',
    username: 'root',
    password: 'root',
    port: 3306,
    database: 'egg-live',
    // 中国时区
    timezone: '+08:00',
    define: {
      // 取消数据表名复数
      freezeTableName: true,
      // 自动写入时间戳 created_at updated_at
      timestamps: true,
      // 字段生成软删除时间戳 deleted_at
      // paranoid: true,
      createdAt: 'created_time',
      updatedAt: 'updated_time',
      // deletedAt: 'deleted_time',
      // 所有驼峰命名格式化
      underscored: true,
    },
  };
  config.view = {
    mapping: {
      '.html': 'nunjucks',
    },
  };
  config.valparams = {
    locale: 'zh-cn',
    throwError: true,
  };
  config.crypto = {
    secret: 'qhdgw@45ncashdaksh2!#@3nxjdas*_672',
  };
  config.jwt = {
    secret: 'qhdgw@45ncashdaksh2!#@3nxjdas*_672',
  };
  // redis存储
  config.redis = {
    client: {
      port: 6379, // Redis port
      host: '127.0.0.1', // Redis host
      password: '',
      db: 2,
    },
  };
  config.webUrl = 'http://127.0.0.1:7001';// 部署域名链接
  // 微信支付配置
  config.tenpay = {
    client: {
      appid: 'wxc559eade7d0a3bde',
      mchid: '1554108981',
      partnerKey: '8b07811ec793049f1c97793464c7049f',
      notify_url: config.webUrl + '/api/gift/notify',
      // sandbox: true
    },
  };
  return {
    ...config,
    ...userConfig,
  };
};
