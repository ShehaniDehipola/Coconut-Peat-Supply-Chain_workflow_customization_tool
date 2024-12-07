export function generateGoCode(json) {
  const nodes = json.nodes;
  const links = json.links;
    
  console.log("Nodes:", nodes); // Log all nodes
  console.log("Links:", links); // Log all links

  // Map for quick lookup of node connections
  const graph = {};
  nodes.forEach((node) => {
    graph[node.key] = { ...node, next: [] };
  });
  links.forEach((link) => {
    graph[link.from].next.push(link.to);
  });
    
    console.log("Graph:", graph); // Log the graph structure

  // Helper function to process nodes recursively
    function processNode(node) {
      console.log("Processing Node:", node); // Log the current node being processed
    let code = "";
    if (node.category === "Start") {
      code += `func Start() {\n\tfmt.Println("Starting workflow: ${node.text}")\n}\n\n`;
    } else if (node.category === "Process") {
      code += `func ${node.text.replace(/\s+/g, "")}() {\n\tfmt.Println("Executing: ${node.text}")\n}\n\n`;
    } else if (node.category === "Decision") {
      code += `func ${node.text.replace(/\s+/g, "")}(value int) bool {\n`;
      code += `\tfmt.Println("Decision: ${node.text}")\n`;
      code += `\treturn value <= 200\n}\n\n`;
    } else if (node.category === "End") {
      code += `func End() {\n\tfmt.Println("Ending workflow: ${node.text}")\n}\n\n`;
    }
    return code;
  }

  // Generate functions for each node
  let goCode = "package main\n\nimport \"fmt\"\n\n";
  Object.values(graph).forEach((node) => {
    goCode += processNode(node);
  });
    
    console.log("Generated Functions:\n", goCode);

  // Generate the main function
  goCode += "func main() {\n";
  goCode += "\tStart()\n";
  let currentNode = graph[-1]; // Start with the Start node
  while (currentNode && currentNode.next.length > 0) {
    if (currentNode.category === "Decision") {
      const yesNode = graph[currentNode.next[0]]; // YES path
      const noNode = graph[currentNode.next[1]]; // NO path
      goCode += `\tif ${currentNode.text.replace(/\s+/g, "")}(200) {\n`;
      goCode += `\t\t${yesNode.text.replace(/\s+/g, "")}()\n`;
      goCode += `\t} else {\n`;
      goCode += `\t\t${noNode.text.replace(/\s+/g, "")}()\n`;
      goCode += `\t}\n`;
      currentNode = null; // End traversal
    } else {
      currentNode = graph[currentNode.next[0]];
      goCode += `\t${currentNode.text.replace(/\s+/g, "")}()\n`;
    }
  }
    goCode += "\tEnd()\n}\n";
    console.log("Final Generated Go Code:\n", goCode); // Log the final Go code

  return goCode;
}
