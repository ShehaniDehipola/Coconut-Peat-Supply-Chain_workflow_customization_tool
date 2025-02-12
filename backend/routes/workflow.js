const express = require("express");
const {
  createWorkflow,
  updateRequiredAmount,
  getAllWorkflows,
  getAWorkflow,
  updateWorkflowStatus,
  updateWorkflow,
  deleteWorkflow,
} = require("../controllers/workflowController");
const router = express.Router();

router.post("/", createWorkflow);
router.patch("/:id/steps/:stepName", updateRequiredAmount);
router.get("/", getAllWorkflows);
router.get("/:id", getAWorkflow);
router.patch("/:id", updateWorkflow);
router.put("/:id/status", updateWorkflowStatus);
router.delete("/:id", deleteWorkflow);

module.exports = router;
