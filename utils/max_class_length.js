import { CONFIG } from "../const/config.js";
import { removeImportsAndCommentsAndEmptyLines } from "./common/remove_spaces_and_comments.js";

export function checkClassLengths(fileContent, filePath) {
    const classLength =
        removeImportsAndCommentsAndEmptyLines(fileContent).split("\n").length;
    let msg = [];

    if (classLength > CONFIG.MAX_CLASS_LENGTH) {
        msg = [
            `File \`${filePath}\` exceeds max file length constraint \`${CONFIG.MAX_CLASS_LENGTH}\` since its length is \`${classLength}\``,
        ];
    }

    return msg;
}
