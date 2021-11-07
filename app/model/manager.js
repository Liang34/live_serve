'use strict';
module.exports = app => {
  const { INTEGER, STRING, DATE } = app.Sequelize;

  const Manager = app.model.define('manager', {
    id: {
      type: INTEGER(20),
      primaryKey: true,
      autoIncrement: true,
    },
    username: {
      type: STRING(30),
      allowNull: false,
      defaultValue: '',
      comment: '管理员账户',
      unique: true,
    },
    password: {
      type: STRING,
      allowNull: false,
      defaultValue: '',
      comment: '密码',
    },
    created_time: DATE,
    updated_time: DATE,
  });
  return Manager;
};
