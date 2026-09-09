const ActivityLog = require("../models/activityLog.model");

const logActivity = async ({ action, user_id, todo_id, details }) => {
  try {
    return await ActivityLog.create({
      action,
      user_id,
      todo_id,
      details,
    });
  } catch (error) {
    console.error("Failed to log activity:", error);
  }
};

module.exports = {
  logActivity,
};
