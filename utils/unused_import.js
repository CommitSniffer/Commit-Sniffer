export function checkImports(fileContent, filePath) {
    const importRegex = /^import\s+([\w\.]+);/gm;
    const allLines = fileContent.split("\n");
    const importLines = [];
    const importUsage = {};

    // Extract import statements
    allLines.forEach(line => {
        const match = line.match(importRegex);
        if (match) {
            // Get the imported path
            const matchGroups = importRegex.exec(line);

            if (matchGroups && matchGroups[1]) {
                const imported = matchGroups[1].trim();
                importLines.push(imported);
                importUsage[imported] = false;
            }
        }
    });

    // Check usage of imports in the rest of the file
    allLines.forEach(line => {
       importLines.forEach(imported => {
           if (
               !line.trim().startsWith("//")
               && !line.trim().startsWith("/*")
               && !line.includes("import")
               && line.includes(imported.split(".").pop())
           ) {
               importUsage[imported] = true;
           }
       });
    });

    const unusedImports = Object.keys(importUsage).filter(key => !importUsage[key]);
    return unusedImports.map(unused => {
       return `The import \`${unused}\` is never used in file \`${filePath}\` on \`line ${getLineOfImport(allLines, unused)}\``;
    });
}

function getLineOfImport(allLinesArray, unusedImport) {
    for (let i = 0; i < allLinesArray.length; i++) {
        if (allLinesArray[i].includes(`import ${unusedImport}`)) {
            return i + 1;
        }
    }

    return -1;
}
