// export function generateDSL(json) {
//   const { nodes, links } = json;
//   let instructions = "";

//   // Find the Start node
//   const startNode = nodes.find(node => node.category === "Start");
//   if (!startNode) throw new Error("No Start node found");
//   instructions += "start\n";

//   // Utility to find outgoing links from a node
//   const getOutgoingLinks = (nodeKey) =>
//     links.filter(link => link.from === nodeKey);

//   // Traverse the workflow starting from the Start node
//   function traverse(nodeKey, visited = new Set()) {
//     if (visited.has(nodeKey)) return; // Prevent infinite loops
//     visited.add(nodeKey);

//     const currentNode = nodes.find(node => node.key === nodeKey);
//     if (!currentNode) return;

//     // Handle each node type
//     if (currentNode.category === "Process") {
//       instructions += `action "${currentNode.text}"\n`;
//     } else if (currentNode.category === "Decision") {
//       const outgoingLinks = getOutgoingLinks(nodeKey);

//       outgoingLinks.forEach((link, index) => {
//         const targetNode = nodes.find(node => node.key === link.to);
//         if (targetNode) {
//           if (index === 0) {
//             instructions += `if "${currentNode.text}" == "Yes":\n`;
//           } else {
//             instructions += `else:\n`;
//             instructions += `\taction "${targetNode.text}"\n`;
//           }

//           // Recursively traverse the target node
//           traverse(link.to, visited);
//         }
//       });
//       return; // Stop further traversal for decisions (handled above)
//     } else if (currentNode.category === "End") {
//       instructions += "end\n";
//       return;
//     }

//     // Continue traversal for other node types
//     const outgoingLinks = getOutgoingLinks(nodeKey);
//     outgoingLinks.forEach(link => traverse(link.to, visited));
//   }

//   // Start traversal from the Start node
//   traverse(startNode.key);

//   return instructions;
// }

export function generateDSL(json) {
  const { nodes, links } = json;
  let instructions = "";

  // Find the Start node
  const startNode = nodes.find(node => node.category === "Start");
  if (!startNode) throw new Error("No Start node found");
  instructions += "Start the process\n";

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
      instructions += `Step: ${currentNode.text}\n`;
    } else if (currentNode.category === "Decision") {
      const outgoingLinks = getOutgoingLinks(nodeKey);
      let conditionText = currentNode.text;

      // Replace symbols with user-friendly text
      conditionText = conditionText
        .replace(/>=/g, 'greater than or equal to')
        .replace(/<=/g, 'less than or equal to')
        .replace(/==/g, 'equal to')
        .replace(/!=/g, 'not equal to');

      instructions += `Decision: Is ${conditionText}?\n`;

      outgoingLinks.forEach((link, index) => {
        const targetNode = nodes.find(node => node.key === link.to);
        if (targetNode) {
          if (index === 0) {
            instructions += `  Yes -> ${targetNode.category === "End" ? "End the process" : `Step: ${targetNode.text}`}\n`;
          } else {
            instructions += `  No -> ${targetNode.category === "End" ? "End the process" : `Repeat the ${targetNode.text}`}\n`;
          }
        }
      });
      return; // Stop further traversal for decisions (handled above)
    } else if (currentNode.category === "End") {
      instructions += "End the process\n";
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

