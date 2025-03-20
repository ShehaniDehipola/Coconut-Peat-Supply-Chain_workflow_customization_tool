const mongoose = require('mongoose');

const topicSchema = new mongoose.Schema({
  topic: {
    type: String,
    required: true,
  },
  timestamp: {
    type: Date,
    default: Date.now,
  },
});

const Topic = mongoose.model('Topic', topicSchema);

module.exports = Topic;
