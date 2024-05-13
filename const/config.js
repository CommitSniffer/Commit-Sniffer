import { sendContentRequest } from "../request/request.js";

export var CONFIG;
var prevJsonData = "";

class Config {
    static REQUIRED_KEYS = [
        "METHOD_LENGTHS",
        "UNUSED_IMPORTS",
        "UNUSED_VARIABLES",
        "INCORRECT_NAMING_CONVENTIONS",
        "WILDCARD_IMPORTS",
        "CLASS_LENGTHS",
        "UNNECESSARY_NESTING",
        "SQL_INJECTION",
        "COMMENT_SMELLS",
        "CODE_SHORTENING",
        "MAX_FCN_LENGTH",
        "MAX_CLASS_LENGTH",
        "MIN_REJECT_THRESHOLD",
        "GEMINI_MODEL",
    ];

    validateConfig(config) {
        let notExistingKeys = [];
        for (const key of Config.REQUIRED_KEYS)
            if (!config.hasOwnProperty(key)) notExistingKeys.push(key);
        if (notExistingKeys.length > 0)
            throw new Error(`Missing configuration for "${notExistingKeys}"`);
        return true;
    }

    constructor(configJson) {
        const config = JSON.parse(configJson);
        this.validateConfig(config);
        for (const key in config)
            Object.defineProperty(this, key, {
                value: config[key],
                writable: false,
                enumerable: true,
                configurable: false,
            });
    }
}

export async function setConfig(context) {
    try {
        let owner = context.payload.repository.owner.login;
        let repo = context.payload.repository.name;
        let url = `/repos/${owner}/${repo}/contents/commitsniffer.config`;
        let rawData = await sendContentRequest(url);
        let jsonData = Buffer.from(rawData.content, "base64").toString();
        if (jsonData === "") throw new Error(`Configuration file is empty"`);
        if (jsonData !== prevJsonData) {
            CONFIG = new Config(jsonData);
            prevJsonData = jsonData;
        }
    } catch (error) {
        throw new Error("Could not read config file: " + error);
    }
}
