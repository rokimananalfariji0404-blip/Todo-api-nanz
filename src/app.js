const express = require("express");
const cors = require("cors"); // 1. Tambahkan import cors
const swaggerUi = require("swagger-ui-express");
const swaggerSpec = require("./config/swagger");
const todoRoutes = require("./routes/todo.routes");
const authRoutes = require("./routes/auth.routes");
const statsRoutes = require("./routes/stats.routes");
const logger = require("./middlewares/logger.middleware");
const notFound = require("./middlewares/notFound.middleware");
const errorHandler = require("./middlewares/errorHandler.middleware");

const app = express();

// 2. Pasang CORS di paling atas middleware
app.use(cors());
app.use(logger);
app.use(express.json());

// Handle favicon agar tidak mengotori log Vercel
app.get('/favicon.ico', (req, res) => res.status(204).end());

app.get("/", (req, res) => {
  res.json({ message: "Todo API is running" });
});

// 3. Konfigurasi CDN Swagger untuk Vercel Serverless
const CSS_URL = "https://cdnjs.cloudflare.com/ajax/libs/swagger-ui/5.0.0/swagger-ui.min.css";
const JS_URL = [
  "https://cdnjs.cloudflare.com/ajax/libs/swagger-ui/5.0.0/swagger-ui-bundle.js",
  "https://cdnjs.cloudflare.com/ajax/libs/swagger-ui/5.0.0/swagger-ui-standalone-preset.js"
];

// Halaman dokumentasi interaktif tersedia di /api-docs (menggunakan CDN)
app.use(
  "/api-docs",
  swaggerUi.serve,
  swaggerUi.setup(swaggerSpec, {
    customCssUrl: CSS_URL,
    customJs: JS_URL
  })
);

app.use("/api/auth", authRoutes);
app.use("/api/todos", todoRoutes);
app.use("/api/stats", statsRoutes);

app.use(notFound);
app.use(errorHandler);

module.exports = app;