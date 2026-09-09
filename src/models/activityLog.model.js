const mongoose = require("mongoose");

const activityLogSchema = new mongoose.Schema(
  {
    action: { type: String, required: true },
    description: { type: String, required: true },
    user: { type: mongoose.Schema.Types.ObjectId, ref: "User" },
    todo_id: { type: mongoose.Schema.Types.ObjectId, ref: "Todo" },
  },
  {
    timestamps: { createdAt: "created_at", updatedAt: "updated_at" },
  }
);

module.exports = mongoose.model("ActivityLog", activityLogSchema);