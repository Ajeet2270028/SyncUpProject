// models/Feed.js
// Defines the Feed table structure using Sequelize (MySQL ORM)

const { DataTypes } = require("sequelize");
const { sequelize } = require("../config/database");

const Feed = sequelize.define(
  "Feed",
  {
    // id is auto-created by Sequelize (auto increment integer)
    title: {
      type: DataTypes.STRING,
      allowNull: false, // required
    },
    content: {
      type: DataTypes.TEXT,
      allowNull: false, // required
    },
    author: {
      type: DataTypes.STRING,
      defaultValue: "Coach", // default value if not provided
    },
    category: {
      type: DataTypes.ENUM("motivation", "tip", "update", "announcement"),
      defaultValue: "update",
    },
  },
  {
    timestamps: true, // adds createdAt and updatedAt columns automatically
  }
);

module.exports = Feed;