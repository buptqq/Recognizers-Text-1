"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const recognizers_text_1 = require("recognizers-text");
const constants_1 = require("../dateTime/constants");
class Token {
    constructor(start, end) {
        this.start = start;
        this.end = end;
    }
    get length() {
        return this.end - this.start;
    }
    static mergeAllTokens(tokens, source, extractorName) {
        let ret = [];
        let mergedTokens = [];
        tokens = tokens.sort((a, b) => { return a.start < b.start ? -1 : 1; });
        tokens.forEach(token => {
            if (token) {
                let bAdd = true;
                for (let index = 0; index < mergedTokens.length && bAdd; index++) {
                    let mergedToken = mergedTokens[index];
                    if (token.start >= mergedToken.start && token.end <= mergedToken.end) {
                        bAdd = false;
                    }
                    if (token.start > mergedToken.start && token.start < mergedToken.end) {
                        bAdd = false;
                    }
                    if (token.start <= mergedToken.start && token.end >= mergedToken.end) {
                        bAdd = false;
                        mergedTokens[index] = token;
                    }
                }
                if (bAdd) {
                    mergedTokens.push(token);
                }
            }
        });
        mergedTokens.forEach(token => {
            ret.push({
                start: token.start,
                length: token.length,
                text: source.substr(token.start, token.length),
                type: extractorName
            });
        });
        return ret;
    }
}
exports.Token = Token;
var AgoLaterMode;
(function (AgoLaterMode) {
    AgoLaterMode[AgoLaterMode["Date"] = 0] = "Date";
    AgoLaterMode[AgoLaterMode["DateTime"] = 1] = "DateTime";
})(AgoLaterMode = exports.AgoLaterMode || (exports.AgoLaterMode = {}));
class AgoLaterUtil {
    static extractorDurationWithBeforeAndAfter(source, er, ret, config) {
        let pos = er.start + er.length;
        if (pos <= source.length) {
            let afterString = source.substring(pos);
            let beforeString = source.substring(0, er.start);
            let index = -1;
            let value = MatchingUtil.getAgoLaterIndex(afterString, config.agoRegex);
            if (value.matched) {
                ret.push(new Token(er.start, er.start + er.length + value.index));
            }
            else {
                value = MatchingUtil.getAgoLaterIndex(afterString, config.laterRegex);
                if (value.matched) {
                    ret.push(new Token(er.start, er.start + er.length + value.index));
                }
                else {
                    value = MatchingUtil.getInIndex(beforeString, config.inConnectorRegex);
                    // for range unit like "week, month, year", it should output dateRange or datetimeRange
                    if (recognizers_text_1.RegExpUtility.getMatches(config.rangeUnitRegex, er.text).length > 0)
                        return ret;
                    if (value.matched && er.start && er.length && er.start >= value.index) {
                        ret.push(new Token(er.start - value.index, er.start + er.length));
                    }
                }
            }
        }
        return ret;
    }
    static parseDurationWithAgoAndLater(source, referenceDate, durationExtractor, durationParser, unitMap, unitRegex, utilityConfiguration, mode) {
        let result = new DateTimeResolutionResult();
        let duration = durationExtractor.extract(source, referenceDate).pop();
        if (!duration)
            return result;
        let pr = durationParser.parse(duration, referenceDate);
        if (!pr)
            return result;
        let match = recognizers_text_1.RegExpUtility.getMatches(unitRegex, source).pop();
        if (!match)
            return result;
        let afterStr = source.substr(duration.start + duration.length);
        let beforeStr = source.substr(0, duration.start);
        let srcUnit = match.groups('unit').value;
        let durationResult = pr.value;
        let numStr = durationResult.timex.substr(0, durationResult.timex.length - 1)
            .replace('P', '')
            .replace('T', '');
        let num = Number.parseInt(numStr, 10);
        if (!num)
            return result;
        return AgoLaterUtil.getAgoLaterResult(pr, num, unitMap, srcUnit, afterStr, beforeStr, referenceDate, utilityConfiguration, mode);
    }
    static getAgoLaterResult(durationParseResult, num, unitMap, srcUnit, afterStr, beforeStr, referenceDate, utilityConfiguration, mode) {
        let result = new DateTimeResolutionResult();
        let unitStr = unitMap.get(srcUnit);
        if (!unitStr)
            return result;
        let numStr = num.toString();
        let containsAgo = MatchingUtil.containsAgoLaterIndex(afterStr, utilityConfiguration.agoRegex);
        let containsLaterOrIn = MatchingUtil.containsAgoLaterIndex(afterStr, utilityConfiguration.laterRegex) || MatchingUtil.containsInIndex(beforeStr, utilityConfiguration.inConnectorRegex);
        if (containsAgo) {
            result = AgoLaterUtil.getDateResult(unitStr, num, referenceDate, false, mode);
            durationParseResult.value.mod = constants_1.TimeTypeConstants.beforeMod;
            result.subDateTimeEntities = [durationParseResult];
            return result;
        }
        if (containsLaterOrIn) {
            result = AgoLaterUtil.getDateResult(unitStr, num, referenceDate, true, mode);
            durationParseResult.value.mod = constants_1.TimeTypeConstants.afterMod;
            result.subDateTimeEntities = [durationParseResult];
            return result;
        }
        return result;
    }
    static getDateResult(unitStr, num, referenceDate, isFuture, mode) {
        let value = new Date(referenceDate);
        let result = new DateTimeResolutionResult();
        let swift = isFuture ? 1 : -1;
        switch (unitStr) {
            case 'D':
                value.setDate(referenceDate.getDate() + (num * swift));
                break;
            case 'W':
                value.setDate(referenceDate.getDate() + (num * swift * 7));
                break;
            case 'MON':
                value.setMonth(referenceDate.getMonth() + (num * swift));
                break;
            case 'Y':
                value.setFullYear(referenceDate.getFullYear() + (num * swift));
                break;
            case 'H':
                value.setHours(referenceDate.getHours() + (num * swift));
                break;
            case 'M':
                value.setMinutes(referenceDate.getMinutes() + (num * swift));
                break;
            case 'S':
                value.setSeconds(referenceDate.getSeconds() + (num * swift));
                break;
            default: return result;
        }
        result.timex = mode === AgoLaterMode.Date ? FormatUtil.luisDateFromDate(value) : FormatUtil.luisDateTime(value);
        result.futureValue = value;
        result.pastValue = value;
        result.success = true;
        return result;
    }
}
exports.AgoLaterUtil = AgoLaterUtil;
class MatchingUtil {
    static getAgoLaterIndex(source, regex) {
        let result = { matched: false, index: -1 };
        let referencedMatches = recognizers_text_1.RegExpUtility.getMatches(regex, source.trim().toLowerCase());
        if (referencedMatches && referencedMatches.length > 0) {
            result.index = source.toLowerCase().lastIndexOf(referencedMatches[0].value) + referencedMatches[0].length;
            result.matched = true;
        }
        return result;
    }
    static getInIndex(source, regex) {
        let result = { matched: false, index: -1 };
        let referencedMatch = recognizers_text_1.RegExpUtility.getMatches(regex, source.trim().toLowerCase().split(' ').pop());
        if (referencedMatch && referencedMatch.length > 0) {
            result.index = source.length - source.toLowerCase().lastIndexOf(referencedMatch[0].value);
            result.matched = true;
        }
        return result;
    }
    static containsAgoLaterIndex(source, regex) {
        return this.getAgoLaterIndex(source, regex).matched;
    }
    static containsInIndex(source, regex) {
        return this.getInIndex(source, regex).matched;
    }
}
exports.MatchingUtil = MatchingUtil;
class FormatUtil {
    // Emulates .NET ToString("D{size}")
    static toString(num, size) {
        let s = "000000" + (num || "");
        return s.substr(s.length - size);
    }
    static luisDate(year, month, day) {
        if (year === -1) {
            if (month === -1) {
                return new Array("XXXX", "XX", FormatUtil.toString(day, 2)).join("-");
            }
            return new Array("XXXX", FormatUtil.toString(month + 1, 2), FormatUtil.toString(day, 2)).join("-");
        }
        return new Array(FormatUtil.toString(year, 4), FormatUtil.toString(month + 1, 2), FormatUtil.toString(day, 2)).join("-");
    }
    static luisDateFromDate(date) {
        return FormatUtil.luisDate(date.getFullYear(), date.getMonth(), date.getDate());
    }
    static luisTime(hour, min, second) {
        return new Array(FormatUtil.toString(hour, 2), FormatUtil.toString(min, 2), FormatUtil.toString(second, 2)).join(":");
    }
    static luisTimeFromDate(time) {
        return FormatUtil.luisTime(time.getHours(), time.getMinutes(), time.getSeconds());
    }
    static luisDateTime(time) {
        return `${FormatUtil.luisDateFromDate(time)}T${FormatUtil.luisTimeFromDate(time)}`;
    }
    static formatDate(date) {
        return new Array(FormatUtil.toString(date.getFullYear(), 4), FormatUtil.toString(date.getMonth() + 1, 2), FormatUtil.toString(date.getDate(), 2)).join("-");
    }
    static formatTime(time) {
        return new Array(FormatUtil.toString(time.getHours(), 2), FormatUtil.toString(time.getMinutes(), 2), FormatUtil.toString(time.getSeconds(), 2)).join(":");
    }
    static formatDateTime(datetime) {
        return `${FormatUtil.formatDate(datetime)} ${FormatUtil.formatTime(datetime)}`;
    }
    static allStringToPm(timeStr) {
        let matches = recognizers_text_1.RegExpUtility.getMatches(FormatUtil.HourTimexRegex, timeStr);
        let split = Array();
        let lastPos = 0;
        matches.forEach(match => {
            if (lastPos !== match.index)
                split.push(timeStr.substring(lastPos, match.index));
            split.push(timeStr.substring(match.index, match.index + match.length));
            lastPos = match.index + match.length;
        });
        if (timeStr.substring(lastPos)) {
            split.push(timeStr.substring(lastPos));
        }
        for (let i = 0; i < split.length; i += 1) {
            if (recognizers_text_1.RegExpUtility.getMatches(FormatUtil.HourTimexRegex, split[i]).length > 0) {
                split[i] = FormatUtil.toPm(split[i]);
            }
        }
        return split.join('');
    }
    static toPm(timeStr) {
        let hasT = false;
        if (timeStr.startsWith("T")) {
            hasT = true;
            timeStr = timeStr.substring(1);
        }
        let split = timeStr.split(':');
        let hour = parseInt(split[0], 10);
        hour = (hour === 12) ? 0 : hour + 12;
        split[0] = FormatUtil.toString(hour, 2);
        return (hasT ? "T" : "") + split.join(":");
    }
}
FormatUtil.HourTimexRegex = recognizers_text_1.RegExpUtility.getSafeRegExp(String.raw `(?<!P)T\d{2}`, "gis");
exports.FormatUtil = FormatUtil;
class StringMap {
}
exports.StringMap = StringMap;
class DateTimeResolutionResult {
    constructor() {
        this.success = false;
    }
}
exports.DateTimeResolutionResult = DateTimeResolutionResult;
var DayOfWeek;
(function (DayOfWeek) {
    DayOfWeek[DayOfWeek["Sunday"] = 0] = "Sunday";
    DayOfWeek[DayOfWeek["Monday"] = 1] = "Monday";
    DayOfWeek[DayOfWeek["Tuesday"] = 2] = "Tuesday";
    DayOfWeek[DayOfWeek["Wednesday"] = 3] = "Wednesday";
    DayOfWeek[DayOfWeek["Thursday"] = 4] = "Thursday";
    DayOfWeek[DayOfWeek["Friday"] = 5] = "Friday";
    DayOfWeek[DayOfWeek["Saturday"] = 6] = "Saturday";
})(DayOfWeek = exports.DayOfWeek || (exports.DayOfWeek = {}));
class DateUtils {
    static next(from, dayOfWeek) {
        let start = from.getDay();
        let target = dayOfWeek;
        if (start === 0)
            start = 7;
        if (target === 0)
            target = 7;
        let result = new Date(from);
        result.setDate(from.getDate() + target - start + 7);
        return result;
    }
    static this(from, dayOfWeek) {
        let start = from.getDay();
        let target = dayOfWeek;
        if (start === 0)
            start = 7;
        if (target === 0)
            target = 7;
        let result = new Date(from);
        result.setDate(from.getDate() + target - start);
        return result;
    }
    static last(from, dayOfWeek) {
        let start = from.getDay();
        let target = dayOfWeek;
        if (start === 0)
            start = 7;
        if (target === 0)
            target = 7;
        let result = new Date(from);
        result.setDate(from.getDate() + target - start - 7);
        return result;
    }
    static diffDays(from, to) {
        return Math.round(Math.abs((from.getTime() - to.getTime()) / this.oneDay));
    }
    static totalHours(from, to) {
        // Fix to mimic .NET's Convert.ToInt32()
        // C#: Math.Round(4.5) == 4
        // C#: Convert.ToInt32(4.5) == 4
        // JS: Math.round(4.5) == 5 !!
        let fromEpoch = from.getTime() - (from.getTimezoneOffset() * 60 * 1000);
        let toEpoch = to.getTime() - (to.getTimezoneOffset() * 60 * 1000);
        return Math.round(Math.abs(fromEpoch - toEpoch - 0.00001) / this.oneHour);
    }
    static totalSeconds(from, to) {
        let fromEpoch = from.getTime() - (from.getTimezoneOffset() * 60 * 1000);
        let toEpoch = to.getTime() - (to.getTimezoneOffset() * 60 * 1000);
        return Math.round(Math.abs(fromEpoch - toEpoch) / this.oneSecond);
    }
    static addTime(seedDate, timeToAdd) {
        let date = new Date(seedDate);
        date.setHours(seedDate.getHours() + timeToAdd.getHours());
        date.setMinutes(seedDate.getMinutes() + timeToAdd.getMinutes());
        date.setSeconds(seedDate.getSeconds() + timeToAdd.getSeconds());
        return date;
    }
    static addSeconds(seedDate, secondsToAdd) {
        let date = new Date(seedDate);
        date.setSeconds(seedDate.getSeconds() + secondsToAdd);
        return date;
    }
    static addMinutes(seedDate, minutesToAdd) {
        let date = new Date(seedDate);
        date.setMinutes(seedDate.getMinutes() + minutesToAdd);
        return date;
    }
    static addHours(seedDate, hoursToAdd) {
        let date = new Date(seedDate);
        date.setHours(seedDate.getHours() + hoursToAdd);
        return date;
    }
    static addDays(seedDate, daysToAdd) {
        let date = new Date(seedDate);
        date.setDate(seedDate.getDate() + daysToAdd);
        return date;
    }
    static addMonths(seedDate, monthsToAdd) {
        let date = new Date(seedDate);
        date.setMonth(seedDate.getMonth() + monthsToAdd);
        return date;
    }
    static addYears(seedDate, yearsToAdd) {
        let date = new Date(seedDate);
        date.setFullYear(seedDate.getFullYear() + yearsToAdd);
        return date;
    }
    static getWeekNumber(referenceDate) {
        // Create a copy of this date object
        let target = new Date(referenceDate.valueOf());
        // ISO week date weeks start on monday
        // so correct the day number
        let dayNr = (referenceDate.getDay() + 6) % 7;
        // ISO 8601 states that week 1 is the week
        // with the first thursday of that year.
        // Set the target date to the thursday in the target week
        target.setDate(target.getDate() - dayNr + 3);
        // Store the millisecond value of the target date
        let firstThursday = target.valueOf();
        // Set the target to the first thursday of the year
        // First set the target to january first
        target.setMonth(0, 1);
        // Not a thursday? Correct the date to the next thursday
        if (target.getDay() !== 4) {
            target.setMonth(0, 1 + ((4 - target.getDay()) + 7) % 7);
        }
        // The weeknumber is the number of weeks between the 
        // first thursday of the year and the thursday in the target week
        let weekNo = 1 + Math.ceil((firstThursday - target.valueOf()) / 604800000); // 604800000 = 7 * 24 * 3600 * 1000
        return { weekNo: weekNo, year: referenceDate.getUTCFullYear() };
    }
    static minValue() {
        let date = new Date(1, 0, 1, 0, 0, 0, 0);
        date.setFullYear(1);
        return date;
    }
    static safeCreateFromValue(seedDate, year, month, day, hour = 0, minute = 0, second = 0) {
        if (this.isValidDate(year, month, day) && this.isValidTime(hour, minute, second)) {
            return new Date(year, month, day, hour, minute, second, 0);
        }
        return seedDate;
    }
    static safeCreateFromMinValue(year, month, day, hour = 0, minute = 0, second = 0) {
        return this.safeCreateFromValue(this.minValue(), year, month, day, hour, minute, second);
    }
    static safeCreateFromMinValueWithDateAndTime(date, time) {
        return this.safeCreateFromMinValue(date.getFullYear(), date.getMonth(), date.getDate(), time ? time.getHours() : 0, time ? time.getMinutes() : 0, time ? time.getSeconds() : 0);
    }
    static isLeapYear(year) {
        return ((year % 4 === 0) && (year % 100 !== 0)) || (year % 400 === 0);
    }
    static dayOfYear(date) {
        let start = new Date(date.getFullYear(), 0, 1);
        let diffDays = date.valueOf() - start.valueOf();
        return Math.floor(diffDays / DateUtils.oneDay);
    }
    static validDays(year) { return [31, this.isLeapYear(year) ? 29 : 28, 31, 30, 31, 30, 31, 31, 30, 31, 30, 31]; }
    static isValidDate(year, month, day) {
        return year > 0 && year <= 9999
            && month >= 0 && month < 12
            && day > 0 && day <= this.validDays(year)[month];
    }
    static isValidTime(hour, minute, second) {
        return hour >= 0 && hour < 24
            && minute >= 0 && minute < 60
            && second >= 0 && minute < 60;
    }
}
DateUtils.oneDay = 24 * 60 * 60 * 1000;
DateUtils.oneHour = 60 * 60 * 1000;
DateUtils.oneSecond = 1000;
exports.DateUtils = DateUtils;
//# sourceMappingURL=utilities.js.map