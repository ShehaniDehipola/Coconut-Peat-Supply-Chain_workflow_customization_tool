const mongoose = require('mongoose');
const { v4: uuidv4 } = require('uuid');

const workflowSchema = new mongoose.Schema({
  workflow_name: {
    type: String,
    required: true,
  },
  workflow_id: {
    type: String,
    required: true,
    index: true,
  },
  exporter_id: { type: String, required: true },
  manufacturer_id: { type: String, default: null }, // Null until assigned
  expected_date: { type: Date, required: false },
  versions: [
    {
      versionNumber: {
        type: Number,
        default: 1,
      },
      status: {
        type: String,
        enum: ['draft', 'pending', 'in_progress', 'completed'],
        default: 'draft',
      },
      steps: [
        {
          pluginName: String,
          order: Number,
          required_amount: Number,
          started_at: { type: Date, default: null }, // Step start time
          completed_at: { type: Date, default: null }, // Step completion time
          Notes: String,
          sub_steps: [
            {
              name: String, // Name of the sub-step
              status: {
                type: String,
                enum: ['not_started', 'in_progress', 'completed'],
                default: 'not_started',
              },
              started_at: { type: Date, default: null }, // Sub-step start time
              completed_at: { type: Date, default: null }, // Sub-step completion time
            },
          ],
        },
      ],
    },
  ],
  created_at: { type: Date, default: Date.now },
  updated_at: { type: Date, default: Date.now },
});

// Pre-save hook to ensure workflow_id is generated if missing
workflowSchema.pre('save', function (next) {
  if (!this.workflow_id) {
    this.workflow_id = `WF-${uuidv4().split('-')[0]}`;
  }
  next();
});

module.exports = mongoose.model('Workflow', workflowSchema);
