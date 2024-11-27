export function generateDSL(json) {
  const { nodes, links } = json;
  let instructions = "";

  // Find the Start node
  const startNode = nodes.find(node => node.category === "Start");
  if (!startNode) throw new Error("No Start node found");
  instructions += "start\n";

  // Utility to find outgoing links from a node
  const getOutgoingLinks = (nodeKey) =>
    links.filter(link => link.from === nodeKey);

  // Traverse the workflow starting from the Start node
  function traverse(nodeKey, visited = new Set()) {
    if (visited.has(nodeKey)) return; // Prevent infinite loops
    visited.add(nodeKey);

    const currentNode = nodes.find(node => node.key === nodeKey);
    if (!currentNode) return;

    // Handle each node type
    if (currentNode.category === "Process") {
      instructions += `action "${currentNode.text}"\n`;
    } else if (currentNode.category === "Decision") {
      const outgoingLinks = getOutgoingLinks(nodeKey);

      outgoingLinks.forEach((link, index) => {
        const targetNode = nodes.find(node => node.key === link.to);
        if (targetNode) {
          if (index === 0) {
            instructions += `if "${currentNode.text}" == "Yes":\n`;
          } else {
            instructions += `else:\n`;
          }
          instructions += `\taction "${targetNode.text}"\n`;

          // Recursively traverse the target node
          traverse(link.to, visited);
        }
      });
      return; // Stop further traversal for decisions (handled above)
    } else if (currentNode.category === "End") {
      instructions += "end\n";
      return;
    }

    // Continue traversal for other node types
    const outgoingLinks = getOutgoingLinks(nodeKey);
    outgoingLinks.forEach(link => traverse(link.to, visited));
  }

  // Start traversal from the Start node
  traverse(startNode.key);

  return instructions;
}
