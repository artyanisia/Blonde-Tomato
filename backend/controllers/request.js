const Request = require("../models/thesisRequest");
const Student = require("../models/student");
const Professor = require("../models/professor");
const Session = require("../models/session");
const User = require("../models/user");
const sequelize = require("../sequelize");
const fs = require("fs");

exports.createRequest = async (req, res, next) => {
  const studentId = req.user.userId;
  const { professorId, sessionId, title } = req.body;

  if (!professorId || !sessionId || !title) {
    return res
      .status(400)
      .json({ message: "Fields missing: professorId, sessionId, title" });
  }

  try {
    const student = await Student.findOne({
      where: { userId: studentId },
      attributes: ["hasCoordinator"],
    });

    if (!student) {
      return res.status(404).json({ message: "Student record not found" });
    }

    if (student.hasCoordinator) {
      return res
        .status(409)
        .json({ message: "Student already has a coordinator" });
    }

    const professor = await Professor.findByPk(professorId);
    const session = await Session.findByPk(sessionId);

    if (!professor || !session) {
      return res.status(404).json({
        message: "Professor or Session not found",
      });
    }

    const newRequest = await Request.create({
      studentId: studentId,
      professorId: professorId,
      sessionId: sessionId,
      title: title,
      status: "Pending",
    });

    return res.status(201).json(newRequest);
  } catch (err) {
    console.log("err", err);
    next(err);
  }
};

exports.acceptRequest = async (req, res, next) => {
  const professorId = req.user.userId;
  const { requestId } = req.params;

  try {
    const professor = await Professor.findByPk(professorId);

    if (!professor) {
      return res.status(404).json({ message: "Professor record not found" });
    }

    const updateRequest = await sequelize.transaction(async (t) => {
      const request = await Request.findByPk(requestId, {
        include: [{ model: Student, as: "Student" }],
        transaction: t,
      });

      if (!request) {
        return res.status(404).json({ message: "Request doesnt exist" });
      }

      if (request.professorId !== professorId) {
        return res
          .status(403)
          .json({ message: "Request not addressed to you" });
      }

      if (request.status !== "Pending") {
        return res
          .status(409)
          .json({ message: `Request already ${request.status}` });
      }

      if (request.Student.hasCoordinator) {
        return res
          .status(409)
          .json({ message: "Stundet already has a coordinator" });
      }

      const professorRecord = await Professor.findByPk(professorId, {
        transaction: t,
      });

      if (professorRecord.currentStudentsCount >= professorRecord.maxStudents) {
        //throws error to force transaction rollback
        throw new Error(
          "Professor has reached the maximum student coordination limit."
        );
      }

      await request.update({ status: "Approved" }, { transaction: t });
      await request.Student.update(
        { hasCoordinator: true },
        { transaction: t }
      );
      await professorRecord.increment("currentStudentsCount", {
        by: 1,
        transaction: t,
      });

      return request;
    });

    return res.status(200).json(updateRequest);
  } catch (err) {
    console.log("err", err);
    next(err);
  }
};

exports.rejectRequest = async (req, res, next) => {
  const professorId = req.user.userId;
  const { requestId } = req.params;
  const { rejectionReason } = req.body;

  try {
    const request = await Request.findByPk(requestId);
    if (!request) {
      return res.status(404).json({ message: "Request doesnt exist" });
    }

    if (request.professorId !== professorId) {
      return res.status(403).json({ message: "Not addressed to you." });
    }

    if (request.status !== "Pending") {
      return res.status(409).json({
        message: `Request already ${request.status}. Cannot reject.`,
      });
    }

    await request.update({
      status: "Rejected",
      rejectionReason: rejectionReason || null,
    });

    return res.status(200).json(request);
  } catch (err) {
    console.log(err);
    next(err);
  }
};

exports.uploadStudentFile = async (req, res, next) => {
  const studentId = req.user.userId;
  const { requestId } = req.params;

  if (!req.file) {
    return res.status(400).json({ message: "No files to upload" });
  }

  const filePath = req.file.path;

  try {
    const request = await Request.findByPk(requestId);

    if (!request) {
      fs.unlinkSync(filePath);
      return res.status(404).json({ message: "Thesis request not found" });
    }

    if (request.studentId !== studentId) {
      fs.unlinkSync(filePath);
      return res.status(403).json({ message: "This is not your request" });
    }

    if (request.status !== "Approved") {
      fs.unlinkSync(filePath);
      return res.status(409).json({ message: "Request must be approved" });
    }

    await request.update({
      signedRequestFilePath: filePath,
    });

    return res.status(200).json({
      message: "Signed document uploaded successfully",
      filePath: filePath,
      request: request,
    });
  } catch (err) {
    console.log("err", err);
    if (fs.existsSync(filePath)) {
      fs.unlinkSync(filePath);
    }
    next(err);
  }
};

exports.uploadProfessorFile = async (req, res, next) => {
  const professorId = req.user.userId;
  const { requestId } = req.params;

  if (!req.file) {
    return res.status(400).json({ message: "No files to upload" });
  }

  const filePath = req.file.path;

  try {
    const request = await Request.findByPk(requestId);

    if (!request) {
      fs.unlinkSync(filePath);
      return res.status(404).json({ message: "Thesis request not found" });
    }

    if (request.professorId !== professorId) {
      fs.unlinkSync(filePath);
      return res.status(403).json({ message: "This is not your request" });
    }

    if (request.status === "Rejected") {
      fs.unlinkSync(filePath);
      return res
        .status(409)
        .json({ message: "Cannot upload file to a rejected request." });
    }

    await request.update({
      finalProfessorFileUrl: filePath,
    });

    return res.status(200).json({
      message: "Professor's document uploaded successfully",
      filePath: filePath,
    });
  } catch (err) {
    console.log("err", err);
    next(err);
  }
};

exports.getStudentRequests = async (req, res, next) => {
  const studentId = req.user.userId;

  try {
    const requests = await Request.findAll({
      where: { studentId: studentId },
      include: [
        {
          model: Professor,
          as: "Professor",
          include: [
            { 
              model: User, 
              as: "user", 
              attributes: ["name"] 
            }
          ]
        },
      ],
      order: [["createdAt", "DESC"]],
    });
    res.status(200).json(requests);
  } catch (err) {
    console.log("err", err);
    next(err);
  }
};
