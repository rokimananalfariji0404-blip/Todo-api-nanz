const mongoose = require("mongoose");

const categorySchema = new mongoose.Schema(
  {
    name: { type: String, required: true },
    description: { type: String },
    created_by: { type: mongoose.Schema.Types.ObjectId, ref: "User" },
  },
  {
    timestamps: { createdAt: "created_at", updatedAt: "updated_at" },
  }
);

module.exports = mongoose.model("Category", categorySchema);