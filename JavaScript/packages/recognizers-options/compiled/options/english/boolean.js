"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const recognizers_text_1 = require("recognizers-text");
const englishOptions_1 = require("../../resources/englishOptions");
class EnglishBooleanExtractorConfiguration {
    constructor(onlyTopMatch = true) {
        this.regexTrue = recognizers_text_1.RegExpUtility.getSafeRegExp(englishOptions_1.EnglishOptions.TrueRegex);
        this.regexFalse = recognizers_text_1.RegExpUtility.getSafeRegExp(englishOptions_1.EnglishOptions.FalseRegex);
        this.tokenRegex = recognizers_text_1.RegExpUtility.getSafeRegExp(englishOptions_1.EnglishOptions.TokenizerRegex);
        this.onlyTopMatch = onlyTopMatch;
    }
}
exports.EnglishBooleanExtractorConfiguration = EnglishBooleanExtractorConfiguration;
//# sourceMappingURL=boolean.js.map