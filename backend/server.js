const express = require("express");
const cors = require("cors");

const defineRelations = require("./models/relations");
const sequelize = require("./sequelize.js");

const application = express();
const PORT = process.env.PORT || 5000;

defineRelations();

// Enable CORS for all routes
application.use(cors({}));

// Sync database and start server
sequelize
  .sync({ force: true })
  .then(() => {
    console.log("Database synchronized successfully");

    // Express middleware
    application.use(
      express.urlencoded({
        extended: true,
      })
    );
    application.use(express.json());

    // Root route
    application.get("/", (req, res) => {
      res.json({ message: "API is running" });
    });

    const auth = require("./routes/auth");
    const sync = require("./routes/sync");
    const session = require("./routes/session");
    const request = require("./routes/request.js");

    application.use("/api/auth", auth);
    application.use("/api/sync", sync);
    application.use("/api/sessions", session);
    application.use("/api/requests", request);

    // Error handling middleware
    application.use((error, request, response, next) => {
      console.error(`[ERROR]: ${error}`);
      response.status(500).json({ message: error.message });
    });

    application.listen(PORT, () => {
      console.log(`The server is running on http://localhost:${PORT}`);
    });
  })
  .catch((error) => {
    console.error("Failed to sync database:", error);
  });
