const mongoose = require('mongoose');

const pluginSchema = new mongoose.Schema({
  plugin_name: { type: String, required: true, unique: true },
  nodes: { type: Array, required: true },
  links: { type: Array, required: true },
});

module.exports = mongoose.model('NewPlugin', pluginSchema);
