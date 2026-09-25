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

// Opsi konfigurasi Swagger dengan modifikasi CSS untuk memindahkan server ke sebelah kiri
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
    /* Memindahkan wrapper skema/server ke kiri dan tombol authorize ke kanan */
    .swagger-ui .scheme-container {
      display: flex !important;
      flex-direction: row !important;
      justify-content: flex-start !important;
      align-items: center !important;
      background: transparent !important;
      padding: 15px 0 !important;
      box-shadow: none !important;
      width: 100% !important;
    }
    .swagger-ui .scheme-container .servers-title-container {
      display: none !important;
    }
    .swagger-ui .information-container .servers {
      margin: 0 !important;
      width: auto !important;
    }
    /* Menggeser tombol authorize ke pojok kanan */
    .swagger-ui .auth-wrapper {
      margin: 0 0 0 auto !important;
      display: flex !important;
      align-items: center !important;
    }
  `,
  customSiteTitle: "Todo List API - Documentation",
};

app.use("/api-docs", swaggerUi.serve, swaggerUi.setup(swaggerSpec, swaggerOptions));

// Urutan rute diperbarui di sini:
app.use("/api/auth", authRoutes);
app.use("/api/categories", categoryRoutes);
app.use("/api/stats", statsRoutes);
app.use("/api/activity-logs", activityLogRoutes);
app.use("/api/todos", todoRoutes);

app.use(notFound);
app.use(errorHandler);

module.exports = app;