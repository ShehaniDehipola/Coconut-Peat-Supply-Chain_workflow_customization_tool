function generateDSL(model) {
  console.log("Input model:", model);
  const { nodes, links } = model;
  let instructions = "";

  // Find the start node
  const startNode = nodes.find(node => node.type === "Start");
  if (!startNode) throw new Error("No Start node found");
  instructions += "start\n";

  // Traverse the workflow from the start node
  let visited = new Set();
  function traverse(nodeId) {
    if (visited.has(nodeId)) return; // Avoid cycles
    visited.add(nodeId);

    // Find current node
    const currentNode = nodes.find(node => node.id === nodeId);
    if (!currentNode) return;

    // Handle the node based on its type
    if (currentNode.type === "Action") {
      instructions += `action "${currentNode.label}"\n`;
    } else if (currentNode.type === "Decision") {
      // Get outgoing links from this node
      const outgoingLinks = links.filter(link => link.from === nodeId);

      outgoingLinks.forEach(link => {
        if (link.label) {
          instructions += `if "${currentNode.label}" == "${link.label}":\n`;
          traverse(link.to); // Recursively handle next node
          instructions += "else:\n";
        } else {
          traverse(link.to); // Default path
        }
      });
    } else if (currentNode.type === "End") {
      instructions += "end\n";
    }
  }

  // Start traversing from the Start node
  traverse(startNode.id);

  console.log("Generated DSL Instructions:", instructions);

  return instructions;
}
