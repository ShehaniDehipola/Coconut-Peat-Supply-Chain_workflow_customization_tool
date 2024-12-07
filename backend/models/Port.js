const mongoose = require('mongoose');

const portSchema = new mongoose.Schema({
    port: {
        type: Number,
        required: true,
    },
    status: {
        type: Boolean,
        required: true,
        default: false, // false means available, true means used
    },
}, {
    collection: 'port', // Explicitly name the collection if necessary
});

// Export a function to create the model using the given connection instance
module.exports = (connection) => {
    return connection.model('Port', portSchema);
};
