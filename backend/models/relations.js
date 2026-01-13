const User = require("./user");
const Professor = require("./professor");
const Student = require("./student");
const Session = require("./session");
const ThesisRequest = require("./thesisRequest");

//defines relations between models

function defineRelations() {
  User.hasOne(Professor, {
    foreignKey: "userId",
    onDelete: "CASCADE",
  });
  Professor.belongsTo(User, {
    foreignKey: "userId",
    as: "user"
  });

  User.hasOne(Student, {
    foreignKey: "userId",
    onDelete: "CASCADE",
  });
  Student.belongsTo(User, {
    foreignKey: "userId",
    as: "user"
  });

  Professor.hasMany(Session, {
    foreignKey: "professorId",
    as: "Sessions",
  });
  Session.belongsTo(Professor, {
    foreignKey: "professorId",
    as: "Professor",
  });

  Student.hasMany(ThesisRequest, {
    foreignKey: "studentId",
    as: "RequestsMade",
  });
  ThesisRequest.belongsTo(Student, {
    foreignKey: "studentId",
    as: "Student",
  });

  Professor.hasMany(ThesisRequest, {
    foreignKey: "professorId",
    as: "RequestsReceived",
  });
  ThesisRequest.belongsTo(Professor, {
    foreignKey: "professorId",
    as: "Professor",
  });

  Session.hasMany(ThesisRequest, {
    foreignKey: "sessionId",
    as: "Requests",
  });
  ThesisRequest.belongsTo(Session, {
    foreignKey: "sessionId",
    as: "Session",
  });
}

module.exports = defineRelations;
