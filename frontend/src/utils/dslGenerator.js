// utils/dslGenerator.js

/**
 * Generates DSL instructions based on nodes and plugin name.
 * @param {string} pluginName - The name of the plugin.
 * @param {Array} nodes - The list of nodes representing actions, waits, and checks.
 * @returns {string} - The generated DSL instructions.
 */
export function generateDSLInstructions(pluginName, nodes) {
  let dsl = `plugin ${pluginName} {\n`;

  nodes.forEach((node) => {
    switch (node.type) {
      case 'action':
        dsl += `    action ${node.data.label}\n`;
        break;
      case 'wait':
        dsl += `    wait ${node.data.label}\n`;
        break;
      case 'check':
        dsl += `    check ${node.data.label}\n`;
        break;
      default:
        break;
    }
  });

  dsl += `}`;
  return dsl;
}
