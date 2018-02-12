"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const recognizers_text_1 = require("recognizers-text");
const baseDateTimePeriod_1 = require("../baseDateTimePeriod");
const utilities_1 = require("../utilities");
const spanishDateTime_1 = require("../../resources/spanishDateTime");
class SpanishDateTimePeriodParser extends baseDateTimePeriod_1.BaseDateTimePeriodParser {
    constructor(config) {
        super(config);
    }
    parseSpecificTimeOfDay(source, referenceDate) {
        let ret = new utilities_1.DateTimeResolutionResult();
        let trimedText = source.trim().toLowerCase();
        // handle morning, afternoon..
        let match = this.config.getMatchedTimeRange(trimedText);
        let beginHour = match.beginHour;
        let endHour = match.endHour;
        let endMin = match.endMin;
        let timeStr = match.timeStr;
        if (!match.success) {
            return ret;
        }
        let matches = recognizers_text_1.RegExpUtility.getMatches(this.config.specificTimeOfDayRegex, trimedText);
        if (matches.length && matches[0].index === 0 && matches[0].length === trimedText.length) {
            let swift = this.config.getSwiftPrefix(trimedText);
            let date = utilities_1.DateUtils.addDays(referenceDate, swift);
            date.setHours(0, 0, 0, 0);
            let day = date.getDate();
            let month = date.getMonth();
            let year = date.getFullYear();
            ;
            ret.timex = utilities_1.FormatUtil.formatDate(date) + timeStr;
            ret.pastValue = ret.futureValue = [
                utilities_1.DateUtils.safeCreateFromValue(utilities_1.DateUtils.minValue(), year, month, day, beginHour, 0, 0),
                utilities_1.DateUtils.safeCreateFromValue(utilities_1.DateUtils.minValue(), year, month, day, endHour, endMin, endMin),
            ];
            ret.success = true;
            return ret;
        }
        let startIndex = trimedText.indexOf(spanishDateTime_1.SpanishDateTime.Tomorrow) === 0 ? spanishDateTime_1.SpanishDateTime.Tomorrow.length : 0;
        // handle Date followed by morning, afternoon
        // Add handling code to handle morning, afternoon followed by Date
        // Add handling code to handle early/late morning, afternoon
        // TODO: use regex from config: match = this.config.TimeOfDayRegex.Match(trimedText.Substring(startIndex));
        matches = recognizers_text_1.RegExpUtility.getMatches(recognizers_text_1.RegExpUtility.getSafeRegExp(spanishDateTime_1.SpanishDateTime.TimeOfDayRegex), trimedText.substring(startIndex));
        if (matches.length) {
            let match = matches[0];
            let beforeStr = trimedText.substring(0, match.index + startIndex).trim();
            let ers = this.config.dateExtractor.extract(beforeStr, referenceDate);
            if (ers.length === 0) {
                return ret;
            }
            let pr = this.config.dateParser.parse(ers[0], referenceDate);
            let futureDate = pr.value.futureValue;
            let pastDate = pr.value.pastValue;
            ret.timex = pr.timexStr + timeStr;
            ret.futureValue = [
                utilities_1.DateUtils.safeCreateFromValue(utilities_1.DateUtils.minValue(), futureDate.getFullYear(), futureDate.getMonth(), futureDate.getDate(), beginHour, 0, 0),
                utilities_1.DateUtils.safeCreateFromValue(utilities_1.DateUtils.minValue(), futureDate.getFullYear(), futureDate.getMonth(), futureDate.getDate(), endHour, endMin, endMin)
            ];
            ret.pastValue = [
                utilities_1.DateUtils.safeCreateFromValue(utilities_1.DateUtils.minValue(), pastDate.getFullYear(), pastDate.getMonth(), pastDate.getDate(), beginHour, 0, 0),
                utilities_1.DateUtils.safeCreateFromValue(utilities_1.DateUtils.minValue(), pastDate.getFullYear(), pastDate.getMonth(), pastDate.getDate(), endHour, endMin, endMin)
            ];
            ret.success = true;
            return ret;
        }
        return ret;
    }
}
exports.SpanishDateTimePeriodParser = SpanishDateTimePeriodParser;
//# sourceMappingURL=dateTimePeriodParser.js.map