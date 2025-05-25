const mongoose = require("mongoose");

const manufacturerSchema = new mongoose.Schema({
  manufacturer_id: { type: String, unique: true }, // Unique ID like manu-001
  name: { type: String, required: true },
  email: { type: String, required: true },
  contactNumber: { type: String, required: true },
  address: { type: String, required: true },
  exporter_id: { type: String, required: true }
});

// // Auto-generate manufacturer_id
// manufacturerSchema.pre("save", async function (next) {
//   if (!this.manufacturer_id) {
//     const count = await mongoose.model("Manufacturer").countDocuments();
//     this.manufacturer_id = `manu-${String(count + 1).padStart(3, "0")}`;
//   }
//   next();
// });

module.exports = mongoose.model("Manufacturer", manufacturerSchema);
