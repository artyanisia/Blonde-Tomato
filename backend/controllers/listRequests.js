const ThesisRequest = require("../models/session");

exports.listRequests = async (req, res, next) => {
  const userId = req.user.userId;
  const role = req.user.role;
  let requests;

  try {
  } catch (error) {
    console.error("Error listing requests:", error);
    next(error);
  }
};
