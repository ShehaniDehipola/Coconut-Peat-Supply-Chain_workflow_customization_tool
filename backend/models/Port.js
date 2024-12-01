const mongoose = require('mongoose');

// Dynamically use a specific database
const portDB = mongoose.connection.useDb("portDB");

// Define the schema
const portSchema = new mongoose.Schema({
    plugin_name: String,
    port: Number,
    status: Boolean,
    description: String,
});


// Export a function to create the Port model for a specific database
module.exports = (db) => db.model('Port', portSchema);
