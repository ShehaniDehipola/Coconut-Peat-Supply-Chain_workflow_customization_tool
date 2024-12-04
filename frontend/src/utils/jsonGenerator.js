export function generateJSON(instructions) {
  console.log("Input DSL Instructions:", instructions);

  const lines = instructions.split("\n");
  const json = { nodes: [], links: [] };

  let lastNode = null;
  let decisionNode = null;
  let yesNode = null;
  let noNode = null;
  let actionNodes = {}; // To track action nodes by label

  lines.forEach((line, index) => {
    if (line.startsWith("Start the process")) {
      json.nodes.push({
        id: 1,
        key: 1,
        type: "Start",
        category: "Start",
        label: "Start",
        text: "Start",
      });
      lastNode = 1;
    } else if (line.startsWith("Step")) {
      const label = line.match(/Step: (.+)/)[1];
      const id = json.nodes.length + 1;
      json.nodes.push({
        id,
        key: id,
        type: "Action",
        category: "Process",
        label,
        text: label,
      });
      if (lastNode) json.links.push({ from: lastNode, to: id });
      lastNode = id;
      actionNodes[label] = id; // Store the action node with its label
    } else if (line.startsWith("Decision")) {
      let condition = line.match(/Decision: Is (.+)\?/)[1];
      condition = condition
        .replace(/greater than or equal to/g, ">=")
        .replace(/less than or equal to/g, "<=")
        .replace(/greater than/g, ">")
        .replace(/less than/g, "<")
        .replace(/equal to/g, "==")
        .replace(/not equal to/g, "!=");
      const id = json.nodes.length + 1;
      json.nodes.push({
        id,
        key: id,
        type: "Decision",
        category: "Decision",
        label: condition,
        text: condition,
      });
      if (lastNode) json.links.push({ from: lastNode, to: id });
      decisionNode = id;
    } else if (line.trim().startsWith("Yes ->")) {
      const label = line.match(/Yes -> (.+)/)[1];
      const id = json.nodes.length + 1;
      if (label === "End the process") {
        json.nodes.push({
          id,
          key: id,
          type: "End",
          category: "End",
          label: "End",
          text: "End",
        });
      } else {
        json.nodes.push({
          id,
          key: id,
          type: "Action",
          category: "Process",
          label,
          text: label,
        });
      }
      if (decisionNode)
        json.links.push({ from: decisionNode, to: id, condition: "Yes" });
      yesNode = id;
      if (label !== "End the process") lastNode = id;
    } else if (line.trim().startsWith("No ->")) {
      const label = line.match(/No -> (.+)/)[1];
      let id;
      if (label.startsWith("Repeat the")) {
        const actionLabel = label.replace("Repeat the ", "").trim();
        id = actionNodes[actionLabel];
      } else if (label === "End the process") {
        id = json.nodes.length + 1;
        json.nodes.push({
          id,
          key: id,
          type: "End",
          category: "End",
          label: "End",
          text: "End",
        });
      } else {
        id = actionNodes[label] || json.nodes.length + 1;
        if (!actionNodes[label]) {
          json.nodes.push({
            id,
            key: id,
            type: "Action",
            category: "Process",
            label,
            text: label,
          });
        }
      }
      if (decisionNode)
        json.links.push({ from: decisionNode, to: id, condition: "No" });
      noNode = id;
      if (label !== "End the process" && !label.startsWith("Repeat the"))
        lastNode = id;
    } else if (line.startsWith("End the process")) {
      const id = json.nodes.length + 1;
      json.nodes.push({
        id,
        key: id,
        type: "End",
        category: "End",
        label: "End",
        text: "End",
      });
      if (lastNode) json.links.push({ from: lastNode, to: id });
    }
  });

  console.log("Generated JSON:", JSON.stringify(json, null, 2));
  return json;
}
