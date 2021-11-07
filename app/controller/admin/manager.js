'use strict';

const Controller = require('egg').Controller;
class ManagerController extends Controller {
  // 创建管理员表单
  async create() {
    const { ctx } = this;
    await ctx.renderTemplate({
      // 页面标题
      title: '创建管理员',
      // 模板类型form表单，table表格分页
      tempType: 'form',
      // 表单配置
      form: {
        // 提交地址
        action: '/admin/manager',
        // 字段配置
        fields: [{
          label: '用户名',
          type: 'text',
          name: 'username',
          placeholder: '用户名',
        }, {
          label: '密码',
          type: 'text',
          name: 'password',
          placeholder: '密码',
        }],
        // 新增成功跳转路径
        successUrl: '/admin/manager',
      },
    });
  }
}
module.exports = ManagerController;
