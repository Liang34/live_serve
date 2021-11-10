'use strict';

module.exports = {
  up: (queryInterface, Sequelize) => {
    const { INTEGER, DATE } = Sequelize;
    return queryInterface.createTable('live_gift', {
      id: {
        type: INTEGER(20),
        primaryKey: true,
        autoIncrement: true,
      },
      live_id: {
        type: INTEGER,
        allowNull: false,
        defaultValue: 0,
        comment: '直播间id',
        references: {
          model: 'live',
          key: 'id',
        },
        onDelete: 'cascade',
        onUpdate: 'restrict', // 更新时操作
      },
      user_id: {
        type: INTEGER,
        allowNull: false,
        defaultValue: 0,
        comment: '用户id',
        references: {
          model: 'user',
          key: 'id',
        },
        onDelete: 'cascade',
        onUpdate: 'restrict', // 更新时操作
      },
      gift_id: {
        type: INTEGER,
        allowNull: false,
        defaultValue: 0,
        comment: '礼物id',
        references: {
          model: 'gift',
          key: 'id',
        },
        onDelete: 'cascade',
        onUpdate: 'restrict', // 更新时操作
      },
      created_time: DATE,
      updated_time: DATE,
    });
  },

  down: queryInterface => {
    return queryInterface.dropTable('live_gift');
  },
};
