const mongoose = require("mongoose");
const bcrypt = require("bcryptjs");

const UserSchema = new mongoose.Schema({
  user_id: { type: String, unique: true }, // Unique ID like exp-001
  username: { type: String, required: true, unique: true },
  email: { type: String, required: true },
  password: { type: String, required: true },
  role: {
    type: String,
    required: true,
    enum: ["user", "admin", "exporter", "manufacturer", "customer"],
    default: "user",
  },
  exporter_id: { type: String, sparse: true }, // ONLY for users with role 'exporter'
  exporter_ref: { type: String, default: null }, // Used to link manufacturer to exporter
  status: { type: Boolean, default: true },
  forcePasswordChange: { type: Boolean, default: true },
  createdDate: { type: Date, default: Date.now },
});

// Hash the password before saving
UserSchema.pre("save", async function (next) {
  if (!this.isModified("password")) return next();
  const salt = await bcrypt.genSalt(10);
  this.password = await bcrypt.hash(this.password, salt);
  next();
});

// Auto-generate exporter_id
UserSchema.pre("save", async function (next) {
  if (!this.user_id) {
    const count = await mongoose.model("User").countDocuments();
    this.user_id = `user-${String(count + 1).padStart(3, "0")}`;
  }
  next();
});

module.exports = mongoose.model("User", UserSchema);
