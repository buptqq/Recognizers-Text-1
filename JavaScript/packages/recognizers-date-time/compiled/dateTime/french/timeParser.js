"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const recognizers_text_1 = require("recognizers-text");
const baseTime_1 = require("../baseTime");
const utilities_1 = require("../utilities");
const frenchDateTime_1 = require("../../resources/frenchDateTime");
class TimeParser extends baseTime_1.BaseTimeParser {
    constructor(config) {
        super(config);
    }
    InternalParse(text, referenceTime) {
        let ret = super.internalParse(text, referenceTime);
        if (!ret.success) {
            ret = this.parseIsh(text, referenceTime);
        }
        return ret;
    }
    parseIsh(text, referenceTime) {
        let ret = new utilities_1.DateTimeResolutionResult();
        let trimedText = text.trim().toLowerCase();
        let matches = recognizers_text_1.RegExpUtility.getMatches(recognizers_text_1.RegExpUtility.getSafeRegExp(frenchDateTime_1.FrenchDateTime.IshRegex), text);
        if (matches.length && matches[0].index === 0 && matches[0].length === trimedText.length) {
            let hourStr = matches[0].groups("hour").value;
            let hour = 12;
            if (hourStr) {
                hour = parseInt(hourStr, 10);
            }
            ret.timex = "T" + utilities_1.FormatUtil.toString(hour, 2);
            ret.futureValue =
                ret.pastValue =
                    utilities_1.DateUtils.safeCreateFromMinValue(referenceTime.getFullYear(), referenceTime.getMonth(), referenceTime.getDate(), hour, 0, 0);
            ret.success = true;
        }
        return ret;
    }
}
exports.TimeParser = TimeParser;
//# sourceMappingURL=timeParser.js.map