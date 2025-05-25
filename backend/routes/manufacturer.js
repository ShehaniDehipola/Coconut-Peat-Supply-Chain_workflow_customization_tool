const express = require("express");
const {
  createManufacturer,
  getAllManufacturers,
    getManufacturersByExporter
} = require("../controllers/manufacturer");
const { verifyToken } = require("../middlewares/authMiddleware");
const router = express.Router();

router.post("/", createManufacturer);
router.get("/all", getAllManufacturers)
router.get("/exporter", verifyToken, getManufacturersByExporter);

module.exports = router;
