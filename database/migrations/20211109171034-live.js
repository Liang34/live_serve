'use strict';

module.exports = {
  up: async (queryInterface, Sequelize) => {
    const { INTEGER, STRING, DATE } = Sequelize;
    return queryInterface.createTable('live', {
      id: {
        type: INTEGER(20),
        primaryKey: true,
        autoIncrement: true,
      },
      title: {
        type: STRING(100),
        allowNull: false,
        defaultValue: '',
        comment: '直播间标题',
      },
      cover: {
        type: STRING,
        allowNull: true,
        defaultValue: '',
        comment: '直播间封面',
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
      look_count: {
        type: INTEGER,
        allowNull: false,
        defaultValue: 0,
        comment: '总观看人数',
      },
      coin: {
        type: INTEGER,
        allowNull: false,
        defaultValue: 0,
        comment: '总金币',
      },
      key: {
        type: STRING,
        allowNull: false,
        defaultValue: '',
        comment: '唯一标识',
      },
      status: {
        type: INTEGER(1),
        allowNull: false,
        defaultValue: 0,
        comment: '直播间状态 0未开播 1直播中 2暂停直播 3直播结束',
      },
      live_tag: {
        type: INTEGER(6),
        defaultValue: 0,
        comment: '视频分类',
      },
      created_time: DATE,
      updated_time: DATE,
    });
  },

  down: async queryInterface => {
    return queryInterface.dropTable('live');
  },
};
