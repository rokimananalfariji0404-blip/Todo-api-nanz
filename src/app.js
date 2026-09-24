const express = require("express");
const swaggerUi = require("swagger-ui-express");
const swaggerSpec = require("./config/swagger");
const todoRoutes = require("./routes/todo.routes");
const authRoutes = require("./routes/auth.routes");
const statsRoutes = require("./routes/stats.routes");
const categoryRoutes = require("./routes/category.routes");
const activityLogRoutes = require("./routes/activityLog.routes");
const logger = require("./middlewares/logger.middleware");
const notFound = require("./middlewares/notFound.middleware");
const errorHandler = require("./middlewares/errorHandler.middleware");

const app = express();

app.use(logger);
app.use(express.json());

app.get("/", (req, res) => {
  res.json({ message: "Todo API is running" });
});

const CSS_URL = "https://cdnjs.cloudflare.com/ajax/libs/swagger-ui/4.15.5/swagger-ui.min.css";
const JS_URL = [
  "https://cdnjs.cloudflare.com/ajax/libs/swagger-ui/4.15.5/swagger-ui-bundle.js",
  "https://cdnjs.cloudflare.com/ajax/libs/swagger-ui/4.15.5/swagger-ui-standalone-preset.js"
];

// Opsi konfigurasi Swagger dengan tambahan pengaturan posisi server & authorize
const swaggerOptions = {
  customCssUrl: CSS_URL,
  customJs: JS_URL,
  customCss: `
    .swagger-ui .information-container {
      display: flex !important;
      flex-direction: row !important;
      flex-wrap: wrap !important;
      align-items: center !important;
      justify-content: space-between !important;
    }
    .swagger-ui .information-container .info {
      flex: 0 0 100% !important;
      margin-bottom: 15px !important;
    }
    /* Mengatur kontainer server agar pindah ke kiri dan sejajar dengan authorize */
    .swagger-ui .scheme-container {
      display: flex !important;
      justify-content: space-between !important;
      align-items: center !important;
      background: transparent !important;
      padding: 15px 0 !important;
      box-shadow: none !important;
    }
    .swagger-ui .information-container .servers {
      margin: 0 !important;
    }
    .swagger-ui .auth-wrapper {
      margin: 0 !important;
    }
  `,
  customSiteTitle: "Todo List API - Documentation",
};

app.use("/api-docs", swaggerUi.serve, swaggerUi.setup(swaggerSpec, swaggerOptions));

app.use("/api/auth", authRoutes);
app.use("/api/todos", todoRoutes);
app.use("/api/categories", categoryRoutes);
app.use("/api/stats", statsRoutes);
app.use("/api/activity-logs", activityLogRoutes);

app.use(notFound);
app.use(errorHandler);

module.exports = app;