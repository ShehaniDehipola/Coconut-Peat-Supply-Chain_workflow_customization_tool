const mongoose = require("mongoose");

const workflowSchema = new mongoose.Schema({
  workflow_name: { type: String, required: true },
  exporter_id: { type: String, required: true },
  manufacturer_id: { type: String, default: null }, // Null until assigned
  steps: [
    {
      pluginName: String,
      order: Number,
      required_amount: Number,
    },
  ],
  status: {
    type: String,
    enum: ["pending", "in_progress", "completed"],
    default: "pending",
  },
  created_at: { type: Date, default: Date.now },
  updated_at: { type: Date, default: Date.now },
  version: { type: Number, default: 1 },
});

module.exports = mongoose.model("Workflow", workflowSchema);
