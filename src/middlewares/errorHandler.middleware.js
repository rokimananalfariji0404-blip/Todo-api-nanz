function errorHandler(err, req, res, next) {
  console.error(err.stack);

  let statusCode = err.statusCode || 500;
  let message = err.message || "Internal Server Error";

  // Mongoose ValidationError — misal field "title" wajib diisi tapi kosong
  if (err.name === "ValidationError") {
    statusCode = 400;
    message = Object.values(err.errors)
      .map((item) => item.message)
      .join(", ");
  }

  // Mongoose CastError — misal ID yang dikirim bukan format ObjectId yang valid
  if (err.name === "CastError") {
    statusCode = 400;
    message = `Invalid value for field "${err.path}": ${err.value}`;
  }

  // Mongoose duplicate key error — misal field unique sudah dipakai data lain
  if (err.code === 11000) {
    statusCode = 409;
    const field = Object.keys(err.keyValue).join(", ");
    message = `Duplicate value for field: ${field}`;
  }

  res.status(statusCode).json({
    success: false,
    message,
    // Stack trace hanya ditampilkan saat development, jangan di production
    stack: process.env.NODE_ENV === "development" ? err.stack : undefined,
  });
}

module.exports = errorHandler;