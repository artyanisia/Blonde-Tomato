const { DataTypes } = require("sequelize");
const sequelize = require("../sequelize.js");

//central transactional entity, linking the Student, Professor and Session models

const ThesisRequest = sequelize.define("thesisRequest", {
  id: {
    type: DataTypes.UUID,
    defaultValue: DataTypes.UUIDV4,
    primaryKey: true,
  },
  studentId: {
    type: DataTypes.UUID,
    allowNull: false,
  },
  professorId: {
    type: DataTypes.UUID,
    allowNull: false,
  },
  sessionId: {
    type: DataTypes.UUID,
    allowNull: false,
  },
  status: {
    type: DataTypes.ENUM,
    values: ["Pending", "Approved", "Rejected", "ReuploadNeeded"],
    allowNull: false,
    defaultValue: "Pending",
  },

  rejectionReason: {
    type: DataTypes.STRING,
    allowNull: true,
    field: "rejection_reason",
  },

  finalProfessorFileUrl: {
    type: DataTypes.STRING,
    allowNull: true,
    field: "final_professor_file_url",
  },

  signedRequestFilePath: {
    type: DataTypes.STRING,
    allowNull: true,
    field: "signed_request_file_path",
  },
});

module.exports = ThesisRequest;
