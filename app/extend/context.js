'use strict';

const crypto = require('crypto');

module.exports = {
  // 成功提示
  apiSuccess(data = '', msg = 'ok', code = 200) {
    this.body = {
      msg,
      data,
    };
    this.status = code;
  },
  // 失败提示
  apiFail(data = '', msg = 'fail', code = 400) {
    this.body = {
      msg,
      data,
    };
    this.status = code;
  },
  // 页面找不到
  async pageFail(data = '', code = 404) {
    return await this.render('admin/common/404.html', {
      data,
      code,
    });
  },
  // 分页
  async page(modelName, where = {}, options = {}) {
    const page = this.query.page ? parseInt(this.query.page) : 1;
    const limit = this.query.limit ? parseInt(this.query.limit) : 10;
    const offset = (page - 1) * limit;
    // 如果不传默认按照id排序
    if (!options.order) {
      options.order = [
        [ 'id', 'DESC' ],
      ];
    }

    const res = await this.app.model[modelName].findAndCountAll({
      where,
      offset,
      limit,
      ...options,
    });

    // 总页数
    const totalPage = Math.ceil(res.count / limit);

    let query = {
      ...this.query,
    };
    if (query.hasOwnProperty('page')) {
      delete query.page;
    }
    if (query.hasOwnProperty('limit')) {
      delete query.limit;
    }

    // 对象转&拼接字符串
    const urlEncode = (param, key, encode) => {
      if (param == null) return '';
      let paramStr = '';
      const t = typeof (param);
      if (t === 'string' || t === 'number' || t === 'boolean') {
        paramStr += '&' + key + '=' + ((encode == null || encode) ? encodeURIComponent(param) : param);
      } else {
        for (const i in param) {
          const k = key == null ? i : key + (param instanceof Array ? '[' + i + ']' : '.' + i);
          paramStr += urlEncode(param[i], k, encode);
        }
      }
      return paramStr;
    };
    query = urlEncode(query);

    let pageEl = '';
    for (let index = 1; index <= totalPage; index++) {
      let active = '';
      if (page === index) {
        active = 'active';
      }
      pageEl += `
      <li class="page-item ${active}">
      <a class="page-link" href="?page=${index}&limit=${limit}${query}">${index}</a></li>
      `;
    }
    const preDisabled = page <= 1 ? 'disabled' : '';
    const nextDisabled = page >= totalPage ? 'disabled' : '';

    const pageRender = `
        <ul class="pagination">
            <li class="page-item ${preDisabled}">
                <a class="page-link" href="?page=${page - 1}&limit=${limit}${query}" aria-label="Previous">
                    <span aria-hidden="true">«</span>
                    <span class="sr-only">Previous</span>
                </a>
            </li>

            ${pageEl}

            <li class="page-item ${nextDisabled}">
                <a class="page-link" href="?page=${page + 1}&limit=${limit}${query}" aria-label="Next">
                    <span aria-hidden="true">»</span>
                <span class="sr-only">Next</span>
                </a>
            </li>
        </ul>
        `;

    this.locals.pageRender = pageRender;

    return res.rows;
  },
  // 渲染公共模板
  async renderTemplate(params = {}) {
    // 获取cookie中的消息提示(闪存)
    const toast = this.cookies.get('toast', {
      // 中文需要解密
      encrypt: true,
    });
    params.toast = toast ? JSON.parse(toast) : null;
    await this.render('admin/common/template.html', params);
  },
  // 消息提示
  toast(msg, type = 'danger') {
    this.cookies.set('toast', JSON.stringify({
      msg,
      type,
    }), {
      maxAge: 1500,
      encrypt: true,
    });
  },
  // 验证密码
  async checkPassword(password, hash_password) {
    // 先对需要验证的密码进行加密
    const hmac = crypto.createHash('sha256', this.app.config.crypto.secret);
    hmac.update(password);
    password = hmac.digest('hex');
    const res = password === hash_password;
    if (!res) {
      // this.throw(400, '密码错误');
      return false;
    }
    return true;
  },
  // 生成token
  getToken(value) {
    return this.app.jwt.sign(value, this.app.config.jwt.secret);
  },
  // 验证token
  checkToken(token) {
    console.log(typeof token);
    console.log('token', token);
    return this.app.jwt.verify(token, this.app.config.jwt.secret);
  },
  randomString(length) {
    const chars = '0123456789abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ';
    let result = '';
    for (let i = length; i > 0; --i) result += chars[Math.floor(Math.random() * chars.length)];
    return result;
  },
  // 用户上线
  async online(user_id) {
    const {
      service,
      app,
    } = this;
    const pid = process.pid;
    // 下线其他设备
    const opid = await service.cache.get('online_' + user_id);
    if (opid) {
      // 通知对应进程用户下线
      app.messenger.sendTo(opid, 'offline', user_id);
    }
    // 存储上线状态
    service.cache.set('online_' + user_id, pid);
  },
  // 发送或者存到消息队列中
  async sendAndSaveMessage(to_id, message, msg = 'ok') {
    const { app, service } = this;
    const current_user_id = this.authUser.id;

    // 拿到接受用户所在子进程
    const pid = await service.cache.get('online_' + to_id);

    if (pid) {
      // 消息推送
      app.messenger.sendTo(pid, 'send', {
        to_id,
        message,
        msg,
      });
      // 存到历史记录当中
      if (msg === 'ok') {
        service.cache.setList(`chatlog_${to_id}_${message.chat_type}_${current_user_id}`, message);
      }
    } else {
      service.cache.setList('getmessage_' + to_id, {
        message,
        msg,
      });
    }

    // 拿到对方的socket
    // let socket = app.ws.user[to_id];
    // 验证对方是否在线？不在线记录到待接收消息队列中；在线，消息推送，存储到对方的聊天记录中 chatlog_对方用户id_user_当前用户id
    // if (app.ws.user && app.ws.user[to_id]) {
    //     // 消息推送
    //     app.ws.user[to_id].send(JSON.stringify({
    //         msg,
    //         data: message
    //     }));
    //     // 存到历史记录当中
    //     if (msg === 'ok') {
    //         service.cache.setList(`chatlog_${to_id}_${message.chat_type}_${current_user_id}`, message);
    //     }
    // } else {
    //     service.cache.setList('getmessage_' + to_id, {
    //         message,
    //         msg
    //     });
    // }
  },
};
