const express = require("express");
const { createCustomer, getAllCustomers, assignWorkflowToCustomer } = require("../controllers/customerController");
const { verifyToken } = require("../middlewares/authMiddleware");
const router = express.Router();

router.post("/", createCustomer);
router.get("/all", getAllCustomers);
router.put("/assign-workflow", assignWorkflowToCustomer)

module.exports = router;