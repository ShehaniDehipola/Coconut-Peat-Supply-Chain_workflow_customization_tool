const fs = require('fs');
const grpc = require('@grpc/grpc-js');
const protoLoader = require('@grpc/proto-loader');

// Load the protobuf
const PROTO_PATH = 'file_service.proto';
const packageDefinition = protoLoader.loadSync(PROTO_PATH, {
  keepCase: true,
  longs: String,
  enums: String,
  defaults: true,
  oneofs: true,
});
const fileServiceProto = grpc.loadPackageDefinition(packageDefinition).fileservice;

// Create a client
const client = new fileServiceProto.FileService('localhost:50051', grpc.credentials.createInsecure());

// Function to upload a file
function uploadFile(filePath) {
  try {
    const filename = filePath.split('/').pop();
    const fileData = fs.readFileSync(filePath);

    const request = {
      filename: filename,
      filedata: fileData,
    };

    client.UploadFile(request, (err, response) => {
      if (err) {
        console.error('Error uploading file:', err);
        return;
      }

      console.log('Server response:', response.message);
    });
  } catch (err) {
    console.error('Failed to read the file:', err.message);
  }
}

// Get file path from the command line arguments
const filePath = process.argv[2];

if (!filePath) {
  console.error('Please provide the path to the file as an argument.');
  process.exit(1);
}

// Replace 'your_zip_file.zip' with the path to the file you want to upload
uploadFile(filePath);
