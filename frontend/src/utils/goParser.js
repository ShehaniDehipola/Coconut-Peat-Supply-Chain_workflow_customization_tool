// // goParser.js

// // Function to parse and convert general instructions to Go code
// export const parseInstructionsToGo = (instructions) => {
//   const lines = instructions.split('\n');
//   let goCode = '';

//   lines.forEach((line) => {
//     const trimmedLine = line.trim().toLowerCase();

//     // Handle common actions like wash, process, cut, etc.
//     if (isActionCommand(trimmedLine)) {
//       goCode += parseActionCommand(trimmedLine);

//     // Handle conditions (e.g., If EC level <= 200)
//     } else if (trimmedLine.startsWith('if')) {
//       goCode += parseCondition(trimmedLine);

//     // Handle "else" blocks
//     } else if (trimmedLine.startsWith('else')) {
//       goCode += `} else {\n`;

//     // Handle loops (e.g., loop 5 times)
//     } else if (trimmedLine.startsWith('loop')) {
//       goCode += parseLoop(trimmedLine);

//     // Handle time delays (e.g., wait for 24 hours)
//     } else if (trimmedLine.startsWith('wait')) {
//       goCode += parseWaitCommand(trimmedLine);

//     // Handle end of blocks (e.g., endif)
//     } else if (trimmedLine.startsWith('endif')) {
//       goCode += '}\n';

//     // Unsupported commands
//     } else {
//       goCode += `// Unsupported command: ${trimmedLine}\n`;
//     }
//   });

//   return goCode;
// };

// // Helper to check if the line is an action command
// const isActionCommand = (line) => {
//   return line.startsWith('wash') || line.startsWith('cut') || line.startsWith('process') || line.startsWith('start');
// };

// // Helper to parse action commands like "wash the tank with coco peat"
// const parseActionCommand = (line) => {
//   if (line.startsWith('wash')) {
//     return `washTank();\n`;
//   } else if (line.startsWith('cut')) {
//     const object = line.match(/cut (\w+)/)[1];
//     return `cut(${object});\n`;
//   } else if (line.startsWith('process')) {
//     const object = line.match(/process (\w+)/)[1];
//     return `process(${object});\n`;
//   } else if (line.startsWith('start')) {
//     const process = line.match(/start (\w+)/)[1];
//     return `start${capitalize(process)}Process();\n`;
//   } else if (line.startsWith('wash again')) {
//     return `washTank();\n`;
//   }
//   return '';
// };

// // Helper to parse conditionals like "If EC level <= 200" or "If sensor temperature >= 30"
// const parseCondition = (line) => {
//   let condition = '';

//   if (line.includes('ec level')) {
//     const comparator = line.includes('<=') ? '<=' : '>';
//     const value = line.match(/\d+/);
//     condition = `if ecLevel ${comparator} ${value} {\n`;
//   } else if (line.includes('sensor')) {
//     const sensorType = line.match(/sensor (\w+)/)[1];
//     const comparator = line.includes('>=') ? '>=' : '<';
//     const value = line.match(/\d+/);
//     condition = `if readSensor("${sensorType}") ${comparator} ${value} {\n`;
//   }

//   return condition;
// };

// // Helper to parse loops like "loop 5 times"
// const parseLoop = (line) => {
//   const times = line.match(/\d+/);
//   return `for i := 0; i < ${times}; i++ {\n`;
// };

// // Helper to parse wait commands like "wait for 24 hours"
// const parseWaitCommand = (line) => {
//   const hours = line.match(/\d+/);
//   return `time.Sleep(${hours} * time.Hour);\n`;
// };

// // Helper to capitalize first letter
// const capitalize = (word) => word.charAt(0).toUpperCase() + word.slice(1);

// utils/goParser.js

/**
 * Parses DSL instructions and converts them to Go code.
 * @param {string} instructions - The DSL instructions.
 * @returns {string} - The generated Go code.
 */
export function parseInstructionsToGo(instructions) {
  const lines = instructions.split('\n');
  let goCode = 'package main\n\nimport "fmt"\n\nfunc main() {\n';

  let currentPlugin = '';

  lines.forEach((line) => {
    line = line.trim();

    // Detect the start of a plugin
    if (line.startsWith('plugin ')) {
      currentPlugin = line.split(' ')[1].replace('{', '').trim();
      goCode += `\n\t// Plugin: ${currentPlugin}\n`;
      goCode += `\tfmt.Println("Starting plugin: ${currentPlugin}")\n`;
    }
    // Handle different node types
    else if (line.startsWith('action')) {
      const actionLabel = line.replace('action', '').trim();
      goCode += `\tfmt.Println("Action: ${actionLabel}")\n`;
    }
    else if (line.startsWith('wait')) {
      const waitDuration = line.replace('wait', '').trim();
      goCode += `\tfmt.Println("Wait for: ${waitDuration}")\n`;
    }
    else if (line.startsWith('check')) {
      const checkCondition = line.replace('check', '').trim();
      goCode += `\tfmt.Println("Check condition: ${checkCondition}")\n`;
    }
    // End of plugin block
    else if (line.startsWith('}')) {
      goCode += `\tfmt.Println("Ending plugin: ${currentPlugin}")\n`;
      currentPlugin = '';
    }
  });

  goCode += '\n}\n';
  return goCode;
}

