const express = require("express");
const { savePlugin, getPlugin,grpcFun } = require("../controllers/pluginController");
// const {grpcFun}= require("../grpc-node-server/server")
const router = express.Router();

router.post("/save", savePlugin);
router.post("/grpc", grpcFun);
router.get("/get/:plugin_name", getPlugin);

module.exports = router;
