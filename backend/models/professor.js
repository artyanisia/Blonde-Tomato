const { DataTypes } = require("sequelize");
const sequelize = require("../sequelize.js");

// Professor model
// extends base User entity ( 1:1 relationship)

const Professor = sequelize.define("professor", {
  userId: {
    type: DataTypes.UUID,
    allowNull: false,
    primaryKey: true,
  },
  maxStudents: {
    type: DataTypes.INTEGER,
    allowNull: false,
    defaultValue: 0,
  },
  currentStudentsCount: {
    type: DataTypes.INTEGER,
    allowNull: false,
    defaultValue: 0,
  },
});

module.exports = Professor;
