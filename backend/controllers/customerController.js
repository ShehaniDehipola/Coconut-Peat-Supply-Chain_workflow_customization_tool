const User = require("../models/User");
const Customer = require("../models/Customer");
const sendEmail = require("../utils/sendEmail");

const generateRandomPassword = () => {
  return Math.random().toString(36).slice(-8);
};

exports.createCustomer = async (req, res) => {
  try {
    const { name, email, contactNumber, address, exporter_id } = req.body;

    // Check if user with this email already exists
    const existingUser = await User.findOne({ email });
    if (existingUser) {
      return res.status(400).json({ message: "Email already registered." });
    }

    // Generate customer ID (cust-001, cust-002, ...)
    const customerCount = await User.countDocuments({ role: "customer" });
    const generatedCustId = `cust-${String(customerCount + 1).padStart(3, "0")}`;

    // Generate random password
    const password = generateRandomPassword();

    // Create user for authentication
    const newUser = new User({
      user_id: generatedCustId,
      username: name,
      email,
      contactNumber,
      address,
      password,
      role: "customer",
    });
    await newUser.save();

    // Create customer profile
    const newCustomer = new Customer({
      customer_id: generatedCustId,
      name,
      email,
      contactNumber,
      address,
      exporter_ref: exporter_id,
    });
    await newCustomer.save();

    // Send email with credentials
    const loginURL = "http://localhost:3000/login"; // Adjust to your frontend login page
    const emailText = `
      Hello ${name},

      Your customer account has been created.

      Login credentials:
      Email: ${email}
      Password: ${password}

      You can login here: ${loginURL}

      Please change your password after logging in for security reasons.

      Regards,
      CocoSmart
      Workflow Management Team
    `;

    await sendEmail(email, "Your Customer Account Details", emailText);

    res.status(201).json({
      message: "Customer created successfully, login credentials sent via email.",
      customer: newUser, // or send minimal data as needed
    });

  } catch (error) {
    res.status(500).json({ message: "Server error", error: error.message });
  }
};

// exports.getAllCustomers = async (req, res) => {
//   try {
//     const customers = await Customer.find()
//       .populate({
//         path: "orders",
//         select: "workflow_id name status", // show only selected workflow fields
//       })
//       .sort({ createdDate: -1 }); // use your own createdDate field for sorting

//     res.status(200).json(customers);
//   } catch (error) {
//     console.error("Error fetching customers:", error);
//     res.status(500).json({ message: "Failed to fetch customers", error: error.message });
//   }
// };

exports.getAllCustomers = async (req, res) => {
  try {
    const customers = await User.find({ role: "customer" });
    res.json(customers);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};