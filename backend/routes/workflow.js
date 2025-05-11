const express = require('express');
const {
  createWorkflow,
  updateRequiredAmount,
  getAllWorkflows,
  getAWorkflow,
  updateWorkflowStatus,
  updateWorkflow,
  deleteWorkflow,
  checkValidations,
  getWorkflowsByManufacturer,
  getWorkflowVersions,
  updateStepTimme,
  updateSubStepTime,
} = require('../controllers/workflowController');
const router = express.Router();

router.post('/', createWorkflow);
router.patch('/:id/steps/:stepName', updateRequiredAmount);
router.get('/', getAllWorkflows);
router.get('/:workflow_id', getAWorkflow);
router.put('/:workflow_id', updateWorkflow);
router.put('/:workflow_id/status', updateWorkflowStatus);
router.delete('/:id', deleteWorkflow);
router.post('/validate-workflow', checkValidations);
router.get('/:manufacturerId', getWorkflowsByManufacturer);
router.get('/version/:workflow_id', getWorkflowVersions);
router.put('/:workflow_id/step/:step_order', updateStepTimme);
router.put(
  '/:workflow_id/step/:step_order/substep/:substep_name',
  updateSubStepTime
);

module.exports = router;
