const fs = require("fs");
const grpc = require("@grpc/grpc-js");
const protoLoader = require("@grpc/proto-loader");
const path = require("path");
const archiver = require("archiver");

// Load the protobuf
const PROTO_PATH = "./grpc-node-server/file_service.proto";
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

// Function to upload a file
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
