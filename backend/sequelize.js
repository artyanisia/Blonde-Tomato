const { Sequelize } = require("sequelize");
const path = require("path");

require("dotenv").config();

const connectionString = process.env.DATABASE_URL;

console.log("Checking database connection...");
if (!connectionString) {
  console.error("ERROR: DATABASE_URL is not defined!");
} else {
  if (
    connectionString.includes("localhost") ||
    connectionString.includes("127.0.0.1")
  ) {
    console.warn(
      "WARNING: DATABASE_URL points to localhost but you are in production!"
    );
  }
}

const sequelize = new Sequelize(connectionString, {
  logging: false,
  dialectOptions: {
    ssl: {
      require: true,
      rejectUnauthorized: false,
    },
  },
});

module.exports = sequelize;
