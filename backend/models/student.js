const { DataTypes } = require("sequelize");
const sequelize = require("../sequelize.js");

const Student = sequelize.define("student", {
  userId: {
    type: DataTypes.UUID,
    allowNull: false,
    primaryKey: true,
  },
  hasCoordinator: {
    type: DataTypes.BOOLEAN,
    allowNull: false,
    defaultValue: false,
  },
});

module.exports = Student;
