'use strict';

// const crypto = require('crypto');

module.exports = {
  // 成功提示
  apiSuccess(data = '', msg = 'ok', code = 200) {
    this.body = { msg, data };
    this.status = code;
  },
  // 失败提示
  apiFail(data = '', msg = 'fail', code = 400) {
    this.body = { msg, data };
    this.status = code;
  },
  // 页面找不到
  async pageFail(data = '', code = 404) {
    return await this.render('admin/common/404.html', {
      data, code,
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

    let query = { ...this.query };
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
};
