"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const recognizers_text_1 = require("recognizers-text");
const constants_1 = require("./constants");
class OptionsParser {
    constructor(config) {
        this.config = config;
    }
    parse(extResult) {
        let result = new recognizers_text_1.ParseResult(extResult);
        result.value = this.config.resolutions.get(result.type);
        if (result.data.otherMatches) {
            result.data.otherMatches = result.data.otherMatches.map(m => {
                let r = new recognizers_text_1.ParseResult(m);
                r.value = this.config.resolutions.get(r.type);
                return r;
            });
        }
        return result;
    }
}
exports.OptionsParser = OptionsParser;
class BooleanParser extends OptionsParser {
    constructor() {
        let resolutions = new Map([
            [constants_1.Constants.SYS_BOOLEAN_TRUE, true],
            [constants_1.Constants.SYS_BOOLEAN_FALSE, false]
        ]);
        let config = {
            resolutions: resolutions
        };
        super(config);
    }
}
exports.BooleanParser = BooleanParser;
//# sourceMappingURL=parsers.js.map