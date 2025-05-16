export function generateJSON(instructions) {
  const lines = instructions.split('\n');
  const steps = [];
  let lastNodeId = null;
  let nodeId = 1;
  let actionNodes = {};

  lines.forEach((line) => {
    if (line.startsWith('Start the process')) {
      const node = {
        id: nodeId,
        key: nodeId,
        type: 'Start',
        category: 'Start',
        label: 'Start',
        text: 'Start',
      };
      steps.push({ node, link: null });
      lastNodeId = nodeId;
      nodeId++;
    } else if (line.startsWith('Step')) {
      const label = line.match(/Step: (.+)/)[1];
      const node = {
        id: nodeId,
        key: nodeId,
        type: 'Action',
        category: 'Process',
        label,
        text: label,
      };
      const link = lastNodeId ? { from: lastNodeId, to: nodeId } : null;
      steps.push({ node, link });
      lastNodeId = nodeId;
      actionNodes[label] = nodeId;
      nodeId++;
    } else if (line.startsWith('Decision')) {
      let condition = line.match(/Decision: Is (.+)\?/)[1];
      condition = condition
        .replace(/greater than or equal to/g, '>=')
        .replace(/less than or equal to/g, '<=')
        .replace(/greater than/g, '>')
        .replace(/less than/g, '<')
        .replace(/equal to/g, '==')
        .replace(/not equal to/g, '!=');
      const node = {
        id: nodeId,
        key: nodeId,
        type: 'Decision',
        category: 'Decision',
        label: condition,
        text: condition,
      };
      const link = lastNodeId ? { from: lastNodeId, to: nodeId } : null;
      steps.push({ node, link });
      lastNodeId = nodeId;
      nodeId++;
    } else if (line.trim().startsWith('Yes ->')) {
      const label = line.match(/Yes -> (.+)/)[1];
      const isEnd = label === 'End the process';
      const node = {
        id: nodeId,
        key: nodeId,
        type: isEnd ? 'End' : 'Action',
        category: isEnd ? 'End' : 'Process',
        label: isEnd ? 'End' : label,
        text: isEnd ? 'End' : label,
      };
      steps.push({ node, link: { from: lastNodeId, to: nodeId, condition: 'Yes' } });
      if (!isEnd) lastNodeId = nodeId;
      nodeId++;
    } else if (line.trim().startsWith('No ->')) {
      const label = line.match(/No -> (.+)/)[1];
  let idToUse = nodeId;
  let node = null;

  if (label.startsWith('Repeat the')) {
    const actionLabel = label.replace('Repeat the ', '').trim();
    idToUse = actionNodes[actionLabel];

    if (!idToUse) {
      // Edge case: repeated node not found — define it just in case
      node = {
        id: nodeId,
        key: nodeId,
        type: 'Action',
        category: 'Process',
        label: actionLabel,
        text: actionLabel,
      };
      actionNodes[actionLabel] = nodeId;
      steps.push({ node, link: { from: lastNodeId, to: nodeId, condition: 'No' } });
      lastNodeId = nodeId;
      nodeId++;
    } else {
      // Repeat to an existing node — just push the link
      steps.push({ node: null, link: { from: lastNodeId, to: idToUse, condition: 'No' } });
    }

  } else {
    node = {
      id: nodeId,
      key: nodeId,
      type: label === 'End the process' ? 'End' : 'Action',
      category: label === 'End the process' ? 'End' : 'Process',
      label: label === 'End the process' ? 'End' : label,
      text: label === 'End the process' ? 'End' : label,
    };
    actionNodes[label] = nodeId;
    steps.push({ node, link: { from: lastNodeId, to: nodeId, condition: 'No' } });
    if (label !== 'End the process') lastNodeId = nodeId;
    nodeId++;
  }
    } else if (line.startsWith('End the process')) {
      const node = {
        id: nodeId,
        key: nodeId,
        type: 'End',
        category: 'End',
        label: 'End',
        text: 'End',
      };
      steps.push({ node, link: { from: lastNodeId, to: nodeId } });
      nodeId++;
    }
  });

  return steps;
}
