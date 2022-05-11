'use strict';

module.exports = {
  up: (queryInterface, Sequelize) => {
    const { INTEGER, STRING, DATE } = Sequelize;
    return queryInterface.createTable('user', {
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
      created_time: DATE,
      updated_time: DATE,
    });
  },

  down: queryInterface => {
    return queryInterface.dropTable('user');
  },
};
