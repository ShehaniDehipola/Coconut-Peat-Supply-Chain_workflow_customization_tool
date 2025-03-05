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
    const { workflow_id, exporter_id, manufacturer_id, steps } = req.body;

    // // Basic check for versions array
    // if (!versions || !Array.isArray(versions) || versions.length === 0) {
    //   return res
    //     .status(400)
    //     .json({ message: "Workflow must have at least one version." });
    // }

    // Optionally, you could further validate that each version has the required properties:
    // for (const versionObj of versions) {
    //   if (
    //     !versionObj.steps ||
    //     !Array.isArray(versionObj.steps) ||
    //     versionObj.steps.length === 0
    //   ) {
    //     return res
    //       .status(400)
    //       .json({ message: "Each version must include at least one step." });
    //   }
    // }

    // // validation checks before saving the workflow
    // await validateWorkflowStructure(req, res, () => {});
    // await validateRequiredPlugins(req, res, () => {});
    // await validateWorkflowOrder(req, res, () => {});

    // Create the workflow with an initial version entry
    const newWorkflow = new Workflow({
      workflow_id,
      exporter_id,
      manufacturer_id,
      versions: [
        {
          // versionNumber will default to 1, status defaults to "draft"
          steps: steps,
        },
      ],
    });

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
// exports.getWorkflowVersions = async (req, res) => {
//   try {
//     const workflowId = req.params.workflow_id;

//     // Ensure it's a string before querying
//     if (typeof workflowId !== "string") {
//       return res.status(400).json({ error: "Invalid workflow_id format" });
//     }

//     const versions = await Workflow.find({ workflow_id: workflowId }).sort({
//       version: -1,
//     });

//     if (!versions.length) {
//       return res.status(404).json({ message: "No versions found" });
//     }

//     res.status(200).json(versions);
//   } catch (err) {
//     res.status(500).json({ error: err.message });
//   }
// };

exports.getWorkflowVersions = async (req, res) => {
  try {
    const workflowId = req.params.workflow_id;

    // Ensure it's a string before querying
    if (typeof workflowId !== "string") {
      return res.status(400).json({ error: "Invalid workflow_id format" });
    }

    // Retrieve the workflow document
    const workflow = await Workflow.findOne({ workflow_id: workflowId });
    if (!workflow) {
      return res.status(404).json({ message: "Workflow not found" });
    }

    // Optionally sort the versions array by versionNumber descending
    const sortedVersions = workflow.versions.sort(
      (a, b) => b.versionNumber - a.versionNumber
    );

    res.status(200).json(sortedVersions);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

// Update workflow and create new version
// exports.updateWorkflow = async (req, res) => {
//   try {
//     /// validation checks before updating
//     // await validateWorkflowVersion(req, res, () => {});
//     // await validateManufacturer(req, res, () => {});

//     // Find the existing workflow
//     const existingWorkflow = await Workflow.findById(req.params.id);
//     if (!existingWorkflow) {
//       return res.status(404).json({ message: "Workflow not found" });
//     }

//     console.log("Existing workflow: ", existingWorkflow);

//     // Create a new version (incremented)
//     const newVersion = existingWorkflow.version + 1;

//     // Create a new document instead of modifying the existing one
//     // const newWorkflow = new Workflow({
//     //   workflow_id: existingWorkflow.workflow_id,
//     //   exporter_id: existingWorkflow.exporter_id,
//     //   steps: req.body.steps || existingWorkflow.steps,
//     //   manufacturer_id: existingWorkflow.manufacturer_id,
//     //   status: existingWorkflow.status,
//     //   version: newVersion, // Incremented version
//     //   created_at: existingWorkflow.created_at, // Keep original creation date
//     //   updated_at: Date.now(),
//     // });

//     let versions = existingWorkflow.versions;
//     let updatedArray = versions.push({ name: "Saban Pena3" });

//     await Workflow.updateOne(
//       { _id: req.params.id },
//       {
//         workflow_id: existingWorkflow.workflow_id,
//         exporter_id: existingWorkflow.exporter_id,
//         steps: req.body.steps || existingWorkflow.steps,
//         manufacturer_id: existingWorkflow.manufacturer_id,
//         status: existingWorkflow.status,
//         version: newVersion, // Incremented version
//         versions: updatedArray,
//         created_at: existingWorkflow.created_at, // Keep original creation date
//         updated_at: Date.now(),
//       }
//     );
//     // Save the new version in the database
//     await existingWorkflow.save();

//     res.status(201).json({
//       message: "Workflow updated as a new version",
//       workflow: Workflow,
//     });
//   } catch (err) {
//     res.status(500).json({ error: err.message });
//   }
// };

// Update workflow by adding a new version
exports.updateWorkflow = async (req, res) => {
  try {
    // Find the existing workflow by ID
    const existingWorkflow = await Workflow.findOne({
      workflow_id: req.params.workflow_id,
    });
    if (!existingWorkflow) {
      return res.status(404).json({ message: "Workflow not found" });
    }

    // Optional: perform any validation checks here
    // e.g. await validateWorkflowVersion(req, res, () => {});
    // e.g. await validateManufacturer(req, res, () => {});

    // Determine the new version number (increment from the highest existing one)
    let lastVersionNumber = 0;
    if (existingWorkflow.versions.length > 0) {
      lastVersionNumber =
        existingWorkflow.versions[existingWorkflow.versions.length - 1]
          .versionNumber;
    }
    const newVersionNumber = lastVersionNumber + 1;

    // Construct a new version object
    // status and steps can come from req.body, or default as needed
    const newVersion = {
      versionNumber: newVersionNumber,
      status: req.body.status || "draft", // or some logic to determine new status
      steps: req.body.steps || [], // or copy from the old version if you want
    };

    // Push the new version onto the array
    existingWorkflow.versions.push(newVersion);

    // Update 'updated_at' timestamp
    existingWorkflow.updated_at = Date.now();

    // Save the updated workflow
    await existingWorkflow.save();

    res.status(200).json({
      message: "New version added to workflow",
      workflow: existingWorkflow,
    });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

// Update Workflow Status
// exports.updateWorkflowStatus = async (req, res) => {
//   try {
//     const { status } = req.body;
//     const validStatuses = ["pending", "in_progress", "completed"];

//     if (!validStatuses.includes(status)) {
//       return res.status(400).json({ message: "Invalid status" });
//     }

//     const workflow = await Workflow.findById(req.params.id);
//     if (!workflow)
//       return res.status(404).json({ message: "Workflow not found" });

//     workflow.status = status;
//     workflow.updated_at = Date.now();

//     await workflow.save();
//     res.json({ message: `Workflow status updated to ${status}` });
//   } catch (err) {
//     res.status(500).json({ error: err.message });
//   }
// };

// Update a specific version's status
exports.updateWorkflowStatus = async (req, res) => {
  try {
    const { status, versionNumber } = req.body;
    const validStatuses = ["draft", "pending", "in_progress", "completed"];

    // Validate status
    if (!validStatuses.includes(status)) {
      return res.status(400).json({ message: "Invalid status" });
    }

    // Validate versionNumber
    if (typeof versionNumber !== "number") {
      return res
        .status(400)
        .json({ message: "versionNumber is required and must be a number" });
    }

    // Find the workflow by its ID
    const workflow = await Workflow.findOne({
      workflow_id: req.params.workflow_id,
    });
    if (!workflow) {
      return res.status(404).json({ message: "Workflow not found" });
    }

    // Find the index of the version with the matching versionNumber
    const versionIndex = workflow.versions.findIndex(
      (v) => v.versionNumber === versionNumber
    );
    if (versionIndex === -1) {
      return res.status(404).json({ message: "Version not found" });
    }

    // Update the status of the specific version
    workflow.versions[versionIndex].status = status;
    workflow.updated_at = Date.now();

    // Save the updated workflow
    await workflow.save();

    res.json({
      message: `Version ${versionNumber} status updated to ${status}`,
      workflow,
    });
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
