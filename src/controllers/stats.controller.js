const catchAsync = require("../utils/catchAsync");

const getSummary = catchAsync(async (req, res, next) => {
  res.status(200).json({
    success: true,
    message: "Summary retrieved successfully",
    data: {
      totalTodos: 12,
      completedTodos: 5,
      pendingTodos: 7
    }
  });
});

module.exports = { getSummary };