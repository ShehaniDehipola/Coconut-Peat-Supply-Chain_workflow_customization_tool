const express = require("express");
const { savePlugin, getPlugin,grpcFun,grpcFun2 } = require("../controllers/pluginController");
// const {grpcFun}= require("../grpc-node-server/server")
const router = express.Router();

router.post("/save", savePlugin);
router.post("/grpc", grpcFun);
router.post("/grpcFun", grpcFun2);
router.get("/get/:plugin_name", getPlugin);

module.exports = router;
