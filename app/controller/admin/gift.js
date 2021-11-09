'use strict';

const Controller = require('egg').Controller;

class GiftController extends Controller {
  // 列表
  async index() {
    const { ctx } = this;

    const data = await ctx.page('Gift');

    await ctx.renderTemplate({
      title: '礼物列表',
      tempType: 'table',
      table: {
        // 按钮
        buttons: {
          // 新增操作
          add: '/admin/gift/create',
        },
        // 表头
        columns: [{
          title: '礼物',
          fixed: 'left',
          render(item) {
            const image = item.image ? item.image : '/public/assets/img/profiles/avatar-03.jpg';
            return `
              <h2 class="table-avatar">
                  <a href="profile.html" class="avatar avatar-sm mr-2"><img class="avatar-img rounded-circle" src="${image}"></a>
                  <a href="profile.html">${item.name}</a>
              </h2>
            `;
          },
        }, {
          title: '金币',
          fixed: 'center',
          key: 'coin',
        }, {
          title: '创建时间',
          fixed: 'center',
          width: 180,
          key: 'created_time',
        }, {
          title: '操作',
          width: 200,
          fixed: 'center',
          action: {
            edit(id) {
              return `/admin/gift/edit/${id}`;
            },
            delete(id) {
              return `/admin/gift/delete/${id}`;
            },
          },
        }],
      },
      data,
    });
  }
  // 创建表单
  async create() {
    const { ctx } = this;
    await ctx.renderTemplate({
      // 页面标题
      title: '创建礼物',
      // 模板类型 form表单，table表格分页
      tempType: 'form',
      // 表单配置
      form: {
        // 提交地址
        action: '/admin/gift',
        // 字段配置
        fields: [{
          label: '礼物名称',
          type: 'text',
          name: 'name',
          placeholder: '礼物名称',
        }, {
          label: '礼物图标',
          type: 'file',
          name: 'image',
          placeholder: '礼物图标',
        }, {
          label: '金币',
          type: 'number',
          name: 'coin',
          placeholder: '金币',
        }],
      },
      // 新增成功跳转路径
      successUrl: '/admin/gift',
    });
  }

  // 创建逻辑
  async save() {
    const { ctx, app } = this;

    ctx.validate({
      name: {
        type: 'string',
        required: true,
        desc: '礼物名称',
      },
      image: {
        type: 'string',
        required: false,
        desc: '礼物图标',
      },
      coin: {
        type: 'int',
        required: true,
        defValue: 0,
        desc: '金币',
      },
    });

    const { name, image, coin } = ctx.request.body;

    const res = await app.model.Gift.create({
      name, image, coin,
    });

    ctx.apiSuccess(res);
  }

  // 编辑表单页
  async edit() {
    const { ctx, app } = this;
    const id = ctx.params.id;

    let data = await app.model.Gift.findOne({
      where: {
        id,
      },
    });
    if (!data) {
      return await ctx.pageFail('该记录不存在');
    }

    data = JSON.parse(JSON.stringify(data));

    await ctx.renderTemplate({
      id,
      title: '修改礼物',
      tempType: 'form',
      form: {
        // 提交地址
        action: '/admin/gift/' + id,
        // 字段配置
        fields: [{
          label: '礼物名称',
          type: 'text',
          name: 'name',
          placeholder: '礼物名称',
        }, {
          label: '礼物图标',
          type: 'file',
          name: 'image',
          placeholder: '礼物图标',
        }, {
          label: '金币',
          type: 'number',
          name: 'coin',
          placeholder: '金币',
        }],
        // 默认值
        data,
      },
      // 修改成功跳转路径
      successUrl: '/admin/gift',
    });
  }

  // 更新逻辑
  async update() {
    const { ctx, app } = this;
    ctx.validate({
      id: {
        type: 'int',
        required: true,
      },
      name: {
        type: 'string',
        required: true,
        desc: '礼物名称',
      },
      image: {
        type: 'string',
        required: false,
        desc: '礼物图标',
      },
      coin: {
        type: 'int',
        required: true,
        defValue: 0,
        desc: '金币',
      },
    });

    const id = ctx.params.id;
    const { name, image, coin } = ctx.request.body;

    const gift = await app.model.Gift.findOne({
      where: {
        id,
      },
    });
    if (!gift) {
      return ctx.apiFail('该记录不存在');
    }

    gift.name = name;
    gift.image = image;
    gift.coin = coin;

    ctx.apiSuccess(await gift.save());

  }

  // 删除
  async delete() {
    const { ctx, app } = this;
    const id = ctx.params.id;
    await app.model.Gift.destroy({
      where: {
        id,
      },
    });
    ctx.toast('删除成功', 'success');
    ctx.redirect('/admin/gift');
  }
}

module.exports = GiftController;
