require("dotenv").config();

const app = require("./app");
const connectDB = require("./config/db");

const PORT = process.env.PORT || 3000;

async function startServer() {
  try {
    await connectDB();
    
    // Jalankan app.listen HANYA jika dijalankan secara lokal (bukan di Vercel)
    if (process.env.NODE_ENV !== "production" && !process.env.VERCEL) {
      app.listen(PORT, () => {
        console.log(`Server running on http://localhost:${PORT}`);
        console.log(`Environment: ${process.env.NODE_ENV || 'development'}`);
      });
    }
  } catch (error) {
    console.error("Failed to connect to database:", error);
  }
}

startServer();

// PENTING: Ekspor app agar Vercel (Serverless Function) bisa membacanya
module.exports = app;