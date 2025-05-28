const Manufacturer = require("../models/Manufacturer");
const User = require("../models/User");
const bcrypt = require("bcryptjs");
const sendEmail = require("../utils/sendEmail");

const generateRandomPassword = () => {
  return Math.random().toString(36).slice(-8);
};

// create manufacturer
exports.createManufacturer = async (req, res) => {
  try {
    const { name, email, contactNumber, address, exporter_id } = req.body;

    // Check if email already exists
    const existingManufacturer = await Manufacturer.findOne({ email });
    if (existingManufacturer) {
      return res.status(400).json({ message: "Email already registered." });
    }

    // 2Generate manufacturer ID (e.g., manu-003)
    const manufacturerCount = await User.countDocuments({ role: "manufacturer" });
    const generatedManuId = `manu-${String(manufacturerCount + 1).padStart(3, "0")}`;

    // Generate and hash password
    const password = generateRandomPassword();

    const newManufacturer = new User({
      user_id: generatedManuId,             // manu-003
      username: name,
      email,
      password,
      contactNumber,
      address,
      role: "manufacturer",
      exporter_ref: "exp-001"               // reference to the exporter’s user_id
    });
    await newManufacturer.save();

    // Create user
    // const user = new User({
    //   user_id: newManufacturer.manufacturer_id,
    //   username: name,
    //   email,
    //   password: hashedPassword,
    //   role: "manufacturer",
    // });
    // await user.save();

    // Email login info
    const loginURL = "http://localhost:3000/"; // Change to your actual login page
    const emailText = `
      Hello ${name},

      You've been added as a manufacturer.

      Your login credentials are:
      Email: ${email}
      Password: ${password}

      Login here: ${loginURL}

      Please log in and change your password.

      Regards,
      Workflow Management Team
    `;

    await sendEmail(email, "Your Manufacturer Account Details", emailText);

    res.status(201).json({
      message: "Manufacturer created and login email sent successfully",
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

exports.getManufacturersByExporter = async (req, res) => {
  try {
    const exporterId = req.user.exporter_id; // e.g., "exp-001"

    const manufacturers = await User.find({
      role: "manufacturer",
      exporter_ref: exporterId,
    });

    res.status(200).json(manufacturers);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

