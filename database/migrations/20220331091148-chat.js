'use strict';

module.exports = {
  up: (queryInterface, Sequelize) => {
    const { INTEGER, DATE, STRING, TEXT, BOOLEAN } = Sequelize;
    return queryInterface.createTable('chat', {
      id: {
        type: INTEGER(20),
        primaryKey: true,
        autoIncrement: true,
      },
      from_id: {
        type: INTEGER(20),
        allowNull: false,
        comment: '消息的发出者',
        references: {
          model: 'user',
          key: 'id',
        },
      },
      from_name: {
        type: STRING(30),
        allowNull: false,
        defaultValue: '',
        comment: '消息的发出者姓名',
      },
      from_avatar: {
        type: STRING,
        allowNull: true,
        defaultValue: '',
        comment: '头像',
      },
      to_id: {
        type: INTEGER(20),
        allowNull: false,
        comment: '消息的接受者',
        references: {
          model: 'user',
          key: 'id',
        },
      },
      to_name: {
        type: STRING(30),
        allowNull: false,
        defaultValue: '',
        comment: '消息的接收者姓名',
      },
      to_avatar: {
        type: STRING,
        allowNull: true,
        defaultValue: '',
        comment: '头像',
      },
      data: {
        type: TEXT,
        allowNull: false,
        defaultValue: '',
        comment: '聊天消息',
      },
      status: {
        type: BOOLEAN,
        allowNull: false,
        defaultValue: false,
        comment: 'true:已读,false:未读',
      },
      created_time: DATE,
      updated_time: DATE,
    });
  },

  down: queryInterface => {
    return queryInterface.dropTable('chat');
  },
};
