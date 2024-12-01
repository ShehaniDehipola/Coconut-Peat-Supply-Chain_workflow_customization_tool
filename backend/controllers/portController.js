const getPortModel = require('../models/Port');
const updateFileContent = require('./fileWriter');

// Retrieve an available port and update the file
exports.updateFileWithPort = async (req, res) => {
    try {
        // Get portDB instance from the app
        const portDB = req.app.get('portDB');
        const Port = getPortModel(portDB);

        // Find an available port and mark it as used
        const availablePort = await Port.findOneAndUpdate(
            { status: false }, // Find a port with status false
            { status: true },  // Update status to true
            { new: true }      // Return the updated document
        );

        if (!availablePort) {
            return res.status(404).send({ message: 'No available port found' });
        }

        // Update the file content with the available port
        const success = updateFileContent('./Dockerfile', availablePort.port);

        if (success) {
            res.status(200).send({ message: 'File updated successfully!', port: availablePort.port });
        } else {
            res.status(500).send({ message: 'Error updating the file' });
        }
    } catch (error) {
        console.error('Error retrieving port or updating file:', error);
        res.status(500).send({ message: 'Error retrieving port or updating file' });
    }
};
