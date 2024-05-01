export function removeCommentsAndEmptyLines(fileContent) {
    // Remove single-line comments
    fileContent = fileContent.replace(/\/\/.*$/gm, "");

    // Remove multi-line comments
    fileContent = fileContent.replace(/\/\*[\s\S]*?\*\//g, "");

    // Remove Javadoc comments
    fileContent = fileContent.replace(/\/\*\*[\s\S]*?\*\//g, "");

    // Remove empty lines
    fileContent = fileContent.replace(/^\s*[\r\n]/gm, "");

    return fileContent;
}

export function removeImportsAndCommentsAndEmptyLines(fileContent) {
    // Remove import lines
    fileContent = fileContent.replace(/^import .*;[\r\n]/gm, "");
    // Remove single-line comments
    return removeCommentsAndEmptyLines(fileContent);
}
