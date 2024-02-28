const { DataTypes } = require('sequelize');
const sequelize = require('../connection/connection.js');
const { Snowflake } = require("@theinternetfolks/snowflake");

const Member = sequelize.define('Member', {
  id: {
    type: DataTypes.BIGINT,
    primaryKey: true,
    defaultValue: Snowflake.generate,
    field: 'id',
  },
  communityId: {
    type: DataTypes.BIGINT,
    allowNull: false,
    // references: {
    //   model: 'community', 
    //   key: 'id',
    // },
    field: 'community_id',
  },
  userId: {
    type: DataTypes.BIGINT,
    allowNull: false,
    // references: {
    //   model: 'user', // Assuming the name of the user model is 'user'
    //   key: 'id',
    // },
    field: 'user_id',
  },
  roleId: {
    type: DataTypes.BIGINT,
    allowNull: false,
    // references: {
    //   model: 'role', 
    //   key: 'id',
    // },
    field: 'role_id',
  },
  created_at: {
    type: DataTypes.DATE,
    allowNull: false,
    defaultValue: DataTypes.NOW,
    field: 'created_at',
  },
}, {
    timestamps: false,
    tableName: 'member',
    freezeTableName: true,
});

module.exports = Member;
