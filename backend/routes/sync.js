const express = require("express");
const router = express.Router();
const sequelize = require("../sequelize.js");

// resets database

router.put("/", async (request, response, next) => {
  try {
    await sequelize.sync({ force: true });
    response.sendStatus(204);
  } catch (error) {
    next(error);
  }
});

module.exports = router;
