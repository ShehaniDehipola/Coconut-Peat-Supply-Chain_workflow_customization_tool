const express = require("express");
const {
  createManufacturer,
  getAllManufacturers,
} = require("../controllers/manufacturer");
const router = express.Router();

router.post("/", createManufacturer);
router.get("/all", getAllManufacturers);

module.exports = router;
