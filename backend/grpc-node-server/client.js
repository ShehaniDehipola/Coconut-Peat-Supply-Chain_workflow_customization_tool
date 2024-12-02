const fs = require('fs');
const grpc = require('@grpc/grpc-js');
const protoLoader = require('@grpc/proto-loader');
const path = require('path');
const archiver = require('archiver');

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
// const filePath = process.argv[2];

// if (!filePath) {
//   console.error('Please provide the path to the file as an argument.');
//   process.exit(1);
// }



// Folder Zip method
function zipFolder(folderPath, outputZipPath) {
    return new Promise((resolve, reject) => {
        // Create a file to stream the archive data to.
        const output = fs.createWriteStream(outputZipPath);
        const archive = archiver('zip', { zlib: { level: 9 } }); // Best compression level

        // Listen for events
        output.on('close', () => {
            console.log(`Zipped ${archive.pointer()} total bytes`);
            resolve();
        });

        archive.on('error', (err) => reject(err));

        // Pipe archive data to the output file
        archive.pipe(output);

        // Append the folder to the archive
        archive.directory(folderPath, false); // `false` prevents nesting in a subfolder
        
        // Finalize the archive
        archive.finalize();
    });
}

// Example usage:
const folderPath = path.resolve('../../', 'core_plugin'); // Replace with your folder path
const outputZipPath = path.resolve('../../', 'core_plugin.zip'); // Replace with your desired output path

zipFolder(folderPath, outputZipPath)
  .then(() => {
    console.log('Folder successfully zipped!');
    // Replace 'your_zip_file.zip' with the path to the file you want to upload
    uploadFile('../../core_plugin.zip'); 
   })
    .catch((err) => console.error('Error zipping folder:', err));
