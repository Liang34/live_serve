'use strict';

module.exports = app => {
  const { STRING, INTEGER, DATE, ENUM } = app.Sequelize;

  const Order = app.model.define('order', {
    id: {
      type: INTEGER(20),
      primaryKey: true,
      autoIncrement: true,
    },
    no: {
      type: STRING(100),
      allowNull: false,
      defaultValue: '',
      comment: '订单号',
      unique: true,
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
    price: {
      type: INTEGER,
      allowNull: false,
      defaultValue: 0,
      comment: '价格',
    },
    status: {
      type: ENUM,
      values: [ 'pending', 'success', 'fail' ],
      allowNull: false,
      defaultValue: 'pending',
      comment: '支付状态',
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
  Order.associate = function() {
    // 关联用户
    Order.belongsTo(app.model.User);
  };
  return Order;
};
