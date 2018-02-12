"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const recognizers_text_1 = require("recognizers-text");
const constants_1 = require("./constants");
const recognizers_text_number_1 = require("recognizers-text-number");
const utilities_1 = require("./utilities");
const parsers_1 = require("./parsers");
const toNumber = require("lodash.tonumber");
class BaseDateExtractor {
    constructor(config) {
        this.extractorName = constants_1.Constants.SYS_DATETIME_DATE;
        this.config = config;
    }
    extract(source, refDate) {
        if (!refDate)
            refDate = new Date();
        let referenceDate = refDate;
        let tokens = new Array();
        tokens = tokens.concat(this.basicRegexMatch(source));
        tokens = tokens.concat(this.implicitDate(source));
        tokens = tokens.concat(this.numberWithMonth(source, referenceDate));
        tokens = tokens.concat(this.durationWithBeforeAndAfter(source, referenceDate));
        let result = utilities_1.Token.mergeAllTokens(tokens, source, this.extractorName);
        return result;
    }
    basicRegexMatch(source) {
        let ret = [];
        this.config.dateRegexList.forEach(regexp => {
            let matches = recognizers_text_1.RegExpUtility.getMatches(regexp, source);
            matches.forEach(match => {
                ret.push(new utilities_1.Token(match.index, match.index + match.length));
            });
        });
        return ret;
    }
    implicitDate(source) {
        let ret = [];
        this.config.implicitDateList.forEach(regexp => {
            let matches = recognizers_text_1.RegExpUtility.getMatches(regexp, source);
            matches.forEach(match => {
                ret.push(new utilities_1.Token(match.index, match.index + match.length));
            });
        });
        return ret;
    }
    numberWithMonth(source, refDate) {
        let ret = [];
        let er = this.config.ordinalExtractor.extract(source).concat(this.config.integerExtractor.extract(source));
        er.forEach(result => {
            let num = toNumber(this.config.numberParser.parse(result).value);
            if (num < 1 || num > 31) {
                return;
            }
            if (result.start > 0) {
                let frontString = source.substring(0, result.start | 0);
                let match = recognizers_text_1.RegExpUtility.getMatches(this.config.monthEnd, frontString)[0];
                if (match && match.length) {
                    ret.push(new utilities_1.Token(match.index, match.index + match.length + result.length));
                    return;
                }
                // handling cases like 'for the 25th'
                match = recognizers_text_1.RegExpUtility.getMatches(this.config.forTheRegex, source).pop();
                if (match) {
                    let ordinalNum = match.groups('DayOfMonth').value;
                    if (ordinalNum === result.text) {
                        let length = match.groups('end').value.length;
                        ret.push(new utilities_1.Token(match.index, match.index + match.length - length));
                        return;
                    }
                }
                // handling cases like 'Thursday the 21st', which both 'Thursday' and '21st' refer to a same date
                match = recognizers_text_1.RegExpUtility.getMatches(this.config.weekDayAndDayOfMothRegex, source).pop();
                if (match) {
                    let month = refDate.getMonth();
                    let year = refDate.getFullYear();
                    // get week of day for the ordinal number which is regarded as a date of reference month
                    let date = utilities_1.DateUtils.safeCreateFromMinValue(year, month, num);
                    let numWeekDayStr = utilities_1.DayOfWeek[date.getDay()].toString().toLowerCase();
                    // get week day from text directly, compare it with the weekday generated above
                    // to see whether they refer to a same week day
                    let extractedWeekDayStr = match.groups("weekday").value.toString().toLowerCase();
                    if (date !== utilities_1.DateUtils.minValue() &&
                        this.config.dayOfWeek.get(numWeekDayStr) == this.config.dayOfWeek.get(extractedWeekDayStr)) {
                        ret.push(new utilities_1.Token(match.index, result.start + result.length));
                        return;
                    }
                }
                // handling cases like '20th of next month'
                let suffixStr = source.substr(result.start + result.length).toLowerCase();
                match = recognizers_text_1.RegExpUtility.getMatches(this.config.relativeMonthRegex, suffixStr.trim()).pop();
                if (match && match.index === 0) {
                    let spaceLen = suffixStr.length - suffixStr.trim().length;
                    ret.push(new utilities_1.Token(result.start, result.start + result.length + spaceLen + match.length));
                }
                // handling cases like 'second Sunday'
                match = recognizers_text_1.RegExpUtility.getMatches(this.config.weekDayRegex, suffixStr.trim()).pop();
                if (match && match.index === 0 && num >= 1 && num <= 5
                    && result.type === recognizers_text_number_1.Constants.SYS_NUM_ORDINAL) {
                    let weekDayStr = match.groups('weekday').value;
                    if (this.config.dayOfWeek.has(weekDayStr)) {
                        let spaceLen = suffixStr.length - suffixStr.trim().length;
                        ret.push(new utilities_1.Token(result.start, result.start + result.length + spaceLen + match.length));
                    }
                }
            }
            if (result.start + result.length < source.length) {
                let afterString = source.substring(result.start + result.length);
                let match = recognizers_text_1.RegExpUtility.getMatches(this.config.ofMonth, afterString)[0];
                if (match && match.length) {
                    ret.push(new utilities_1.Token(result.start, result.start + result.length + match.length));
                    return;
                }
            }
        });
        return ret;
    }
    durationWithBeforeAndAfter(source, refDate) {
        let ret = [];
        let durEx = this.config.durationExtractor.extract(source, refDate);
        durEx.forEach(er => {
            let match = recognizers_text_1.RegExpUtility.getMatches(this.config.dateUnitRegex, er.text).pop();
            if (!match)
                return;
            ret = utilities_1.AgoLaterUtil.extractorDurationWithBeforeAndAfter(source, er, ret, this.config.utilityConfiguration);
        });
        return ret;
    }
}
exports.BaseDateExtractor = BaseDateExtractor;
class BaseDateParser {
    constructor(config) {
        this.parserName = constants_1.Constants.SYS_DATETIME_DATE;
        this.config = config;
    }
    parse(extractorResult, referenceDate) {
        if (!referenceDate)
            referenceDate = new Date();
        let resultValue;
        if (extractorResult.type === this.parserName) {
            let source = extractorResult.text.toLowerCase();
            let innerResult = this.parseBasicRegexMatch(source, referenceDate);
            if (!innerResult.success) {
                innerResult = this.parseImplicitDate(source, referenceDate);
            }
            if (!innerResult.success) {
                innerResult = this.parseWeekdayOfMonth(source, referenceDate);
            }
            if (!innerResult.success) {
                innerResult = this.parserDurationWithAgoAndLater(source, referenceDate);
            }
            if (!innerResult.success) {
                innerResult = this.parseNumberWithMonth(source, referenceDate);
            }
            if (!innerResult.success) {
                innerResult = this.parseSingleNumber(source, referenceDate);
            }
            if (innerResult.success) {
                innerResult.futureResolution = {};
                innerResult.futureResolution[constants_1.TimeTypeConstants.DATE] = utilities_1.FormatUtil.formatDate(innerResult.futureValue);
                innerResult.pastResolution = {};
                innerResult.pastResolution[constants_1.TimeTypeConstants.DATE] = utilities_1.FormatUtil.formatDate(innerResult.pastValue);
                resultValue = innerResult;
            }
        }
        let result = new parsers_1.DateTimeParseResult(extractorResult);
        result.value = resultValue;
        result.timexStr = resultValue ? resultValue.timex : '';
        result.resolutionStr = '';
        return result;
    }
    parseBasicRegexMatch(source, referenceDate) {
        let trimmedSource = source.trim();
        let result = new utilities_1.DateTimeResolutionResult();
        this.config.dateRegex.some(regex => {
            let offset = 0;
            let match = recognizers_text_1.RegExpUtility.getMatches(regex, trimmedSource).pop();
            if (!match) {
                match = recognizers_text_1.RegExpUtility.getMatches(regex, this.config.dateTokenPrefix + trimmedSource).pop();
                offset = this.config.dateTokenPrefix.length;
            }
            if (match && match.index === offset && match.length === trimmedSource.length) {
                result = this.matchToDate(match, referenceDate);
                return true;
            }
        });
        return result;
    }
    parseImplicitDate(source, referenceDate) {
        let trimmedSource = source.trim();
        let result = new utilities_1.DateTimeResolutionResult();
        // handle "on 12"
        let match = recognizers_text_1.RegExpUtility.getMatches(this.config.onRegex, this.config.dateTokenPrefix + trimmedSource).pop();
        if (match && match.index === this.config.dateTokenPrefix.length && match.length === trimmedSource.length) {
            let day = 0;
            let month = referenceDate.getMonth();
            let year = referenceDate.getFullYear();
            let dayStr = match.groups('day').value;
            day = this.config.dayOfMonth.get(dayStr);
            result.timex = utilities_1.FormatUtil.luisDate(-1, -1, day);
            let tryStr = utilities_1.FormatUtil.luisDate(year, month, day);
            let tryDate = Date.parse(tryStr);
            let futureDate;
            let pastDate;
            if (tryDate && !isNaN(tryDate)) {
                futureDate = utilities_1.DateUtils.safeCreateFromMinValue(year, month, day);
                pastDate = utilities_1.DateUtils.safeCreateFromMinValue(year, month, day);
                if (futureDate < referenceDate) {
                    futureDate.setMonth(futureDate.getMonth() + 1);
                }
                if (pastDate >= referenceDate) {
                    pastDate.setMonth(pastDate.getMonth() - 1);
                }
            }
            else {
                futureDate = utilities_1.DateUtils.safeCreateFromMinValue(year, month + 1, day);
                pastDate = utilities_1.DateUtils.safeCreateFromMinValue(year, month - 1, day);
            }
            result.futureValue = futureDate;
            result.pastValue = pastDate;
            result.success = true;
            return result;
        }
        // handle "today", "the day before yesterday"
        match = recognizers_text_1.RegExpUtility.getMatches(this.config.specialDayRegex, trimmedSource).pop();
        if (match && match.index === 0 && match.length === trimmedSource.length) {
            let swift = this.config.getSwiftDay(match.value);
            let value = utilities_1.DateUtils.addDays(referenceDate, swift);
            result.timex = utilities_1.FormatUtil.luisDateFromDate(value);
            result.futureValue = value;
            result.pastValue = value;
            result.success = true;
            return result;
        }
        // handle "next Sunday"
        match = recognizers_text_1.RegExpUtility.getMatches(this.config.nextRegex, trimmedSource).pop();
        if (match && match.index === 0 && match.length === trimmedSource.length) {
            let weekdayStr = match.groups('weekday').value;
            let value = utilities_1.DateUtils.next(referenceDate, this.config.dayOfWeek.get(weekdayStr));
            result.timex = utilities_1.FormatUtil.luisDateFromDate(value);
            result.futureValue = value;
            result.pastValue = value;
            result.success = true;
            return result;
        }
        // handle "this Friday"
        match = recognizers_text_1.RegExpUtility.getMatches(this.config.thisRegex, trimmedSource).pop();
        if (match && match.index === 0 && match.length === trimmedSource.length) {
            let weekdayStr = match.groups('weekday').value;
            let value = utilities_1.DateUtils.this(referenceDate, this.config.dayOfWeek.get(weekdayStr));
            result.timex = utilities_1.FormatUtil.luisDateFromDate(value);
            result.futureValue = value;
            result.pastValue = value;
            result.success = true;
            return result;
        }
        // handle "last Friday", "last mon"
        match = recognizers_text_1.RegExpUtility.getMatches(this.config.lastRegex, trimmedSource).pop();
        if (match && match.index === 0 && match.length === trimmedSource.length) {
            let weekdayStr = match.groups('weekday').value;
            let value = utilities_1.DateUtils.last(referenceDate, this.config.dayOfWeek.get(weekdayStr));
            result.timex = utilities_1.FormatUtil.luisDateFromDate(value);
            result.futureValue = value;
            result.pastValue = value;
            result.success = true;
            return result;
        }
        // handle "Friday"
        match = recognizers_text_1.RegExpUtility.getMatches(this.config.weekDayRegex, trimmedSource).pop();
        if (match && match.index === 0 && match.length === trimmedSource.length) {
            let weekdayStr = match.groups('weekday').value;
            let weekday = this.config.dayOfWeek.get(weekdayStr);
            let value = utilities_1.DateUtils.this(referenceDate, this.config.dayOfWeek.get(weekdayStr));
            if (weekday === 0)
                weekday = 7;
            if (weekday < referenceDate.getDay())
                value = utilities_1.DateUtils.next(referenceDate, weekday);
            result.timex = 'XXXX-WXX-' + weekday;
            let futureDate = new Date(value);
            let pastDate = new Date(value);
            if (futureDate < referenceDate)
                futureDate.setDate(value.getDate() + 7);
            if (pastDate >= referenceDate)
                pastDate.setDate(value.getDate() - 7);
            result.futureValue = futureDate;
            result.pastValue = pastDate;
            result.success = true;
            return result;
        }
        // handle "for the 27th."
        match = recognizers_text_1.RegExpUtility.getMatches(this.config.forTheRegex, trimmedSource).pop();
        if (match) {
            let dayStr = match.groups('DayOfMonth').value;
            let er = recognizers_text_1.ExtractResult.getFromText(dayStr);
            let day = Number.parseInt(this.config.numberParser.parse(er).value);
            let month = referenceDate.getMonth();
            let year = referenceDate.getFullYear();
            result.timex = utilities_1.FormatUtil.luisDate(-1, -1, day);
            let date = new Date(year, month, day);
            result.futureValue = date;
            result.pastValue = date;
            result.success = true;
            return result;
        }
        // handling cases like 'Thursday the 21st', which both 'Thursday' and '21st' refer to a same date
        match = recognizers_text_1.RegExpUtility.getMatches(this.config.weekDayAndDayOfMothRegex, trimmedSource).pop();
        if (match) {
            let dayStr = match.groups('DayOfMonth').value;
            let er = recognizers_text_1.ExtractResult.getFromText(dayStr);
            let day = Number.parseInt(this.config.numberParser.parse(er).value);
            let month = referenceDate.getMonth();
            let year = referenceDate.getFullYear();
            // the validity of the phrase is guaranteed in the Date Extractor
            result.timex = utilities_1.FormatUtil.luisDate(year, month, day);
            result.futureValue = new Date(year, month, day);
            result.pastValue = new Date(year, month, day);
            result.success = true;
            return result;
        }
        return result;
    }
    parseNumberWithMonth(source, referenceDate) {
        let trimmedSource = source.trim();
        let ambiguous = true;
        let result = new utilities_1.DateTimeResolutionResult();
        let ers = this.config.ordinalExtractor.extract(trimmedSource);
        if (!ers || ers.length === 0) {
            ers = this.config.integerExtractor.extract(trimmedSource);
        }
        if (!ers || ers.length === 0)
            return result;
        let num = Number.parseInt(this.config.numberParser.parse(ers[0]).value);
        let day = 1;
        let month = 0;
        let match = recognizers_text_1.RegExpUtility.getMatches(this.config.monthRegex, trimmedSource).pop();
        if (match) {
            month = this.config.monthOfYear.get(match.value) - 1;
            day = num;
        }
        else {
            // handling relative month
            match = recognizers_text_1.RegExpUtility.getMatches(this.config.relativeMonthRegex, trimmedSource).pop();
            if (match) {
                let monthStr = match.groups('order').value;
                let swift = this.config.getSwiftMonth(monthStr);
                let date = new Date(referenceDate);
                date.setMonth(referenceDate.getMonth() + swift);
                month = date.getMonth();
                day = num;
                ambiguous = false;
            }
        }
        // handling casesd like 'second Sunday'
        if (!match) {
            match = recognizers_text_1.RegExpUtility.getMatches(this.config.weekDayRegex, trimmedSource).pop();
            if (match) {
                month = referenceDate.getMonth();
                // resolve the date of wanted week day
                let wantedWeekDay = this.config.dayOfWeek.get(match.groups('weekday').value);
                let firstDate = utilities_1.DateUtils.safeCreateFromMinValue(referenceDate.getFullYear(), referenceDate.getMonth(), 1);
                let firstWeekday = firstDate.getDay();
                let firstWantedWeekDay = new Date(firstDate);
                firstWantedWeekDay.setDate(firstDate.getDate() + ((wantedWeekDay > firstWeekday) ? wantedWeekDay - firstWeekday : wantedWeekDay - firstWeekday + 7));
                day = firstWantedWeekDay.getDate() + ((num - 1) * 7);
                ambiguous = false;
            }
        }
        if (!match)
            return result;
        let year = referenceDate.getFullYear();
        // for LUIS format value string
        let futureDate = utilities_1.DateUtils.safeCreateFromMinValue(year, month, day);
        let pastDate = utilities_1.DateUtils.safeCreateFromMinValue(year, month, day);
        if (ambiguous) {
            result.timex = utilities_1.FormatUtil.luisDate(-1, month, day);
            if (futureDate < referenceDate)
                futureDate.setFullYear(year + 1);
            if (pastDate >= referenceDate)
                pastDate.setFullYear(year - 1);
        }
        else {
            result.timex = utilities_1.FormatUtil.luisDate(year, month, day);
        }
        result.futureValue = futureDate;
        result.pastValue = pastDate;
        result.success = true;
        return result;
    }
    // handle cases like "the 27th". In the extractor, only the unmatched weekday and date will output this date.
    parseSingleNumber(source, referenceDate) {
        let trimmedSource = source.trim();
        let result = new utilities_1.DateTimeResolutionResult();
        let er = this.config.ordinalExtractor.extract(trimmedSource).pop();
        if (!er || recognizers_text_1.StringUtility.isNullOrEmpty(er.text)) {
            er = this.config.integerExtractor.extract(trimmedSource).pop();
        }
        if (!er || recognizers_text_1.StringUtility.isNullOrEmpty(er.text))
            return result;
        let day = Number.parseInt(this.config.numberParser.parse(er).value);
        let month = referenceDate.getMonth();
        let year = referenceDate.getFullYear();
        result.timex = utilities_1.FormatUtil.luisDate(-1, -1, day);
        let pastDate = utilities_1.DateUtils.safeCreateFromMinValue(year, month, day);
        let futureDate = utilities_1.DateUtils.safeCreateFromMinValue(year, month, day);
        if (futureDate !== utilities_1.DateUtils.minValue() && futureDate < referenceDate)
            futureDate.setMonth(month + 1);
        if (pastDate !== utilities_1.DateUtils.minValue() && pastDate >= referenceDate)
            pastDate.setMonth(month - 1);
        result.futureValue = futureDate;
        result.pastValue = pastDate;
        result.success = true;
        return result;
    }
    parserDurationWithAgoAndLater(source, referenceDate) {
        return utilities_1.AgoLaterUtil.parseDurationWithAgoAndLater(source, referenceDate, this.config.durationExtractor, this.config.durationParser, this.config.unitMap, this.config.unitRegex, this.config.utilityConfiguration, utilities_1.AgoLaterMode.Date);
    }
    parseWeekdayOfMonth(source, referenceDate) {
        let trimmedSource = source.trim();
        let result = new utilities_1.DateTimeResolutionResult();
        let match = recognizers_text_1.RegExpUtility.getMatches(this.config.weekDayOfMonthRegex, trimmedSource).pop();
        if (!match)
            return result;
        let cardinalStr = match.groups('cardinal').value;
        let weekdayStr = match.groups('weekday').value;
        let monthStr = match.groups('month').value;
        let noYear = false;
        let cardinal = this.config.isCardinalLast(cardinalStr) ? 5 : this.config.cardinalMap.get(cardinalStr);
        let weekday = this.config.dayOfWeek.get(weekdayStr);
        let month = referenceDate.getMonth();
        let year = referenceDate.getFullYear();
        if (recognizers_text_1.StringUtility.isNullOrEmpty(monthStr)) {
            let swift = this.config.getSwiftMonth(trimmedSource);
            let temp = new Date(referenceDate);
            temp.setMonth(referenceDate.getMonth() + swift);
            month = temp.getMonth();
            year = temp.getFullYear();
        }
        else {
            month = this.config.monthOfYear.get(monthStr) - 1;
            noYear = true;
        }
        let value = this.computeDate(cardinal, weekday, month, year);
        if (value.getMonth() !== month) {
            cardinal -= 1;
            value.setDate(value.getDate() - 7);
        }
        let futureDate = value;
        let pastDate = value;
        if (noYear && futureDate < referenceDate) {
            futureDate = this.computeDate(cardinal, weekday, month, year + 1);
            if (futureDate.getMonth() !== month)
                futureDate.setDate(futureDate.getDate() - 7);
        }
        if (noYear && pastDate >= referenceDate) {
            pastDate = this.computeDate(cardinal, weekday, month, year - 1);
            if (pastDate.getMonth() !== month)
                pastDate.setDate(pastDate.getDate() - 7);
        }
        result.timex = ['XXXX', utilities_1.FormatUtil.toString(month + 1, 2), 'WXX', weekday, '#' + cardinal].join('-');
        result.futureValue = futureDate;
        result.pastValue = pastDate;
        result.success = true;
        return result;
    }
    matchToDate(match, referenceDate) {
        let result = new utilities_1.DateTimeResolutionResult();
        let yearStr = match.groups('year').value;
        let monthStr = match.groups('month').value;
        let dayStr = match.groups('day').value;
        let month = 0;
        let day = 0;
        let year = 0;
        if (this.config.monthOfYear.has(monthStr) && this.config.dayOfMonth.has(dayStr)) {
            month = this.config.monthOfYear.get(monthStr) - 1;
            day = this.config.dayOfMonth.get(dayStr);
            if (!recognizers_text_1.StringUtility.isNullOrEmpty(yearStr)) {
                year = Number.parseInt(yearStr, 10);
                if (year < 100 && year >= 90)
                    year += 1900;
                else if (year < 100 && year < 20)
                    year += 2000;
            }
        }
        let noYear = false;
        if (year === 0) {
            year = referenceDate.getFullYear();
            result.timex = utilities_1.FormatUtil.luisDate(-1, month, day);
            noYear = true;
        }
        else {
            result.timex = utilities_1.FormatUtil.luisDate(year, month, day);
        }
        let futureDate = utilities_1.DateUtils.safeCreateFromMinValue(year, month, day);
        let pastDate = utilities_1.DateUtils.safeCreateFromMinValue(year, month, day);
        if (noYear && futureDate < referenceDate) {
            futureDate = utilities_1.DateUtils.safeCreateFromMinValue(year + 1, month, day);
        }
        if (noYear && pastDate >= referenceDate) {
            pastDate = utilities_1.DateUtils.safeCreateFromMinValue(year - 1, month, day);
        }
        result.futureValue = futureDate;
        result.pastValue = pastDate;
        result.success = true;
        return result;
    }
    computeDate(cardinal, weekday, month, year) {
        let firstDay = new Date(year, month, 1);
        let firstWeekday = utilities_1.DateUtils.this(firstDay, weekday);
        if (weekday === 0)
            weekday = 7;
        if (weekday < firstDay.getDay())
            firstWeekday = utilities_1.DateUtils.next(firstDay, weekday);
        firstWeekday.setDate(firstWeekday.getDate() + (7 * (cardinal - 1)));
        return firstWeekday;
    }
}
exports.BaseDateParser = BaseDateParser;
//# sourceMappingURL=baseDate.js.map