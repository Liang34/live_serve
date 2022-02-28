'use strict';

module.exports = app => {
  const { INTEGER, DATE } = app.Sequelize;

  const Fans = app.model.define('fans', {
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
    created_time: {
      type: DATE,
      get() {
        return app.formatTime(this.getDataValue('created_time'));
      },
    },
    updated_time: DATE,
  });
  // Fans.associate = function() {
  // };
  return Fans;
};
