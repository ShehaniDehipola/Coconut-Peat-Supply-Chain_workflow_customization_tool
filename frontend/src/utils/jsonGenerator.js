export function generateJSON(instructions) {
  console.log("Input DSL Instructions:", instructions);

  const lines = instructions.split("\n");
  const json = { nodes: [], links: [] };

  let lastNode = null;
  lines.forEach((line, index) => {
    if (line.startsWith("start")) {
      json.nodes.push({ id: 1, key: 1, type: "Start", category: "Start", label: "Start", text: "Start" });
      lastNode = 1;
    } else if (line.startsWith("action")) {
      const label = line.match(/"([^"]+)"/)[1];
      const id = json.nodes.length + 1;
      json.nodes.push({ id, key: id, type: "Action", category: "Process", label, text: label });
      if (lastNode) json.links.push({ from: lastNode, to: id });
      lastNode = id;
    } else if (line.startsWith("if")) {
      const condition = line.match(/"([^"]+)"/)[1];
      const id = json.nodes.length + 1;
      json.nodes.push({ id, key: id, type: "Decision", category: "Decision", label: condition, text: condition });
      if (lastNode) json.links.push({ from: lastNode, to: id });
      lastNode = id;
    } else if (line.startsWith("end")) {
      const id = json.nodes.length + 1;
      json.nodes.push({ id, key: id, type: "End", category: "End", label: "End", text: "End" });
      if (lastNode) json.links.push({ from: lastNode, to: id });
    }
  });

  console.log("Generated JSON:", JSON.stringify(json, null, 2));
  return json;
}
