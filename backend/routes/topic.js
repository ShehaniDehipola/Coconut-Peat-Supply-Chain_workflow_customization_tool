const express = require('express');
const { getAllTopics } = require('../controllers/topicController');
const router = express.Router();

router.get('/all', getAllTopics);

module.exports = router;
