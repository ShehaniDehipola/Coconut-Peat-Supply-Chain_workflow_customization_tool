const mongoose = require("mongoose");
const { v4: uuidv4 } = require("uuid");

const workflowSchema = new mongoose.Schema({
  workflow_id: {
    type: String,
    unique: true,
    required: true,
    index: true,
  },
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
  version: { type: Number, required: true, default: 1 },
  created_at: { type: Date, default: Date.now },
  updated_at: { type: Date, default: Date.now },
});

// Pre-save hook to ensure workflow_id is generated if missing
workflowSchema.pre("save", function (next) {
  if (!this.workflow_id) {
    this.workflow_id = `WF-${uuidv4().split("-")[0]}`;
  }
  next();
});

module.exports = mongoose.model("Workflow", workflowSchema);
