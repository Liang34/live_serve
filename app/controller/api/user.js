'use strict';

const Controller = require('egg').Controller;
class UserController extends Controller {
  // 注册
  async reg() {
    const { ctx, app } = this;
    const { username, password, repassword, avatar, desc, gender, tags } = ctx.request.body;
    console.log('what', ctx.request.body);
    if (password !== repassword) {
      ctx.throw(422, '密码和确认密码不一致');
    }
    // 验证用户是否存在
    if ((await app.model.User.findOne({
      where: {
        username,
      },
    }))) {
      ctx.throw(400, '用户名已存在');
    }
    const user = await app.model.User.create({
      username,
      password,
      avatar,
      description: desc,
      tags,
      gender,
      coin: 2000,
    });
    if (!user) {
      ctx.throw(400, '创建用户失败');
    }
    ctx.apiSuccess(user);
  }
  // 登录
  async login() {
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
    let user = await app.model.User.findOne({
      where: {
        username,
      },
    });
    if (!user) {
      ctx.throw(400, '用户不存在');
    }
    // 验证密码
    const res = await ctx.checkPassword(password, user.password);
    if (!res) {
      ctx.apiFail('密码错误~', '密码错误~');
      return;
    }
    user = JSON.parse(JSON.stringify(user));
    // 生成token
    user.token = ctx.getToken(user);
    delete user.password;
    // 加入到存储中
    if (!(await this.service.cache.set('user_' + user.id, user.token))) {
      ctx.throw(400, '登录失败');
    }
    ctx.apiSuccess(user);
  }
  // 退出登录
  async logout() {
    const { ctx, service } = this;
    const current_user_id = ctx.authUser.id;
    if (!(await service.cache.remove('user_' + current_user_id))) {
      ctx.throw(400, '退出登录失败');
    }
    ctx.apiSuccess('ok');
  }
  // 根据user_id查询用户的信息
  async query() {
    const { ctx, app } = this;
    const { user_id } = ctx.request.body;
    const user = await app.model.User.findOne({
      where: {
        id: user_id,
      },
    });
    delete user.password;
    ctx.apiSuccess(user);
  }
  // 获取当前用户获赞数目
  async info() {
    const { ctx, app } = this;
    const { id } = ctx.request.body;
    const user = await app.model.User.findOne({
      where: {
        id,
      },
    });
    delete user.password;
    ctx.apiSuccess(user);
  }
  // 修改头像
  async updateAvatar() {
    const { ctx, app } = this;
    const { avatar, user_id } = ctx.request.body;
    const user = await app.model.User.findOne({
      where: {
        id: user_id,
      },
    });
    user.avatar = avatar;
    ctx.apiSuccess(await user.save());
  }
  // 修改用户名
  async updateUserName() {
    const { ctx, app } = this;
    const { username, id } = ctx.request.body;
    const user = await app.model.User.findOne({
      where: {
        id,
      },
    });
    user.username = username;
    ctx.apiSuccess(await user.save());
  }
  // name is Exist
  async nameExist() {
    const { ctx, app } = this;
    const { username } = ctx.request.body;
    // 验证用户是否存在
    if ((await app.model.User.findOne({
      where: {
        username,
      },
    }))) {
      ctx.throw(400, '用户名已存在');
    } else {
      ctx.apiSuccess('true');
    }
  }
  // 修改性别
  async updateGender() {
    const { ctx, app } = this;
    const { gender, id } = ctx.request.body;
    const user = await app.model.User.findOne({
      where: {
        id,
      },
    });
    user.gender = gender;
    ctx.apiSuccess(await user.save());
  }
  // 修改简介
  async updateDesc() {
    const { ctx, app } = this;
    const { description, id } = ctx.request.body;
    const user = await app.model.User.findOne({
      where: {
        id,
      },
    });
    user.description = description;
    ctx.apiSuccess(await user.save());
  }
  // 修改标签
  async updateTags() {
    const { ctx, app } = this;
    const { tags, id } = ctx.request.body;
    const user = await app.model.User.findOne({
      where: {
        id,
      },
    });
    user.tags = tags;
    ctx.apiSuccess(await user.save());
  }
  // 修改硬币
  async updateCoin() {
    const { ctx, app } = this;
    const { id } = ctx.request.body;
    const user = await app.model.User.findOne({
      where: {
        id,
      },
    });
    user.coin += 50;
    ctx.apiSuccess(await user.save());
  }
}
module.exports = UserController;
