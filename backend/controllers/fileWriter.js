const fs = require("fs");
const Port = require("../models/Port");
const path = require("path");

// Endpoint to update the file
exports.updateFile = async (content, filePath) => {
  return new Promise((resolve, reject) => {
    if (!content) {
      return reject(new Error("Content is required"));
    }

    // Write the updated content to the file
    fs.writeFile(filePath, content, (err) => {
      if (err) {
        console.error(err);
        reject(new Error("Error updating the file"));
      } else {
        resolve({ message: "File updated successfully!" });
      }
    });
  });
};

exports.generateFile = async (
  goFileContent,
  plugin_name,
  sensor_name,
  userRequirement,
  execute_logic,
  save_path
) => {
  try {
    // Validate input
    if (
      !goFileContent ||
      !plugin_name ||
      !sensor_name ||
      !userRequirement ||
      !execute_logic
    ) {
      throw new Error(
        "All fields (goFileContent, plugin_name, sensor_name, userRequirement, execute_logic) are required."
      );
    }

    // Set default save path if none is provided
    const fileSaveDestination = save_path || "../core_plugin";

    // Ensure the directory exists
    if (!fs.existsSync(fileSaveDestination)) {
      fs.mkdirSync(fileSaveDestination, { recursive: true });
    }

    // Define the file name
    const fileName = `${plugin_name.toLowerCase()}_plugin.go`;

    // Full file path
    const filePath = path.join(fileSaveDestination, fileName);

    // Write the file to the specified path (overwrite if it already exists)
    fs.writeFileSync(filePath, goFileContent, "utf8");

    // Return success result
    return {
      message: "File generated successfully",
      filePath,
    };
  } catch (error) {
    // Handle errors
    console.error("Error generating file:", error.message);
    throw new Error("An error occurred while generating the file.");
  }
};
