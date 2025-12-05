const sequelize = require("../sequelize.js");
const { DataTypes } = require("sequelize");

//defines the Sequelize User Model.
// The base table for all authenticated entities in the system
//Parent entity for Professor and Student

const User = sequelize.define("user", {
  id: {
    type: DataTypes.UUID,
    defaultValue: DataTypes.UUIDV4,
    primaryKey: true,
  },
  name: {
    type: DataTypes.STRING,
    allowNull: false,
    validate: {
      len: [3, 200],
    },
  },
  email: {
    type: DataTypes.STRING,
    allowNull: false,
    unique: true,
  },
  password: {
    type: DataTypes.STRING,
    allowNull: false,
  },
  role: {
    type: DataTypes.ENUM,
    values: ["Student", "Professor"],
    allowNull: false,
    defaultValue: "Student",
  },
});

module.exports = User;
