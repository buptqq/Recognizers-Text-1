"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const recognizers_text_1 = require("recognizers-text");
const baseDateTime_1 = require("./baseDateTime");
const baseTime_1 = require("../baseTime");
const constants_1 = require("../constants");
const parsers_1 = require("../parsers");
const utilities_1 = require("../utilities");
const chineseDateTime_1 = require("../../resources/chineseDateTime");
var TimeType;
(function (TimeType) {
    TimeType[TimeType["ChineseTime"] = 0] = "ChineseTime";
    TimeType[TimeType["LessTime"] = 1] = "LessTime";
    TimeType[TimeType["DigitTime"] = 2] = "DigitTime";
})(TimeType = exports.TimeType || (exports.TimeType = {}));
class ChineseTimeExtractor extends baseDateTime_1.BaseDateTimeExtractor {
    constructor() {
        super(new Map([
            [recognizers_text_1.RegExpUtility.getSafeRegExp(chineseDateTime_1.ChineseDateTime.TimeRegexes1), TimeType.ChineseTime],
            [recognizers_text_1.RegExpUtility.getSafeRegExp(chineseDateTime_1.ChineseDateTime.TimeRegexes2), TimeType.DigitTime],
            [recognizers_text_1.RegExpUtility.getSafeRegExp(chineseDateTime_1.ChineseDateTime.TimeRegexes3), TimeType.LessTime]
        ]));
        this.extractorName = constants_1.Constants.SYS_DATETIME_TIME; // "Time";
    }
}
exports.ChineseTimeExtractor = ChineseTimeExtractor;
class ChineseTimeParser extends baseTime_1.BaseTimeParser {
    constructor() {
        super(null);
        this.functionMap = new Map([
            [TimeType.DigitTime, x => this.handleDigit(x)],
            [TimeType.ChineseTime, x => this.handleChinese(x)],
            [TimeType.LessTime, x => this.handleLess(x)]
        ]);
        this.onlyDigitMatch = recognizers_text_1.RegExpUtility.getSafeRegExp('\\d+');
        this.numbersMap = chineseDateTime_1.ChineseDateTime.TimeNumberDictionary;
        this.lowBoundMap = chineseDateTime_1.ChineseDateTime.TimeLowBoundDesc;
        this.innerExtractor = new ChineseTimeExtractor();
    }
    parse(er, referenceTime) {
        if (!referenceTime)
            referenceTime = new Date();
        let extra = er.data;
        if (!extra) {
            let innerResult = this.innerExtractor.extract(er.text, referenceTime).pop();
            extra = innerResult.data;
        }
        let timeResult = this.functionMap.get(extra.dataType)(extra);
        let parseResult = this.packTimeResult(extra, timeResult, referenceTime);
        if (parseResult.success) {
            parseResult.futureResolution = {};
            parseResult.futureResolution[constants_1.TimeTypeConstants.TIME] = utilities_1.FormatUtil.formatTime(parseResult.futureValue);
            parseResult.pastResolution = {};
            parseResult.pastResolution[constants_1.TimeTypeConstants.TIME] = utilities_1.FormatUtil.formatTime(parseResult.pastValue);
        }
        let result = new parsers_1.DateTimeParseResult(er);
        result.value = parseResult;
        result.data = timeResult;
        result.resolutionStr = '';
        result.timexStr = parseResult.timex;
        return result;
    }
    handleLess(extra) {
        let hour = this.matchToValue(extra.namedEntity('hour').value);
        let quarter = this.matchToValue(extra.namedEntity('quarter').value);
        let minute = !recognizers_text_1.StringUtility.isNullOrEmpty(extra.namedEntity('half').value)
            ? 30
            : quarter !== -1 ? quarter * 15 : 0;
        let second = this.matchToValue(extra.namedEntity('sec').value);
        let less = this.matchToValue(extra.namedEntity('min').value);
        let all = hour * 60 + minute - less;
        if (all < 0) {
            all += 1440;
        }
        return new baseDateTime_1.TimeResult(all / 60, all % 60, second);
    }
    handleChinese(extra) {
        let hour = this.matchToValue(extra.namedEntity('hour').value);
        let quarter = this.matchToValue(extra.namedEntity('quarter').value);
        let minute = !recognizers_text_1.StringUtility.isNullOrEmpty(extra.namedEntity('half').value)
            ? 30
            : quarter !== -1 ? quarter * 15
                : this.matchToValue(extra.namedEntity('min').value);
        let second = this.matchToValue(extra.namedEntity('sec').value);
        return new baseDateTime_1.TimeResult(hour, minute, second);
    }
    handleDigit(extra) {
        return new baseDateTime_1.TimeResult(this.matchToValue(extra.namedEntity('hour').value), this.matchToValue(extra.namedEntity('min').value), this.matchToValue(extra.namedEntity('sec').value));
    }
    packTimeResult(extra, timeResult, referenceTime) {
        let result = new utilities_1.DateTimeResolutionResult();
        let dayDescription = extra.namedEntity('daydesc').value;
        let noDescription = recognizers_text_1.StringUtility.isNullOrEmpty(dayDescription);
        if (noDescription) {
            result.comment = 'ampm';
        }
        else {
            this.addDescription(timeResult, dayDescription);
        }
        let hour = timeResult.hour > 0 ? timeResult.hour : 0;
        let min = timeResult.minute > 0 ? timeResult.minute : 0;
        let sec = timeResult.second > 0 ? timeResult.second : 0;
        let day = referenceTime.getDate();
        let month = referenceTime.getMonth();
        let year = referenceTime.getFullYear();
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
        if (hour === 24) {
            hour = 0;
        }
        result.futureValue = utilities_1.DateUtils.safeCreateFromMinValue(year, month, day, hour, min, sec);
        result.pastValue = utilities_1.DateUtils.safeCreateFromMinValue(year, month, day, hour, min, sec);
        result.timex = timex;
        result.success = true;
        return result;
    }
    matchToValue(source) {
        return baseDateTime_1.TimeResolutionUtils.matchToValue(this.onlyDigitMatch, this.numbersMap, source);
    }
    addDescription(timeResult, description) {
        baseDateTime_1.TimeResolutionUtils.addDescription(this.lowBoundMap, timeResult, description);
    }
}
exports.ChineseTimeParser = ChineseTimeParser;
//# sourceMappingURL=timeConfiguration.js.map