const { DataTypes } = require('sequelize');
const sequelize = require('../connection/connection.js');
const { Snowflake } = require("@theinternetfolks/snowflake");
const jwt = require('jsonwebtoken');
/* Table: user
Columns:
user int AI PK 
name varchar(64) 
email varchar(128) 
password varchar(64) 
create_at datetime */

const User = sequelize.define('user', {
  id: {
    type: DataTypes.BIGINT,
    primaryKey: true,
    defaultValue: Snowflake.generate,
    field: 'id', 
  },
  name: {
    type: DataTypes.STRING(64),
    allowNull: false,
    field: 'name', 
  },
  email: {
    type: DataTypes.STRING(128),
    allowNull: false,
    unique: true,
    field: 'email', 
  },
  password: {
    type: DataTypes.STRING(64),
    allowNull: false,
    field: 'password', 
  },
  created_at: {
    type: DataTypes.DATE,
    allowNull: false,
    defaultValue: DataTypes.NOW,
    field: 'created_at'
  }

}, {
    timestamps: false,
    tablename: 'user',
    freezeTableName: true,
});


User.prototype.generateAuthToken = async function () {
  
  try {
      let token = jwt.sign(
          {
              name: this.name,
              email: this.email,
              id: this.id,
          },
          process.env.APP_SECRET,
          { expiresIn: "24h" }
      );
      return token;
  } catch (err) {
      console.log(err);
  }

}

module.exports = User;