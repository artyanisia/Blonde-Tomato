const express = require("express");
const router = express.Router();
const session = require("../controllers/session");
const { authenticate, authorize } = require("../middleware/auth");

router.post("/", authenticate, authorize("Professor"), session.createSession);
router.get("/", authenticate, session.getSessions);
router.get("/all", authenticate, session.getAllSessions);

module.exports = router;
