const express = require("express");
const { createCustomer, getAllCustomers } = require("../controllers/customerController");
const { verifyToken } = require("../middlewares/authMiddleware");
const router = express.Router();

router.post("/", createCustomer);
router.get("/all", getAllCustomers)

module.exports = router;