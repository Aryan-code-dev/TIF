const { DataTypes } = require('sequelize');
const sequelize = require('../connection/connection.js');
const { Snowflake } = require("@theinternetfolks/snowflake");

const Role = sequelize.define('role', {
  id: {
    type: DataTypes.BIGINT,
    primaryKey: true,
    defaultValue: Snowflake.generate,
    field: 'id',
  },
  name: {
    type: DataTypes.STRING(64),
    allowNull: false,
    unique: true,
    field: 'name', 
  }
}, {
    timestamps: true,
    tableName: 'role',
    createdAt: 'created_at', 
    updatedAt: 'updated_at', 
    freezeTableName: true,
});

module.exports = Role;
