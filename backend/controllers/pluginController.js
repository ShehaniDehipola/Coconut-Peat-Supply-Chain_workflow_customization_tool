const NewPlugin = require('../models/Plugin');
const fs = require('fs');
const path = require('path');
const archiver = require('archiver');
const grpc = require('@grpc/grpc-js');
const protoLoader = require('@grpc/proto-loader');
const axios = require('axios');
const { updateFile } = require('../controllers/fileWriter');
const { generateFile } = require('../controllers/fileWriter');

// Save Plugin JSON
exports.savePlugin = async (req, res) => {
  try {
    const { plugin_name, nodes, links } = req.body;

    if (!plugin_name || !nodes || !links) {
      return res
        .status(400)
        .json({ success: false, message: 'Missing required fields' });
    }

    // Check if plugin already exists
    const existingPlugin = await NewPlugin.findOne({ plugin_name });

    if (existingPlugin) {
      return res
        .status(400)
        .json({ success: false, message: 'Plugin already exists' });
    }

    const plugin = new NewPlugin({ plugin_name, nodes, links });
    await plugin.save();
    res
      .status(201)
      .json({ success: true, message: 'Plugin saved successfully' });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// Fetch Plugin JSON by Plugin Name
exports.getPlugin = async (req, res) => {
  try {
    const plugin = await NewPlugin.findOne({
      plugin_name: req.params.plugin_name,
    });

    if (!plugin) {
      return res
        .status(404)
        .json({ success: false, message: 'Plugin not found' });
    }

    res.json({ success: true, data: plugin });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// Load the protobuf
const PROTO_PATH = path.join(__dirname, '../grpc-node-server/plugin.proto');
const packageDefinition = protoLoader.loadSync(PROTO_PATH, {
  keepCase: true,
  longs: String,
  enums: String,
  defaults: true,
  oneofs: true,
});

const pluginProto = grpc.loadPackageDefinition(packageDefinition).plugin;

// gRPC Client setup
const client = new pluginProto.MainService(
  '0.0.0.0:50051',
  grpc.credentials.createInsecure()
);

const newPluginClient = new pluginProto.NewPluginService(
  '0.0.0.0:50051',
  grpc.credentials.createInsecure()
);

exports.grpcFun = async (req, res) => {
  const { workflow_id, plugin_name, userRequirement, action } = req.body;

  if (!workflow_id || !plugin_name || !userRequirement || !action) {
    return res.status(400).json({ error: 'Missing required fields' });
  }

  // Simulate a successful response
  return res.json({
    message: 'Plugin registered successfully!',
    workflow_id,
    plugin_name,
    userRequirement,
    action,
  });

  // client.ClientFunction(
  //   { workflow_id, plugin_name, userRequirement, action },
  //   (error, response) => {
  //     if (error) {
  //       return res.status(500).json({ error: error.message });
  //     }
  //     res.json(response);
  //   }
  // );
};

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
    await updateFile(updateContent, `../washing/${plugin_name}.dockerfile`);

    // Step 2: Generate the second file
    const folderPath = await generateFile(
      goFileContent,
      plugin_name,
      sensor_name,
      userRequirement,
      execute_logic,
      save_path
    );

    // Step 3: Zip the folder
    const pluginFolderPath = path.resolve('../', 'washing'); // Replace with your folder path
    const outputZipPath = path.resolve('../', 'washing.zip'); // Replace with your desired output path

    zipFolder(pluginFolderPath, outputZipPath)
      .then(() => {
        console.log('Folder successfully zipped!');
        // path to the file  to upload
        uploadFile('../washing.zip');
        // Step 4: Upload the zipped folder via gRPC
        const zipFileData = fs.readFileSync(outputZipPath);
        const grpcRequest = {
          filename: 'washing.zip',
          filedata: zipFileData,
        };

        client.UploadFile(grpcRequest, (err, response) => {
          if (err) {
            console.error('Error uploading file via gRPC:', err);
            return res
              .status(500)
              .json({ message: 'Error uploading file via gRPC', error: err });
          }

          res.status(200).json({
            message: 'All steps completed successfully!',
            update: 'File updated successfully',
            generate: 'File generated successfully',
            zipUpload: response.message,
          });
        });
      })
      .catch((err) => console.error('Error zipping folder:', err));
  } catch (err) {
    console.error('Error processing all steps:', err);
    res
      .status(500)
      .json({ message: 'Error processing all steps', error: err.message });
  }
};

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

function uploadFile(filePath) {
  try {
    const filename = filePath.split('/').pop();
    const fileData = fs.readFileSync(filePath);

    const request = {
      filename: filename,
      filedata: fileData,
    };

    newPluginClient.NewPluginCreate(request, (err, response) => {
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
