'use strict';

module.exports = app => {
  const { STRING, INTEGER, DATE } = app.Sequelize;

  const Live = app.model.define('live', {
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
    live_tag: {
      type: INTEGER(6),
      defaultValue: 0,
      comment: '视频分类',
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
    created_time: {
      type: DATE,
      get() {
        return app.formatTime(this.getDataValue('created_time'));
      },
    },
    updated_time: DATE,
  });

  // 关联关系
  Live.associate = function() {
    // 关联主播
    Live.belongsTo(app.model.User);
  };

  return Live;
};
