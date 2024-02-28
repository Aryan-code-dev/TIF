const { DataTypes } = require('sequelize');
const sequelize = require('../connection/connection.js');
const { Snowflake } = require("@theinternetfolks/snowflake");

const Community = sequelize.define('community', {
  id: {
    type: DataTypes.BIGINT, 
    primaryKey: true,
    defaultValue: Snowflake.generate,
    field: 'id',
  },
  name: {
    type: DataTypes.STRING(128),
    allowNull: false,
    field: 'name', 
  },
  slug: {
    type: DataTypes.STRING(255),
    unique: true,
    allowNull: false,
    field: 'slug', 
  },
  owner: {
    type: DataTypes.BIGINT, 
    allowNull: false,
    field: 'owner',
  }
}, {
    timestamps: true,
    createdAt: 'created_at', 
    updatedAt: 'updated_at', 
    tableName: 'community', 
    freezeTableName: true,
});

module.exports = Community;
