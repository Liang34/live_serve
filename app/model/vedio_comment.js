'use strict';

module.exports = app => {
  const { INTEGER, DATE, TEXT } = app.Sequelize;

  const VedioComment = app.model.define('video_comment', {
    id: {
      type: INTEGER(20),
      primaryKey: true,
      autoIncrement: true,
    },
    content: {
      type: TEXT,
      allowNull: false,
      defaultValue: '',
      comment: '评论内容',
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
    orign_user_id: {
      type: INTEGER,
      allowNull: false,
      defaultValue: 0,
      comment: '视频up主',
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
  VedioComment.associate = function() {
    VedioComment.belongsTo(app.model.User);
    VedioComment.belongsTo(app.model.Vedio);
  };
  return VedioComment;
};
