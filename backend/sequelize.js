const { Sequelize } = require("sequelize");
const path = require("path");

require("dotenv").config({ path: path.resolve(__dirname, "..", ".env") });

const sequelize = new Sequelize({
  dialect: "sqlite",
  storage: "./backend/sqlite/database.db",
  logging: false,
});

module.exports = sequelize;
