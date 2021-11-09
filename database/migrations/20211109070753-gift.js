'use strict';

module.exports = {
  up: (queryInterface, Sequelize) => {
    const { INTEGER, STRING, DATE } = Sequelize;
    return queryInterface.createTable('gift', {
      id: {
        type: INTEGER(20),
        primaryKey: true,
        autoIncrement: true,
      },
      name: {
        type: STRING(30),
        allowNull: false,
        defaultValue: '',
        comment: '礼物名称',
      },
      image: {
        type: STRING,
        allowNull: true,
        defaultValue: '',
        comment: '礼物图标',
      },
      coin: {
        type: INTEGER,
        allowNull: false,
        defaultValue: 0,
        comment: '金币',
      },
      created_time: DATE,
      updated_time: DATE,

    });
  },

  down: queryInterface => {
    return queryInterface.dropTable('gift');
  },
};
