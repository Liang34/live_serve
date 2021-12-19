'use strict';
module.exports = app => {
  const { INTEGER, DATE, TEXT } = app.Sequelize;

  const Comment = app.model.define('comment', {
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
    created_time: DATE,
    updated_time: DATE,
  });

  // 关联关系
  Comment.associate = function() {
    // 关联发布人
    Comment.belongsTo(app.model.User);
    // 关联直播间
    Comment.belongsTo(app.model.Live);
  };

  return Comment;
};
