export function getIncorrectNamingConventions(text = javaCode) {
  // Regular expressions for naming conventions
  const classRegex = /^[A-Z][a-zA-Z0-9]*$/;
  const variableRegex = /^[a-z][a-zA-Z0-9]*$/;
  const constantRegex = /^[A-Z][A-Z0-9_]*$/;

  let incorrectLines = [];

  const codeLines = text.split(/\r?\n/);
  codeLines.forEach((codeLine, index) => {
      // Check for class declarations
      const classMatch = codeLine.match(/class\s+(\w+)/);
      if (classMatch && !classRegex.test(classMatch[1])) {
          console.log(`Class naming violation at line ${index + 1}: ${classMatch[1]}`);
          incorrectLines.push(index + 1);
      }

      // Check for variable declarations (simplified)
      const varMatch = codeLine.match(/\b(?:int|double|String|boolean)\s+(\w+)/);
      if (varMatch && !variableRegex.test(varMatch[1]) && !constantRegex.test(varMatch[1])) {
          console.log(`Variable naming violation at line ${index + 1}: ${varMatch[1]}`);
          incorrectLines.push(index + 1);
      }
  });

  return incorrectLines;
}