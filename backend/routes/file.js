const express = require('express');
const { updateFile, generateFile } = require("../controllers/fileWriter");
const { updateFileWithPort } = require('../controllers/portController');
const router = express.Router();

router.put('/update-file', updateFile);
router.put('/generate-file', generateFile);

module.exports = router;
