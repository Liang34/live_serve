'use strict';

module.exports = app => {
  const { INTEGER, DATE } = app.Sequelize;

  const LiveGift = app.model.define('live_gift', {
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

  // 关联关系
  LiveGift.associate = function() {
    // 关联用户
    LiveGift.belongsTo(app.model.User);
    // 关联直播间
    LiveGift.belongsTo(app.model.Live);
    // 关联礼物
    LiveGift.belongsTo(app.model.Gift);
  };

  return LiveGift;
};
