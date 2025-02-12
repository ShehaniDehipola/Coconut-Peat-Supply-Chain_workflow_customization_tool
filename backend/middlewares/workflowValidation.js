const Workflow = require("../models/Worflow");

// 1. Workflow structure validation
const validateWorkflowStructure = (req, res, next) => {
  const { workflow_name, exporter_id, steps } = req.body;

  if (
    !workflow_name ||
    !exporter_id ||
    !Array.isArray(steps) ||
    steps.length === 0
  ) {
    return res
      .status(400)
      .json({
        message: "Workflow must have a name, exporter, and at least one step.",
      });
  }

  // Validate each step has a required_amount
  for (let step of steps) {
    if (
      !step.pluginName ||
      typeof step.order !== "number" ||
      typeof step.required_amount !== "number" ||
      step.required_amount < 0
    ) {
      return res
        .status(400)
        .json({ message: `Invalid step data for plugin: ${step.pluginName}` });
    }
  }
  next(); // Pass to next middleware or controller
};

// 2. Business logic validation (Checking Required Plugins)
const validateRequiredPlugins = (req, res, next) => {
  const requiredSteps = ["Grading", "Cutting", "Washing"];
  const workflowSteps = req.body.steps.map((step) => step.pluginName);

  for (let step of requiredSteps) {
    if (!workflowSteps.includes(step)) {
      return res
        .status(400)
        .json({ message: `Missing required step: ${step}` });
    }
  }
  next();
};

// 3. Step execution erder validation
const validateWorkflowOrder = (req, res, next) => {
  const correctOrder = ["Grading", "Cutting", "Washing", "Drying"];
  const workflowOrder = req.body.steps.map((step) => step.pluginName);

  for (let i = 0; i < workflowOrder.length - 1; i++) {
    if (
      correctOrder.indexOf(workflowOrder[i]) >
      correctOrder.indexOf(workflowOrder[i + 1])
    ) {
      return res
        .status(400)
        .json({
          message: `Invalid step order: ${
            workflowOrder[i]
          } cannot come before ${workflowOrder[i + 1]}`,
        });
    }
  }
  next();
};

// 4. IoT sensor validation

// 5. Manufacturer capabilities validation
const manufacturers = [
  { id: "manu-001", supportedPlugins: ["Grading", "Cutting"], capacity: 100 },
  {
    id: "manu-002",
    supportedPlugins: ["Grading", "Cutting", "Washing"],
    capacity: 50,
  },
];

const validateManufacturer = async (req, res, next) => {
  const { manufacturer_id, steps } = req.body;
  if (!manufacturer_id)
    return res.status(400).json({ message: "Manufacturer ID is required." });

  const manufacturer = manufacturers.find((m) => m.id === manufacturer_id);
  if (!manufacturer)
    return res.status(400).json({ message: "Manufacturer not found." });

  const workflowPlugins = steps.map((step) => step.pluginName);
  const missingPlugins = workflowPlugins.filter(
    (plugin) => !manufacturer.supportedPlugins.includes(plugin)
  );

  if (missingPlugins.length > 0) {
    return res.status(400).json({
      message: `Manufacturer lacks support for: ${missingPlugins.join(", ")}`,
    });
  }

  if (
    steps.reduce((sum, step) => sum + step.required_amount, 0) >
    manufacturer.capacity
  ) {
    return res
      .status(400)
      .json({ message: `Manufacturer does not have enough capacity.` });
  }
  next();
};

// 6. Version control validation
const validateWorkflowVersion = async (req, res, next) => {
  try {
    const workflow = await Workflow.findById(req.params.id);
    if (!workflow)
      return res.status(404).json({ message: "Workflow not found." });

    if (req.body.version && req.body.version !== workflow.version) {
      return res
        .status(400)
        .json({
          message: `Version mismatch. Latest version is ${workflow.version}.`,
        });
    }

    next();
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

module.exports = {
  validateWorkflowStructure,
  validateRequiredPlugins,
  validateWorkflowOrder,
  validateManufacturer,
  validateWorkflowVersion,
};
