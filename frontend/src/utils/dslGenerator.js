export function generateDSL(json, logCallback, setInstructions) {
  return new Promise((resolve, reject) => {
    const { nodes, links } = json;
    let instructions = '';
    console.log('INSSSSSS', setInstructions);

    // Log start of validation
    logCallback('🔄 Processing: Validating JSON structure...');

    setTimeout(() => {
      // Validation Step 1: Check that 'nodes' and 'links' are valid arrays
      if (!Array.isArray(nodes)) {
        throw new Error("Invalid input: 'nodes' must be an array.");
      }
      if (!Array.isArray(links)) {
        throw new Error("Invalid input: 'links' must be an array.");
      }
      logCallback('✅ Validation Passed: JSON structure is valid.');

      setTimeout(() => {
        // Validation Step 2: Validate nodes
        logCallback('🔄 Processing: Validating nodes...');
        const nodeKeys = new Set();
        nodes.forEach((node) => {
          if (!node.key) throw new Error(`Node with missing 'key' found.`);
          if (nodeKeys.has(node.key))
            throw new Error(`Duplicate node key found: ${node.key}`);
          nodeKeys.add(node.key);

          // Check for valid category and text
          if (
            !node.category ||
            !['Start', 'Process', 'Decision', 'End'].includes(node.category)
          ) {
            throw new Error(`Invalid node category found: ${node.category}`);
          }
          if (!node.text)
            throw new Error(
              `Node with key ${node.key} is missing 'text' description.`
            );
        });
        logCallback('✅ Validation Passed: Nodes are correctly structured.');

        setTimeout(() => {
          // Validation Step 3: Validate links
          logCallback('🔄 Processing: Validating links...');
          links.forEach((link) => {
            if (!link.from || !link.to) {
              throw new Error(
                `Link is missing 'from' or 'to' properties: ${JSON.stringify(
                  link
                )}`
              );
            }
            const fromNode = nodes.find((node) => node.key === link.from);
            const toNode = nodes.find((node) => node.key === link.to);

            if (!fromNode)
              throw new Error(
                `Link references non-existing node 'from': ${link.from}`
              );
            if (!toNode)
              throw new Error(
                `Link references non-existing node 'to': ${link.to}`
              );
          });
          logCallback('✅ Validation Passed: Links are correctly structured.');

          setTimeout(() => {
            // Validation Step 4: Ensure exactly one 'Start' node
            logCallback('🔄 Processing: Checking start node...');
            const startNode = nodes.find((node) => node.category === 'Start');
            if (!startNode) {
              throw new Error("Missing 'Start' node.");
            }
            logCallback('✅ Validation Passed: Start node exists.');

            if (
              links.filter((link) => link.from === startNode.key).length === 0
            ) {
              throw new Error('Start node must have outgoing links.');
            }
            instructions += 'Start the process\n';

            setTimeout(() => {
              // Validation Step 5: Ensure exactly one 'End' node
              logCallback('🔄 Processing: Checking end node...');
              const endNodes = nodes.filter((node) => node.category === 'End');
              if (endNodes.length !== 1) {
                throw new Error("There should be exactly one 'End' node.");
              }
              logCallback('✅ Validation Passed: End node exists.');
              if (links.some((link) => link.from === endNodes[0].key)) {
                throw new Error("'End' node should not have outgoing links.");
              }

              setTimeout(() => {
                // Validation Step 6: Ensure each Decision node has at least 2 outgoing links
                logCallback('🔄 Processing: Checking decision nodes...');
                nodes
                  .filter((node) => node.category === 'Decision')
                  .forEach((decisionNode) => {
                    const outgoingLinks = links.filter(
                      (link) => link.from === decisionNode.key
                    );
                    if (outgoingLinks.length < 2) {
                      throw new Error(
                        `Decision node with key ${decisionNode.key} must have at least two outgoing links.`
                      );
                    }
                    logCallback(
                      '✅ Validation Passed: Decision nodes have correct outgoing links.'
                    );

                    // Validate condition format
                    if (!/^.*(==|!=|>=|<=).*$/.test(decisionNode.text)) {
                      throw new Error(
                        `Invalid condition format in decision node: ${decisionNode.key}`
                      );
                    }
                  });

                setTimeout(() => {
                  // Validation Step 7: Check for orphaned nodes
                  logCallback('🔄 Processing: Checking for orphaned nodes...');
                  const allNodeKeys = new Set(nodes.map((node) => node.key));
                  const allLinkedKeys = new Set(
                    links.flatMap((link) => [link.from, link.to])
                  );
                  const orphanedNodes = [...allNodeKeys].filter(
                    (key) => !allLinkedKeys.has(key)
                  );
                  if (orphanedNodes.length > 0) {
                    throw new Error(
                      `Orphaned nodes found: ${orphanedNodes.join(', ')}`
                    );
                  }
                  logCallback('✅ Validation Passed: No orphaned nodes found.');

                  setTimeout(() => {
                    logCallback('🔄 Processing: Generating workflow...');
                    // Create a map of nodes for faster lookup
                    const nodeMap = nodes.reduce((map, node) => {
                      map[node.key] = node;
                      return map;
                    }, {});

                    // Utility to find outgoing links from a node
                    const getOutgoingLinks = (nodeKey) =>
                      links.filter((link) => link.from === nodeKey);

                    // Helper function for handling decision nodes
                    const handleDecisionNode = (nodeKey) => {
                      const outgoingLinks = getOutgoingLinks(nodeKey);
                      let conditionText = nodeMap[nodeKey].text;

                      // Replace condition symbols with user-friendly text
                      const conditionMap = {
                        '==': 'equal to',
                        '!=': 'not equal to',
                        '>=': 'greater than or equal to',
                        '<=': 'less than or equal to',
                      };

                      conditionText = conditionText.replace(
                        />=|<=|==|!=/g,
                        (match) => conditionMap[match]
                      );

                      instructions += `Decision: Is ${conditionText}?\n`;

                      logCallback(
                        `🔄 Processing: Decision node '${nodeKey}' condition: ${conditionText}`
                      );

                      outgoingLinks.forEach((link, index) => {
                        const targetNode = nodeMap[link.to];
                        if (targetNode) {
                          const action =
                            targetNode.category === 'End'
                              ? 'End the process'
                              : index === 0
                              ? `Step: ${targetNode.text}`
                              : `Repeat the ${targetNode.text}`;
                          instructions += `  ${
                            index === 0 ? 'Yes' : 'No'
                          } -> ${action}\n`;
                        }
                      });
                    };

                    // Traverse the workflow starting from the Start node
                    logCallback('🔄 Processing: Traversing workflow...');
                    function traverse(nodeKey, visited = new Set()) {
                      if (visited.has(nodeKey)) return; // Prevent infinite loops
                      visited.add(nodeKey);

                      const currentNode = nodeMap[nodeKey];
                      if (!currentNode) return;

                      // Handle node types
                      if (currentNode.category === 'Process') {
                        instructions += `Step: ${currentNode.text}\n`;
                        logCallback(`🔄 Processing Step: ${currentNode.text}`);
                      } else if (currentNode.category === 'Decision') {
                        handleDecisionNode(nodeKey);
                        return; // Skip further traversal for decision nodes
                      } else if (currentNode.category === 'End') {
                        instructions += 'End the process\n';
                        logCallback('🔄 Processing: End node reached.');
                        return;
                      }

                      // Continue traversal for other node types
                      getOutgoingLinks(nodeKey).forEach((link) =>
                        traverse(link.to, visited)
                      );
                    }

                    // Start traversal from the Start node
                    traverse(startNode.key);
                    logCallback('✅ Validation Completed: All checks passed.');

                    setTimeout(() => {
                      logCallback('---Workflow generated Successfully---');

                      setInstructions(instructions);
                      resolve(instructions);
                    }, 800); // Final workflow completion delay
                  }, 600); // Delay for orphaned node check
                }, 500); // Delay for decision node validation
              }, 400); // Delay for end node validation
            }, 300); // Delay for start node validation
          }, 300); // Delay for link validation
        }, 300); // Delay for node validation
      }, 200); // Delay for JSON structure validation
    }, 200); // Initial processing delay
  });
}
