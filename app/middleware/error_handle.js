'use strict';

module.exports = app => {
  return async function(ctx, next) {
    try {
      await next();

      if (ctx.status === 404 && !ctx.body) {
        ctx.body = {
          msg: 'fail',
          data: '404',
        };
      }

    } catch (err) {
      // 记录一条错误日志
      app.emit('error', err, ctx);

      const status = err.status || 500;

      // 生产环境时 500 错误的详细错误内容不返回给客户端，因为可能包含敏感信息
      let error = status === 500 && app.config.env === 'prod'
        ? '服务端错误'
        : err.message;

      ctx.body = {
        msg: 'fail',
        data: error,
      };

      // 参数验证异常
      if (status === 422 && err.message === 'Validation Failed') {
        if (err.errors && Array.isArray(err.errors)) {
          error = err.errors[0].err[0] ? err.errors[0].err[0] : err.errors[0].err[1];
        }
        ctx.body = {
          msg: 'fail',
          data: error,
        };
      }

      ctx.status = status;
    }
  };
};
