const Topic = require('../models/Topic');

const getAllTopics = async (req, res) => {
  try {
    const topics = await Topic.find({});
    res.status(200).json(topics);
  } catch (error) {
    res
      .status(500)
      .json({ message: 'Error fetching topics', error: error.message });
  }
};

module.exports = { getAllTopics };
