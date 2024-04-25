export function checkWildcardImports(fileContent, filePath) {
    const wildcardImportRegex = /^import\s+[\w\.]+\*;/gm;
    const allLines = fileContent.split("\n");
    const wildcardImports = [];

    // Extract wildcard import statements
    allLines.forEach(line => {
        if (wildcardImportRegex.test(line)) {
            wildcardImports.push(`Wildcard import found in file \`${filePath}\` on \`line ${allLines.indexOf(line) + 1}\`: \`${line.trim()}\``);
        }
    });

    return wildcardImports;
}
