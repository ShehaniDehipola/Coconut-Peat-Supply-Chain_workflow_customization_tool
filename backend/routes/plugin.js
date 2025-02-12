const express = require("express");
const { savePlugin, getPlugin } = require("../controllers/pluginController");
const router = express.Router();

router.post("/save", savePlugin);
router.get("/get/:plugin_name", getPlugin);

module.exports = router;
