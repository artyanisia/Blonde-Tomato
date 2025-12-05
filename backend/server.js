const express = require("express");

const defineRelations = require("./models/relations");
const sequelize = require("./sequelize.js");

const application = express();
const PORT = process.env.PORT || 3000;

defineRelations();

// Sync database and start server
sequelize
  .sync({ alter: true })
  .then(() => {
    console.log("Database synchronized successfully");

    // Express middleware
    application.use(
      express.urlencoded({
        extended: true,
      })
    );
    application.use(express.json());

    const auth = require("./routes/auth");
    const sync = require("./routes/sync");
    const session = require("./routes/session");

    application.use("/api/auth", auth);
    application.use("/api/sync", sync);
    application.use("/api/sessions", session);

    application.listen(PORT, () => {
      console.log(`The server is running on http://localhost: ${PORT}.`);
    });
  })
  .catch((error) => {
    console.error("Failed to sync database:", error);
  });

// Create a middleware to handle 500 status errors.
application.use((error, request, response, next) => {
  console.error(`[ERROR]: ${error}`);
  response.status(500).json(error);
});
