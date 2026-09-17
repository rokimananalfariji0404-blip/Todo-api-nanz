const express = require("express");
const router = express.Router();
const ActivityLog = require("../models/activityLog.model");
const { protect } = require("../middlewares/auth.middleware");
const catchAsync = require("../utils/catchAsync");

/**
 * @swagger
 * /api/activity-logs:
 *   get:
 *     summary: Mengambil semua riwayat activity log
 *     tags: [Activity Logs]
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: Activity logs retrieved successfully
 *       401:
 *         description: Unauthorized
 */

// Endpoint GET /api/activity-logs untuk melihat log
router.get(
  "/",
  protect,
  catchAsync(async (req, res, next) => {
    const logs = await ActivityLog.find()
      .sort({ created_at: -1 })
      .populate("user", "name email");

    res.status(200).json({
      success: true,
      message: "Activity logs retrieved successfully",
      data: logs,
    });
  })
);

module.exports = router;