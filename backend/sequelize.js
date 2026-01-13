const { Sequelize } = require("sequelize");
const path = require("path");

require("dotenv").config();

console.log("Checking database connection environment variables...");
if (!process.env.DATABASE_URL) {
  console.error("ERROR: DATABASE_URL is not defined in environment variables!");
} else {
  console.log("DATABASE_URL is defined.");
}

const sequelize = new Sequelize(process.env.DATABASE_URL, {
  dialect: "postgres",
  protocol: "postgres",
  logging: false,
  dialectOptions: {
    ssl: {
      require: true,
      rejectUnauthorized: false,
    },
  },
});

module.exports = sequelize;
