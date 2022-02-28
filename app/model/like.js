'use strict';

module.exports = app => {
  const { INTEGER, DATE, BOOLEAN } = app.Sequelize;

  const Like = app.model.define('like', {
    id: {
      type: INTEGER(20),
      primaryKey: true,
      autoIncrement: true,
    },
    status: {
      type: BOOLEAN,
      allowNull: false,
      defaultValue: false,
      comment: 'true:喜欢,false:不喜欢',
    },
    vedio_id: {
      type: INTEGER,
      allowNull: false,
      defaultValue: 0,
      comment: '视频id',
      references: {
        model: 'vedio',
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
    created_time: DATE,
    updated_time: DATE,
  });
  Like.associate = function() {
    Like.belongsTo(app.model.Vedio);
    // // 关联直播间
    // Comment.belongsTo(app.model.Live);
  };
  return Like;
};
