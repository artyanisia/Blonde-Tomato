const User = require("./user");
const Professor = require("./professor");
const Student = require("./student");
const Session = require("./session");
const ThesisRequest = require("./thesisRequest");

function defineRelations() {
  User.hasOne(Professor, {
    foreignKey: "userId",
    onDelete: "CASCADE",
  });
  Professor.belongsTo(User, {
    foreignKey: "userId",
  });

  User.hasOne(Student, {
    foreignKey: "userId",
    onDelete: "CASCADE",
  });
  Student.belongsTo(User, {
    foreignKey: "userId",
  });

  Professor.hasMany(Session, {
    foreignKey: "professorId",
    as: "sessions",
  });
  Session.belongsTo(Professor, {
    foreignKey: "professorId",
    as: "professor",
  });

  Student.hasMany(ThesisRequest, {
    foreignKey: "studentId",
    as: "requestsMade",
  });
  ThesisRequest.belongsTo(Student, {
    foreignKey: "studentId",
    as: "student",
  });

  Professor.hasMany(ThesisRequest, {
    foreignKey: "professorId",
    as: "requestsReceived",
  });
  ThesisRequest.belongsTo(Professor, {
    foreignKey: "professorId",
    as: "professor",
  });

  Session.hasMany(ThesisRequest, {
    foreignKey: "sessionId",
    as: "requests",
  });
  ThesisRequest.belongsTo(Session, {
    foreignKey: "sessionId",
    as: "session",
  });
}

module.exports = defineRelations;
