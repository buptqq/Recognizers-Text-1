"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const recognizers_text_1 = require("recognizers-text");
const constants_1 = require("./constants");
const utilities_1 = require("./utilities");
const parsers_1 = require("./parsers");
const baseDateTime_1 = require("../resources/baseDateTime");
class BaseHolidayExtractor {
    constructor(config) {
        this.extractorName = constants_1.Constants.SYS_DATETIME_DATE;
        this.config = config;
    }
    extract(source, refDate) {
        if (!refDate)
            refDate = new Date();
        let referenceDate = refDate;
        let tokens = new Array()
            .concat(this.holidayMatch(source));
        let result = utilities_1.Token.mergeAllTokens(tokens, source, this.extractorName);
        return result;
    }
    holidayMatch(source) {
        let ret = [];
        this.config.holidayRegexes.forEach(regex => {
            recognizers_text_1.RegExpUtility.getMatches(regex, source).forEach(match => {
                ret.push(new utilities_1.Token(match.index, match.index + match.length));
            });
        });
        return ret;
    }
}
exports.BaseHolidayExtractor = BaseHolidayExtractor;
class BaseHolidayParser {
    constructor(config) {
        this.config = config;
    }
    parse(er, referenceDate) {
        if (!referenceDate)
            referenceDate = new Date();
        let value = null;
        if (er.type === BaseHolidayParser.ParserName) {
            let innerResult = this.parseHolidayRegexMatch(er.text, referenceDate);
            if (innerResult.success) {
                innerResult.futureResolution = {};
                innerResult.futureResolution[constants_1.TimeTypeConstants.DATE] = utilities_1.FormatUtil.formatDate(innerResult.futureValue);
                innerResult.pastResolution = {};
                innerResult.pastResolution[constants_1.TimeTypeConstants.DATE] = utilities_1.FormatUtil.formatDate(innerResult.pastValue);
                value = innerResult;
            }
        }
        let ret = new parsers_1.DateTimeParseResult(er);
        ret.value = value;
        ret.timexStr = value === null ? "" : value.timex;
        ret.resolutionStr = "";
        return ret;
    }
    parseHolidayRegexMatch(text, referenceDate) {
        let trimmedText = text.trim();
        for (let regex of this.config.holidayRegexList) {
            let offset = 0;
            let matches = recognizers_text_1.RegExpUtility.getMatches(regex, trimmedText);
            if (matches.length && matches[0].index === offset && matches[0].length === trimmedText.length) {
                // LUIS value string will be set in Match2Date method
                let ret = this.match2Date(matches[0], referenceDate);
                return ret;
            }
        }
        return new utilities_1.DateTimeResolutionResult();
    }
    match2Date(match, referenceDate) {
        let ret = new utilities_1.DateTimeResolutionResult();
        let holidayStr = this.config.sanitizeHolidayToken(match.groups("holiday").value.toLowerCase());
        // get year (if exist)
        let yearStr = match.groups("year").value.toLowerCase();
        let orderStr = match.groups("order").value.toLowerCase();
        let year;
        let hasYear = false;
        if (yearStr) {
            year = parseInt(yearStr, 10);
            hasYear = true;
        }
        else if (orderStr) {
            let swift = this.config.getSwiftYear(orderStr);
            if (swift < -1) {
                return ret;
            }
            year = referenceDate.getFullYear() + swift;
            hasYear = true;
        }
        else {
            year = referenceDate.getFullYear();
        }
        let holidayKey;
        for (holidayKey of this.config.holidayNames.keys()) {
            if (this.config.holidayNames.get(holidayKey).indexOf(holidayStr) > -1) {
                break;
            }
        }
        if (holidayKey) {
            let timexStr;
            let value = referenceDate;
            let func = this.config.holidayFuncDictionary.get(holidayKey);
            if (func) {
                value = func(year);
                timexStr = this.config.variableHolidaysTimexDictionary.get(holidayKey);
                if (!timexStr) {
                    timexStr = `-${utilities_1.FormatUtil.toString(value.getMonth() + 1, 2)}-${utilities_1.FormatUtil.toString(value.getDate(), 2)}`;
                }
            }
            else {
                return ret;
            }
            if (value.getTime() === utilities_1.DateUtils.minValue().getTime()) {
                ret.timex = '';
                ret.futureValue = utilities_1.DateUtils.minValue();
                ret.pastValue = utilities_1.DateUtils.minValue();
                ret.success = true;
                return ret;
            }
            if (hasYear) {
                ret.timex = utilities_1.FormatUtil.toString(year, 4) + timexStr;
                ret.futureValue = ret.pastValue = new Date(year, value.getMonth(), value.getDate());
                ret.success = true;
                return ret;
            }
            ret.timex = "XXXX" + timexStr;
            ret.futureValue = this.getFutureValue(value, referenceDate, holidayKey);
            ret.pastValue = this.getPastValue(value, referenceDate, holidayKey);
            ret.success = true;
            return ret;
        }
        return ret;
    }
    getFutureValue(value, referenceDate, holiday) {
        if (value < referenceDate) {
            let func = this.config.holidayFuncDictionary.get(holiday);
            if (func) {
                return func(value.getFullYear() + 1);
            }
        }
        return value;
    }
    getPastValue(value, referenceDate, holiday) {
        if (value >= referenceDate) {
            let func = this.config.holidayFuncDictionary.get(holiday);
            if (func) {
                return func(value.getFullYear() - 1);
            }
        }
        return value;
    }
}
BaseHolidayParser.ParserName = constants_1.Constants.SYS_DATETIME_DATE; // "Date";
exports.BaseHolidayParser = BaseHolidayParser;
class BaseHolidayParserConfiguration {
    constructor() {
        this.variableHolidaysTimexDictionary = baseDateTime_1.BaseDateTime.VariableHolidaysTimexDictionary;
        this.holidayFuncDictionary = this.initHolidayFuncs();
    }
    // TODO auto-generate from YAML
    initHolidayFuncs() {
        return new Map([
            ["fathers", BaseHolidayParserConfiguration.FathersDay],
            ["mothers", BaseHolidayParserConfiguration.MothersDay],
            ["thanksgivingday", BaseHolidayParserConfiguration.ThanksgivingDay],
            ["thanksgiving", BaseHolidayParserConfiguration.ThanksgivingDay],
            ["martinlutherking", BaseHolidayParserConfiguration.MartinLutherKingDay],
            ["washingtonsbirthday", BaseHolidayParserConfiguration.WashingtonsBirthday],
            ["canberra", BaseHolidayParserConfiguration.CanberraDay],
            ["labour", BaseHolidayParserConfiguration.LabourDay],
            ["columbus", BaseHolidayParserConfiguration.ColumbusDay],
            ["memorial", BaseHolidayParserConfiguration.MemorialDay]
        ]);
    }
    // All months are zero-based (-1)
    // TODO auto-generate from YAML
    static MothersDay(year) { return new Date(year, 5 - 1, BaseHolidayParserConfiguration.getDay(year, 5 - 1, 1, utilities_1.DayOfWeek.Sunday)); }
    static FathersDay(year) { return new Date(year, 6 - 1, BaseHolidayParserConfiguration.getDay(year, 6 - 1, 2, utilities_1.DayOfWeek.Sunday)); }
    static MartinLutherKingDay(year) { return new Date(year, 1 - 1, BaseHolidayParserConfiguration.getDay(year, 1 - 1, 2, utilities_1.DayOfWeek.Monday)); }
    static WashingtonsBirthday(year) { return new Date(year, 2 - 1, BaseHolidayParserConfiguration.getDay(year, 2 - 1, 2, utilities_1.DayOfWeek.Monday)); }
    static CanberraDay(year) { return new Date(year, 3 - 1, BaseHolidayParserConfiguration.getDay(year, 3 - 1, 0, utilities_1.DayOfWeek.Monday)); }
    static MemorialDay(year) { return new Date(year, 5 - 1, BaseHolidayParserConfiguration.getLastDay(year, 5 - 1, utilities_1.DayOfWeek.Monday)); }
    static LabourDay(year) { return new Date(year, 9 - 1, BaseHolidayParserConfiguration.getDay(year, 9 - 1, 0, utilities_1.DayOfWeek.Monday)); }
    static ColumbusDay(year) { return new Date(year, 10 - 1, BaseHolidayParserConfiguration.getDay(year, 10 - 1, 1, utilities_1.DayOfWeek.Monday)); }
    static ThanksgivingDay(year) { return new Date(year, 11 - 1, BaseHolidayParserConfiguration.getDay(year, 11 - 1, 3, utilities_1.DayOfWeek.Thursday)); }
    static getDay(year, month, week, dayOfWeek) {
        let days = Array.apply(null, new Array(new Date(year, month, 0).getDate())).map(function (x, i) { return i + 1; });
        days = days.filter(function (day) {
            return new Date(year, month, day).getDay() === dayOfWeek;
        });
        return days[week];
    }
    static getLastDay(year, month, dayOfWeek) {
        let days = Array.apply(null, new Array(new Date(year, month, 0).getDate())).map(function (x, i) { return i + 1; });
        days = days.filter(function (day) {
            return new Date(year, month, day).getDay() === dayOfWeek;
        });
        return days[days.length - 1];
    }
}
exports.BaseHolidayParserConfiguration = BaseHolidayParserConfiguration;
//# sourceMappingURL=baseHoliday.js.map