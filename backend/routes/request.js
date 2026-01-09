const express = require("express");
const router = express.Router();
const { authenticate, authorize } = require("../middleware/auth");
const request = require("../controllers/request");
const uploadSignedFile = require("../middleware/uploadSignedFile");

router.post(
  "/create",
  authenticate,
  authorize("Student"),
  request.createRequest
);

router.put(
  "/:requestId/approve",
  authenticate,
  authorize("Professor"),
  request.acceptRequest
);

router.put(
  "/:requestId/reject",
  authenticate,
  authorize("Professor"),
  request.rejectRequest
);

router.put(
  "/:requestId/uploadStudentFile",
  authenticate,
  authorize("Student"),
  uploadSignedFile,
  request.uploadStudentFile
);

router.put(
  "/:requestId/uploadProfessorFile",
  authenticate,
  authorize("Professor"),
  uploadSignedFile,
  request.uploadProfessorFile
);

router.get(
  "/student",
  authenticate,
  authorize("Student"),
  request.getStudentRequests
);

module.exports = router;
