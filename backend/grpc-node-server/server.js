const fs = require("fs");
const grpc = require("@grpc/grpc-js");
const protoLoader = require("@grpc/proto-loader");

// Load the protobuf
const PROTO_PATH = "file_service.proto";
const packageDefinition = protoLoader.loadSync(PROTO_PATH, {
  keepCase: true,
  longs: String,
  enums: String,
  defaults: true,
  oneofs: true,
});
const fileServiceProto =
  grpc.loadPackageDefinition(packageDefinition).fileservice;

// Implement the FileService
function uploadFile(call, callback) {
  const filename = call.request.filename;
  const filedata = call.request.filedata;

  fs.writeFile(filename, filedata, (err) => {
    if (err) {
      console.error("Failed to save the file:", err);
      callback(null, { success: false, message: "Failed to save the file" });
      return;
    }

    console.log(`File ${filename} uploaded successfully`);
    callback(null, { success: true, message: "File uploaded successfully" });
  });
}

// Create and start the gRPC server
function main() {
  const server = new grpc.Server();
  server.addService(fileServiceProto.FileService.service, {
    UploadFile: uploadFile,
  });
  server.bindAsync(
    "0.0.0.0:50051",
    grpc.ServerCredentials.createInsecure(),
    (err, port) => {
      if (err) {
        console.error("Failed to start server:", err);
        return;
      }
      console.log(`Server is running on port ${port}`);
      server.start();
    }
  );
}

main();
