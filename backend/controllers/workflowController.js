const Workflow = require("../models/Worflow");
const {
  validateWorkflowStructure,
  validateRequiredPlugins,
  validateWorkflowOrder,
  validateManufacturer,
  validateWorkflowVersion,
} = require("../middlewares/workflowValidation");

// create a workflow
exports.createWorkflow = async (req, res) => {
  try {
    const { exporter_id, steps } = req.body;

    // Validate that each step has a required amount
    for (let step of steps) {
      if (
        typeof step.required_amount !== "number" ||
        step.required_amount < 0
      ) {
        return res
          .status(400)
          .json({ message: `Invalid required_amount for ${step.pluginName}` });
      }
    }

    // validation checks before saving the workflow
    await validateWorkflowStructure(req, res, () => {});
    await validateRequiredPlugins(req, res, () => {});
    await validateWorkflowOrder(req, res, () => {});

    const newWorkflow = new Workflow(req.body);
    const savedWorkflow = await newWorkflow.save();
    res
      .status(201)
      .json({ message: "Workflow created successfully!", savedWorkflow });
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
};

// update the required amount of a plugin
exports.updateRequiredAmount = async (req, res) => {
  try {
    const { required_amount } = req.body;
    if (typeof required_amount !== "number" || required_amount < 0) {
      return res.status(400).json({ message: "Invalid required_amount" });
    }

    const workflow = await Workflow.findById(req.params.id);
    if (!workflow)
      return res.status(404).json({ message: "Workflow not found" });

    let stepFound = false;
    workflow.steps = workflow.steps.map((step) => {
      if (step.pluginName === req.params.stepName) {
        step.required_amount = required_amount;
        stepFound = true;
      }
      return step;
    });

    if (!stepFound)
      return res.status(404).json({ message: "Step not found in workflow" });

    workflow.updated_at = Date.now();
    await workflow.save();
    res.json({ message: "Step updated successfully", workflow });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

// get all workflows
exports.getAllWorkflows = async (req, res) => {
  try {
    const workflows = await Workflow.find();
    res.json(workflows);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

// get a workflow by id
exports.getAWorkflow = async (req, res) => {
  try {
    const workflow = await Workflow.findById(req.params.id);
    if (!workflow)
      return res.status(404).json({ message: "Workflow not found" });
    res.json(workflow);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

// get all versions workflows by id
exports.getWorkflowVersions = async (req, res) => {
  try {
    const workflowId = req.params.workflow_id;

    // Ensure it's a string before querying
    if (typeof workflowId !== "string") {
      return res.status(400).json({ error: "Invalid workflow_id format" });
    }

    const versions = await Workflow.find({ workflow_id: workflowId }).sort({
      version: -1,
    });

    if (!versions.length) {
      return res.status(404).json({ message: "No versions found" });
    }

    res.status(200).json(versions);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

// Update workflow and create new version
exports.updateWorkflow = async (req, res) => {
  try {
    /// validation checks before updating
    await validateWorkflowVersion(req, res, () => {});
    await validateManufacturer(req, res, () => {});

    // Find the existing workflow
    const existingWorkflow = await Workflow.findById(req.params.id);
    if (!existingWorkflow) {
      return res.status(404).json({ message: "Workflow not found" });
    }

    // Create a new version (incremented)
    const newVersion = existingWorkflow.version + 1;

    // Create a new document instead of modifying the existing one
    const newWorkflow = new Workflow({
      workflow_name: req.body.workflow_name || existingWorkflow.workflow_name,
      exporter_id: existingWorkflow.exporter_id,
      steps: req.body.steps || existingWorkflow.steps,
      manufacturer_id:
        req.body.manufacturer_id || existingWorkflow.manufacturer_id,
      status: req.body.status || existingWorkflow.status,
      version: newVersion, // Incremented version
      created_at: existingWorkflow.created_at, // Keep original creation date
      updated_at: Date.now(),
    });

    // Save the new version in the database
    await newWorkflow.save();

    res.status(201).json({
      message: "Workflow updated as a new version",
      workflow: newWorkflow,
    });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

// Update Workflow Status
exports.updateWorkflowStatus = async (req, res) => {
  try {
    const { status } = req.body;
    const validStatuses = ["pending", "in_progress", "completed"];

    if (!validStatuses.includes(status)) {
      return res.status(400).json({ message: "Invalid status" });
    }

    const workflow = await Workflow.findById(req.params.id);
    if (!workflow)
      return res.status(404).json({ message: "Workflow not found" });

    workflow.status = status;
    workflow.updated_at = Date.now();

    await workflow.save();
    res.json({ message: `Workflow status updated to ${status}` });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

// Delete a workflow
exports.deleteWorkflow = async (req, res) => {
  try {
    const workflow = await Workflow.findByIdAndDelete(req.params.id);
    if (!workflow)
      return res.status(404).json({ message: "Workflow not found" });

    res.json({ message: "Workflow deleted successfully" });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

// Check Validations
exports.checkValidations = async (req, res, next) => {
  try {
    console.log("Received workflow data for validation:", req.body);

    // Run each validation and return immediately if any fail
    let validationFailed = false;

    await validateWorkflowStructure(req, res, () => {
      if (res.headersSent) validationFailed = true;
    });
    if (validationFailed) return;

    await validateRequiredPlugins(req, res, () => {
      if (res.headersSent) validationFailed = true;
    });
    if (validationFailed) return;

    await validateWorkflowOrder(req, res, () => {
      if (res.headersSent) validationFailed = true;
    });
    if (validationFailed) return;

    // if all validations pass, send success response
    res.status(200).json({ message: "Workflow validation successful." });
  } catch (err) {
    console.error("Validation error:", err.message);
    if (!res.headersSent) {
      res.status(500).json({ error: err.message });
    }
  }
};

// Get all workflows by manufacturer ID
exports.getWorkflowsByManufacturer = async (req, res) => {
  try {
    const { manufacturerId } = req.params;

    const workflows = await Workflow.find({ manufacturer_id: manufacturerId });

    if (!Array.isArray(workflows) || workflows.length === 0) {
      return res.status(200).json([]); // Return empty array instead of an object
    }

    // if (!workflows.length) {
    //   return res
    //     .status(404)
    //     .json({ message: "No workflows found for this manufacturer" });
    // }

    res.status(200).json(workflows);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};
