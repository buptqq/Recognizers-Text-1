"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const baseTime_1 = require("../baseTime");
const timeConfiguration_1 = require("./timeConfiguration");
const utilities_1 = require("../utilities");
const recognizers_text_1 = require("recognizers-text");
class EnglishTimeParser extends baseTime_1.BaseTimeParser {
    constructor(configuration) {
        super(configuration);
    }
    internalParse(text, referenceTime) {
        let innerResult = super.internalParse(text, referenceTime);
        if (!innerResult.success) {
            innerResult = this.parseIsh(text, referenceTime);
        }
        return innerResult;
    }
    // parse "noonish", "11-ish"
    parseIsh(text, referenceTime) {
        let ret = new utilities_1.DateTimeResolutionResult();
        let trimmedText = text.toLowerCase().trim();
        let matches = recognizers_text_1.RegExpUtility.getMatches(timeConfiguration_1.EnglishTimeExtractorConfiguration.ishRegex, trimmedText);
        if (matches.length > 0 && matches[0].length === trimmedText.length) {
            let hourStr = matches[0].groups("hour").value;
            let hour = 12;
            if (hourStr) {
                hour = Number.parseInt(hourStr, 10);
            }
            ret.timex = "T" + utilities_1.FormatUtil.toString(hour, 2);
            ret.futureValue =
                ret.pastValue =
                    new Date(referenceTime.getFullYear(), referenceTime.getMonth(), referenceTime.getDate(), hour, 0, 0);
            ret.success = true;
            return ret;
        }
        return ret;
    }
}
exports.EnglishTimeParser = EnglishTimeParser;
//# sourceMappingURL=parsers.js.map