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
  const { requestId } = req.params;
  const professorId = req.user.userId;

  try {
    const request = await Request.findByPk(requestId, { include: ["Student"] });
    if (!request) return res.status(404).json({ message: "Request not found" });

    if (request.professorId !== professorId)
      return res.status(403).json({ message: "Unauthorized" });

    if (request.status !== "Pending")
      return res.status(400).json({ message: "Request is not pending" });

    if (request.Student.hasCoordinator)
      return res
        .status(400)
        .json({ message: "Student already has a coordinator" });

    const professor = await Professor.findByPk(professorId);

    if (!professor) {
      return res.status(404).json({ message: "Professor record not found" });
    }

    if (
      Number(professor.currentStudentsCount) >= Number(professor.maxStudents)
    ) {
      return res.status(409).json({
        message: `Limit reached! You can coordinate a maximum of ${professor.maxStudents} students.`,
      });
    }

    await sequelize.transaction(async (t) => {
      await request.update({ status: "Approved" }, { transaction: t });
      await request.Student.update(
        { hasCoordinator: true },
        { transaction: t }
      );
      await professor.increment("currentStudentsCount", {
        by: 1,
        transaction: t,
      });

      await Request.update(
        {
          status: "Rejected",
          rejectionReason: "Student found another coordinator",
        },
        {
          where: { studentId: request.studentId, status: "Pending" },
          transaction: t,
        }
      );
    });

    return res
      .status(200)
      .json({ message: "Request approved successfully", requestId });
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

    if (request.status !== "Approved" && request.status !== "ReuploadNeeded") {
      fs.unlinkSync(filePath);
      return res.status(409).json({ message: "Request must be approved" });
    }

    const normalizedPath = filePath.replace(/\\/g, "/");

    await request.update({
      signedRequestFilePath: normalizedPath,
      status: "Approved",
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

    const normalizedPath = filePath.replace(/\\/g, "/");

    await request.update({
      finalProfessorFileUrl: normalizedPath,
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
              attributes: ["name"],
            },
          ],
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

exports.getProfessorRequests = async (req, res, next) => {
  const professorId = req.user.userId;

  try {
    const requests = await Request.findAll({
      where: { professorId: professorId },
      include: [
        {
          model: Student,
          as: "Student",
          include: [
            {
              model: User,
              as: "user",
              attributes: ["name"],
            },
          ],
        },
      ],
      order: [["createdAt", "DESC"]],
    });

    const activeRequests = requests.filter((req) => {
      if (req.status === "Pending" && req.Student.hasCoordinator) {
        return false;
      }
      return true;
    });
    res.status(200).json(activeRequests);
  } catch (err) {
    console.log("err", err);
    next(err);
  }
};

exports.rejectThesisRequest = async (req, res, next) => {
  const professorId = req.user.userId;
  const { requestId } = req.params;
  const { rejectionReason } = req.body;

  try {
    const request = await Request.findByPk(requestId);
    if (!request) {
      return res.status(404).json({ message: "Thesis request not found" });
    }

    if (request.professorId !== professorId) {
      return res.status(403).json({ message: "Unauthorized" });
    }

    await request.update({
      status: "ReuploadNeeded",
      rejectionReason:
        rejectionReason ||
        "Document rejected. Please upload a correct version.",
      signedRequestFilePath: null,
    });

    const updatedRequest = await Request.findByPk(requestId, {
      include: [
        {
          model: Student,
          as: "Student",
          include: [{ model: User, as: "user", attributes: ["name"] }],
        },
        {
          model: Professor,
          as: "Professor",
          include: [{ model: User, as: "user", attributes: ["name"] }],
        },
      ],
    });

    return res.status(200).json(updatedRequest);
  } catch (err) {
    next(err);
  }
};
