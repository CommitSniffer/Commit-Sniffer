export function checkUnusedVariables(fileContent, filePath) {
  // Define a regex to find variable declarations in Java
  const classRegex = /\b([A-Z]\w*)\s+(\w+)\s*=\s*(new\s+\1|[\w.]+);/g;
  const varRegex = /(\bint\b|\bdouble\b|\bString\b|\bboolean\b)\s+(\w+)/g;

  // Extract all variable declarations
  let match;
  const variables = new Map();
  const classes = new Map();
  while (match = varRegex.exec(fileContent)) {
    variables.set(match[2], false); // map variable name to 'used' status (initially false)
  }
  while (match = classRegex.exec(fileContent)) {
    classes.set(match[2], false); // map variable name to 'used' status (initially false)
  }

  // Check usage of each variable
  variables.forEach((_, varName) => {
    // Define a regex to find usages of the variable name
    const usageRegex = new RegExp(`\\b${varName}\\b`, 'g');
    if (fileContent.match(usageRegex).length > 1) {
      variables.set(varName, true); // set 'used' status to true if found more than once
    }
  });
  classes.forEach((_, className) => {
    // Define a regex to find usages of the variable name
    const usageRegex = new RegExp(`\\b${className}\\b`, 'g');
    if (fileContent.match(usageRegex).length > 1) {
      classes.set(className, true); // set 'used' status to true if found more than once
    }
  });

  // Collect unused variables
  const unusedVariables = [];
  variables.forEach((used, varName) => {
    if (!used) {
      unusedVariables.push(varName);
    }
  });
  const unusedClasses = [];
  classes.forEach((used, className) => {
    if (!used) {
      unusedClasses.push(className);
    }
  });

  let unusedVarLines = [];

  // Return a message with unused variables or stating that all are used
  if (unusedVariables.length > 0 || unusedClasses.length > 0) {
    unusedVarLines.push(`Unused variables in \`${filePath}\`:`);
    if (unusedVariables.length > 0) {
      unusedVariables.forEach(unusedVariable => {
        let errorTextLine = `\- \`${unusedVariable}\` at \`line ${fileContent.split('\n').findIndex(line => line.includes(unusedVariable)) + 1}\``;
        unusedVarLines.push(errorTextLine);
      });
    }
    if (unusedClasses.length > 0) {
      unusedClasses.forEach(unusedClass => {
        let errorTextLine = `\- \`${unusedClass}\` at \`line ${fileContent.split('\n').findIndex(line => line.includes(unusedClass)) + 1}\``;
        unusedVarLines.push(errorTextLine);
      });
    }
  }
  else {
    return [];
  }

  return unusedVarLines;
}
