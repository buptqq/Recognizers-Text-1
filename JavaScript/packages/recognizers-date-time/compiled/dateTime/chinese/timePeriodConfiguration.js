"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const recognizers_text_1 = require("recognizers-text");
const baseDateTime_1 = require("./baseDateTime");
const constants_1 = require("../constants");
const chineseDateTime_1 = require("../../resources/chineseDateTime");
const utilities_1 = require("../utilities");
const baseTimePeriod_1 = require("../baseTimePeriod");
const parsers_1 = require("../parsers");
const timeConfiguration_1 = require("./timeConfiguration");
var TimePeriodType;
(function (TimePeriodType) {
    TimePeriodType[TimePeriodType["ShortTime"] = 0] = "ShortTime";
    TimePeriodType[TimePeriodType["FullTime"] = 1] = "FullTime";
})(TimePeriodType = exports.TimePeriodType || (exports.TimePeriodType = {}));
class ChineseTimePeriodExtractor extends baseDateTime_1.BaseDateTimeExtractor {
    constructor() {
        super(new Map([
            [recognizers_text_1.RegExpUtility.getSafeRegExp(chineseDateTime_1.ChineseDateTime.TimePeriodRegexes1), TimePeriodType.FullTime],
            [recognizers_text_1.RegExpUtility.getSafeRegExp(chineseDateTime_1.ChineseDateTime.TimePeriodRegexes2), TimePeriodType.ShortTime]
        ]));
        this.extractorName = constants_1.Constants.SYS_DATETIME_TIMEPERIOD; // "time range";
    }
}
exports.ChineseTimePeriodExtractor = ChineseTimePeriodExtractor;
class ChineseTimePeriodParserConfiguration {
    constructor() {
        this.timeParser = new timeConfiguration_1.ChineseTimeParser();
    }
    getMatchedTimexRange(text) { return null; }
}
class ChineseTimePeriodParser extends baseTimePeriod_1.BaseTimePeriodParser {
    constructor() {
        let config = new ChineseTimePeriodParserConfiguration();
        super(config);
        this.dayDescriptionRegex = recognizers_text_1.RegExpUtility.getSafeRegExp(chineseDateTime_1.ChineseDateTime.TimeDayDescRegex);
        this.onlyDigitMatch = recognizers_text_1.RegExpUtility.getSafeRegExp('\\d+');
        this.numbersMap = chineseDateTime_1.ChineseDateTime.TimeNumberDictionary;
        this.lowBoundMap = chineseDateTime_1.ChineseDateTime.TimeLowBoundDesc;
    }
    parse(er, referenceTime) {
        if (!referenceTime)
            referenceTime = new Date();
        let extra = er.data;
        if (!extra) {
            return null;
        }
        let parseResult = this.parseTimePeriod(extra, referenceTime);
        if (parseResult.success) {
            parseResult.futureResolution = {};
            parseResult.futureResolution[constants_1.TimeTypeConstants.START_TIME] = utilities_1.FormatUtil.formatTime(parseResult.futureValue.item1);
            parseResult.futureResolution[constants_1.TimeTypeConstants.END_TIME] = utilities_1.FormatUtil.formatTime(parseResult.futureValue.item2);
            parseResult.pastResolution = {};
            parseResult.pastResolution[constants_1.TimeTypeConstants.START_TIME] = utilities_1.FormatUtil.formatTime(parseResult.pastValue.item1);
            parseResult.pastResolution[constants_1.TimeTypeConstants.END_TIME] = utilities_1.FormatUtil.formatTime(parseResult.pastValue.item2);
        }
        let result = new parsers_1.DateTimeParseResult(er);
        result.value = parseResult;
        result.resolutionStr = '';
        result.timexStr = parseResult.timex;
        return result;
    }
    parseTimePeriod(extra, referenceTime) {
        let result = new utilities_1.DateTimeResolutionResult();
        let leftEntity = extra.namedEntity('left');
        let leftResult = extra.dataType === TimePeriodType.FullTime
            ? this.getParseTimeResult(leftEntity, referenceTime)
            : this.getShortLeft(leftEntity.value);
        let rightEntity = extra.namedEntity('right');
        let rightResult = this.getParseTimeResult(rightEntity, referenceTime);
        // the right side doesn't contain desc while the left side does
        if (rightResult.lowBound === -1 && leftResult.lowBound !== -1 && rightResult.hour <= leftResult.lowBound) {
            rightResult.hour += 12;
        }
        let leftDate = this.buildDate(leftResult, referenceTime);
        let rightDate = this.buildDate(rightResult, referenceTime);
        if (rightDate.getHours() < leftDate.getHours()) {
            rightDate = utilities_1.DateUtils.addDays(rightDate, 1);
        }
        result.futureValue = result.pastValue = {
            item1: leftDate,
            item2: rightDate
        };
        let leftTimex = this.buildTimex(leftResult);
        let rightTimex = this.buildTimex(rightResult);
        let spanTimex = this.buildSpan(leftResult, rightResult);
        result.timex = `(${leftTimex},${rightTimex},${spanTimex})`;
        result.success = true;
        return result;
    }
    getParseTimeResult(entity, referenceTime) {
        let extractResult = {
            start: entity.index,
            length: entity.length,
            text: entity.value,
            type: constants_1.Constants.SYS_DATETIME_TIME
        };
        let result = this.config.timeParser.parse(extractResult, referenceTime);
        return result.data;
    }
    getShortLeft(source) {
        let description = '';
        if (recognizers_text_1.RegExpUtility.isMatch(this.dayDescriptionRegex, source)) {
            description = source.substr(0, source.length - 1);
        }
        let hour = baseDateTime_1.TimeResolutionUtils.matchToValue(this.onlyDigitMatch, this.numbersMap, source.substr(source.length - 1));
        let timeResult = new baseDateTime_1.TimeResult(hour, -1, -1);
        baseDateTime_1.TimeResolutionUtils.addDescription(this.lowBoundMap, timeResult, description);
        return timeResult;
    }
    buildDate(time, referenceTime) {
        let day = referenceTime.getDate();
        let month = referenceTime.getMonth();
        let year = referenceTime.getFullYear();
        let hour = time.hour > 0 ? time.hour : 0;
        let min = time.minute > 0 ? time.minute : 0;
        let sec = time.second > 0 ? time.second : 0;
        return utilities_1.DateUtils.safeCreateFromMinValue(year, month, day, hour, min, sec);
    }
    buildTimex(timeResult) {
        let timex = 'T';
        if (timeResult.hour >= 0) {
            timex = timex + utilities_1.FormatUtil.toString(timeResult.hour, 2);
            if (timeResult.minute >= 0) {
                timex = timex + ':' + utilities_1.FormatUtil.toString(timeResult.minute, 2);
                if (timeResult.second >= 0) {
                    timex = timex + ':' + utilities_1.FormatUtil.toString(timeResult.second, 2);
                }
            }
        }
        return timex;
    }
    buildSpan(left, right) {
        left = this.sanitizeTimeResult(left);
        right = this.sanitizeTimeResult(right);
        let spanHour = right.hour - left.hour;
        let spanMin = right.minute - left.minute;
        let spanSec = right.second - left.second;
        if (spanSec < 0) {
            spanSec += 60;
            spanMin -= 1;
        }
        if (spanMin < 0) {
            spanMin += 60;
            spanHour -= 1;
        }
        if (spanHour < 0) {
            spanHour += 24;
        }
        let spanTimex = `PT${spanHour}H`;
        if (spanMin !== 0 && spanSec === 0) {
            spanTimex = spanTimex + `${spanMin}M`;
        }
        else if (spanSec !== 0) {
            spanTimex = spanTimex + `${spanMin}M${spanSec}S`;
        }
        return spanTimex;
    }
    sanitizeTimeResult(timeResult) {
        return new baseDateTime_1.TimeResult(timeResult.hour, timeResult.minute === -1 ? 0 : timeResult.minute, timeResult.second === -1 ? 0 : timeResult.second);
    }
}
exports.ChineseTimePeriodParser = ChineseTimePeriodParser;
//# sourceMappingURL=timePeriodConfiguration.js.map