'use strict';

module.exports = {
  up: async (queryInterface, Sequelize) => {
    const { INTEGER, DATE } = Sequelize;
    return queryInterface.createTable('fans', {
      id: {
        type: INTEGER(20),
        primaryKey: true,
        autoIncrement: true,
      },
      fans_id: {
        type: INTEGER,
        allowNull: false,
        defaultValue: 0,
        comment: '粉丝id',
        references: {
          model: 'user',
          key: 'id',
        },
        onDelete: 'cascade',
        onUpdate: 'restrict', // 更新时操作
      },
      fllower_id: {
        type: INTEGER,
        allowNull: false,
        defaultValue: 0,
        comment: '关注的id',
        references: {
          model: 'user',
          key: 'id',
        },
        onDelete: 'cascade',
        onUpdate: 'restrict', // 更新时操作
      },
      created_time: DATE,
      updated_time: DATE,
    });
  },

  down: async queryInterface => {
    return queryInterface.dropTable('fans');
  },
};
