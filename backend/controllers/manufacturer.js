const Manufacturer = require("../models/Manufacturer");
const User = require("../models/User");

// create manufacturer
exports.createManufacturer = async (req, res) => {
  try {
    const { name, email } = req.body;

    // Check if email already exists
    const existingManufacturer = await Manufacturer.findOne({ email });
    if (existingManufacturer) {
      return res.status(400).json({ message: "Email already registered." });
    }

    const newManufacturer = new Manufacturer({ name, email });
    await newManufacturer.save();

    res.status(201).json({
      message: "Manufacturer created successfully",
      manufacturer: newManufacturer,
    });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

// Get All Manufacturers
exports.getAllManufacturers = async (req, res) => {
  try {
    const manufacturers = await User.find({ role: "manufacturer" });
    res.json(manufacturers);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};
