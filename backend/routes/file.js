const express = require('express');
const { updateFile, generateFile } = require("../controllers/fileWriter");
const { updateFileWithPort } = require('../controllers/portController');
const { processAll } = require('../controllers/pluginController');
const router = express.Router();

router.put('/update-file', updateFile);
router.put('/generate-file', generateFile);
router.post('/process-all', processAll)
router.put('/update-file-port', updateFileWithPort);

module.exports = router;
