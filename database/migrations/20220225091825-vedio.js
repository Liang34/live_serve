'use strict';

module.exports = {
  up: async (queryInterface, Sequelize) => {
    const { INTEGER, DATE, STRING, TEXT } = Sequelize;
    return queryInterface.createTable('vedio', {
      id: {
        type: INTEGER(20),
        primaryKey: true,
        autoIncrement: true,
      },
      vedio_name: {
        type: STRING(100),
        allowNull: false,
        defaultValue: '',
        comment: '视频名称',
      },
      vedio_path: {
        type: STRING(100),
        allowNull: false,
        defaultValue: '',
        comment: '视频存储路径',
      },
      vedio_desc: {
        type: TEXT,
        allowNull: false,
        defaultValue: 0,
        comment: '视频描述',
      },
      like_count: {
        type: INTEGER,
        defaultValue: 0,
        comment: '点赞数量',
      },
      vedio_cover: {
        type: STRING(100),
        defaultValue: '',
        comment: '视频封面',
      },
      vedio_tag: {
        type: INTEGER(6),
        defaultValue: 0,
        comment: '视频分类',
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
      created_time: DATE,
      updated_time: DATE, // 上传时间
    });
  },

  down: async queryInterface => {
    return queryInterface.dropTable('vedio');
  },
};
