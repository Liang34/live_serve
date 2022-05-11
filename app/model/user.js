'use strict';

const crypto = require('crypto');
module.exports = app => {
  const { INTEGER, STRING, DATE } = app.Sequelize;

  const User = app.model.define('user', {
    id: {
      type: INTEGER(20),
      primaryKey: true,
      autoIncrement: true,
    },
    username: {
      type: STRING(30),
      allowNull: false,
      defaultValue: '',
      comment: '用户名',
      unique: true,
    },
    password: {
      type: STRING,
      allowNull: false,
      defaultValue: '',
      comment: '密码',
      set(val) {
        const hmac = crypto.createHash('sha256', app.config.crypto.secret);
        hmac.update(val);
        const hash = hmac.digest('hex');
        this.setDataValue('password', hash);
      },
    },
    avatar: {
      type: STRING,
      allowNull: true,
      defaultValue: '',
      comment: '头像',
    },
    coin: {
      type: INTEGER,
      allowNull: false,
      defaultValue: 0,
      comment: '金币',
    },
    description: {
      type: STRING,
      allowNull: true,
      comment: '个人描述',
    },
    gender: {
      type: INTEGER,
      allowNull: true,
      comment: '性别0男1女',
    },
    tags: {
      type: STRING,
      allowNull: true,
      comment: '用户感兴趣标签',
    },
    get_likes: {
      type: INTEGER,
      allowNull: true,
      comment: '获得点赞数',
      defaultValue: 0,
    },
    created_time: {
      type: DATE,
      get() {
        return app.formatTime(this.getDataValue('created_time'));
      },
    },
    updated_time: DATE,
  });
  // User.associate = function() {
  //   User.hasMany(app.model.Fans, {
  //     forignKey: 'fans_id',
  //     sourceKey: 'id',
  //   });
  //   User.hasMany(app.model.Fans, {
  //     forignKey: 'fllower_id',
  //     sourceKey: 'id',
  //   });
  // };
  return User;
};
