const fs = require("fs");
const path = require("path");
const archiver = require("archiver");
const grpc = require("@grpc/grpc-js");
const protoLoader = require("@grpc/proto-loader");
const axios = require("axios");
const { updateFile } = require("../controllers/fileWriter");
const { generateFile } = require("../controllers/fileWriter");
// const { zipFolder } = require("../grpc-node-server/client");

// Load the protobuf
const PROTO_PATH = path.join(
  __dirname,
  "../grpc-node-server/file_service.proto"
);
const packageDefinition = protoLoader.loadSync(PROTO_PATH, {
  keepCase: true,
  longs: String,
  enums: String,
  defaults: true,
  oneofs: true,
});

const fileServiceProto =
  grpc.loadPackageDefinition(packageDefinition).fileservice;

// Create a client
const client = new fileServiceProto.FileService(
  "localhost:50051",
  grpc.credentials.createInsecure()
);

exports.processAll = async (req, res) => {
  try {
    const {
      updateContent,
      goFileContent,
      plugin_name,
      sensor_name,
      userRequirement,
      execute_logic,
      save_path,
    } = req.body;

    // Step 1: Update the first file
    await updateFile(updateContent, "../core_plugin/custom.dockerfile");

    console.log("ABCD");

    // Step 2: Generate the second file
    const folderPath = await generateFile(
      goFileContent,
      plugin_name,
      sensor_name,
      userRequirement,
      execute_logic,
      save_path
    );

    console.log("ABCD");

    // Step 3: Zip the folder
    // const outputZipPath = path.join(folderPath, "core_plugin.zip");
    // await zipFolder(folderPath, outputZipPath);
    // Example usage:
    const pluginFolderPath = path.resolve("../", "core_plugin"); // Replace with your folder path
    const outputZipPath = path.resolve("../", "core_plugin.zip"); // Replace with your desired output path

    zipFolder(pluginFolderPath, outputZipPath)
      .then(() => {
        console.log("Folder successfully zipped!");
        // path to the file  to upload
        uploadFile("../core_plugin.zip");
        // Step 4: Upload the zipped folder via gRPC
        const zipFileData = fs.readFileSync(outputZipPath);
        const grpcRequest = {
          filename: "core_plugin.zip",
          filedata: zipFileData,
        };

        client.UploadFile(grpcRequest, (err, response) => {
          if (err) {
            console.error("Error uploading file via gRPC:", err);
            return res
              .status(500)
              .json({ message: "Error uploading file via gRPC", error: err });
          }

          res.status(200).json({
            message: "All steps completed successfully!",
            update: "File updated successfully",
            generate: "File generated successfully",
            zipUpload: response.message,
          });
        });
      })
      .catch((err) => console.error("Error zipping folder:", err));
  } catch (err) {
    console.error("Error processing all steps:", err);
    res
      .status(500)
      .json({ message: "Error processing all steps", error: err.message });
  }
};

// Folder Zip method
function zipFolder(folderPath, outputZipPath) {
  return new Promise((resolve, reject) => {
    // Create a file to stream the archive data to.
    const output = fs.createWriteStream(outputZipPath);
    const archive = archiver("zip", { zlib: { level: 9 } }); // Best compression level

    // Listen for events
    output.on("close", () => {
      console.log(`Zipped ${archive.pointer()} total bytes`);
      resolve();
    });

    archive.on("error", (err) => reject(err));

    // Pipe archive data to the output file
    archive.pipe(output);

    // Append the folder to the archive
    archive.directory(folderPath, false); // `false` prevents nesting in a subfolder

    // Finalize the archive
    archive.finalize();
  });
}

function uploadFile(filePath) {
  try {
    const filename = filePath.split("/").pop();
    const fileData = fs.readFileSync(filePath);

    const request = {
      filename: filename,
      filedata: fileData,
    };

    client.UploadFile(request, (err, response) => {
      if (err) {
        console.error("Error uploading file:", err);
        return;
      }

      console.log("Server response:", response.message);
    });
  } catch (err) {
    console.error("Failed to read the file:", err.message);
  }
}
