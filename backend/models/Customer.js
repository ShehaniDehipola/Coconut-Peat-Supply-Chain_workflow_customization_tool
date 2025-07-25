const mongoose = require("mongoose");

const customerSchema = new mongoose.Schema({
  customer_id: { type: String, unique: true }, // e.g., cust-001
  name: { type: String, required: true },
  email: { type: String, required: true },
  contactNumber: { type: String, required: true },
  address: { type: String, required: true },
  createdDate: { type: Date, default: Date.now },
  exporter_ref: { type: String, default: null },

  // Orders: array of workflow ObjectIds (assigned workflows)
  orders: [
    {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Workflow"
    }
  ]
});

module.exports = mongoose.model("Customer", customerSchema);
