'use strict';

module.exports = {
  up: (queryInterface, Sequelize) => {
    const { INTEGER, STRING, DATE, ENUM } = Sequelize;
    return queryInterface.createTable('order', {
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
      created_time: DATE,
      updated_time: DATE,
    });
  },

  down: queryInterface => {
    return queryInterface.dropTable('order');
  },
};
