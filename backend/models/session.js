const { DataTypes } = require("sequelize");
const sequelize = require("../sequelize.js");

// establishes timeframes for thesis enrollment periods

const Session = sequelize.define("session", {
  id: {
    type: DataTypes.UUID,
    defaultValue: DataTypes.UUIDV4,
    primaryKey: true,
  },

  professorId: {
    type: DataTypes.UUID,
    allowNull: false,
  },

  startDateHour: {
    type: DataTypes.DATE,
    allowNull: false,
  },

  endDateHour: {
    type: DataTypes.DATE,
    allowNull: false,
  },

  isActive: {
    type: DataTypes.BOOLEAN,
    allowNull: false,
    defaultValue: true,
  },
});

module.exports = Session;
