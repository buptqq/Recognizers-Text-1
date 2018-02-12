"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const recognizers_text_1 = require("recognizers-text");
const recognizers_text_number_1 = require("recognizers-text-number");
const recognizers_text_number_2 = require("recognizers-text-number");
const baseDate_1 = require("../baseDate");
const constants_1 = require("../constants");
const durationConfiguration_1 = require("./durationConfiguration");
const utilities_1 = require("../utilities");
const chineseDateTime_1 = require("../../resources/chineseDateTime");
const parsers_1 = require("../parsers");
class ChineseDateExtractorConfiguration {
    constructor() {
        this.dateRegexList = [
            recognizers_text_1.RegExpUtility.getSafeRegExp(chineseDateTime_1.ChineseDateTime.DateRegexList1),
            recognizers_text_1.RegExpUtility.getSafeRegExp(chineseDateTime_1.ChineseDateTime.DateRegexList2),
            recognizers_text_1.RegExpUtility.getSafeRegExp(chineseDateTime_1.ChineseDateTime.DateRegexList3),
            recognizers_text_1.RegExpUtility.getSafeRegExp(chineseDateTime_1.ChineseDateTime.DateRegexList4),
            recognizers_text_1.RegExpUtility.getSafeRegExp(chineseDateTime_1.ChineseDateTime.DateRegexList5),
            recognizers_text_1.RegExpUtility.getSafeRegExp(chineseDateTime_1.ChineseDateTime.DateRegexList6),
            recognizers_text_1.RegExpUtility.getSafeRegExp(chineseDateTime_1.ChineseDateTime.DateRegexList7),
            recognizers_text_1.RegExpUtility.getSafeRegExp(chineseDateTime_1.ChineseDateTime.DateRegexList8)
        ];
        this.implicitDateList = [
            recognizers_text_1.RegExpUtility.getSafeRegExp(chineseDateTime_1.ChineseDateTime.LunarRegex),
            recognizers_text_1.RegExpUtility.getSafeRegExp(chineseDateTime_1.ChineseDateTime.SpecialDayRegex),
            recognizers_text_1.RegExpUtility.getSafeRegExp(chineseDateTime_1.ChineseDateTime.DateThisRegex),
            recognizers_text_1.RegExpUtility.getSafeRegExp(chineseDateTime_1.ChineseDateTime.DateLastRegex),
            recognizers_text_1.RegExpUtility.getSafeRegExp(chineseDateTime_1.ChineseDateTime.DateNextRegex),
            recognizers_text_1.RegExpUtility.getSafeRegExp(chineseDateTime_1.ChineseDateTime.WeekDayRegex),
            recognizers_text_1.RegExpUtility.getSafeRegExp(chineseDateTime_1.ChineseDateTime.WeekDayOfMonthRegex),
            recognizers_text_1.RegExpUtility.getSafeRegExp(chineseDateTime_1.ChineseDateTime.SpecialDate)
        ];
    }
}
class ChineseDateExtractor extends baseDate_1.BaseDateExtractor {
    constructor() {
        super(new ChineseDateExtractorConfiguration());
        this.durationExtractor = new durationConfiguration_1.ChineseDurationExtractor();
    }
    extract(source, refDate) {
        if (!refDate)
            refDate = new Date();
        let referenceDate = refDate;
        let tokens = new Array()
            .concat(super.basicRegexMatch(source))
            .concat(super.implicitDate(source))
            .concat(this.durationWithBeforeAndAfter(source, referenceDate));
        let result = utilities_1.Token.mergeAllTokens(tokens, source, this.extractorName);
        return result;
    }
    durationWithBeforeAndAfter(source, refDate) {
        let ret = [];
        let durEx = this.durationExtractor.extract(source, refDate);
        durEx.forEach(er => {
            let pos = er.start + er.length;
            if (pos < source.length) {
                let nextChar = source.substr(pos, 1);
                if (nextChar === '前' || nextChar === '后') {
                    ret.push(new utilities_1.Token(er.start, pos + 1));
                }
            }
        });
        return ret;
    }
}
exports.ChineseDateExtractor = ChineseDateExtractor;
class ChineseDateParserConfiguration {
    getSwiftDay(source) {
        let trimmedSource = source.trim().toLowerCase();
        let swift = 0;
        if (trimmedSource === '今天' || trimmedSource === '今日' || trimmedSource === '最近') {
            swift = 0;
        }
        else if (trimmedSource === '明天' || trimmedSource === '明日') {
            swift = 1;
        }
        else if (trimmedSource === '昨天') {
            swift = -1;
        }
        else if (trimmedSource.endsWith('后天')) {
            swift = 2;
        }
        else if (trimmedSource.endsWith('前天')) {
            swift = -2;
        }
        return swift;
    }
    getSwiftMonth(source) {
        let trimmedSource = source.trim().toLowerCase();
        let swift = 0;
        if (trimmedSource.startsWith(chineseDateTime_1.ChineseDateTime.ParserConfigurationNextMonthToken)) {
            swift = 1;
        }
        else if (trimmedSource.startsWith(chineseDateTime_1.ChineseDateTime.ParserConfigurationLastMonthToken)) {
            swift = -1;
        }
        return swift;
    }
    getSwift(source) {
        return null;
    }
    isCardinalLast(source) {
        return source === chineseDateTime_1.ChineseDateTime.ParserConfigurationLastWeekDayToken;
    }
    constructor() {
        this.dateRegex = [
            recognizers_text_1.RegExpUtility.getSafeRegExp(chineseDateTime_1.ChineseDateTime.DateRegexList1),
            recognizers_text_1.RegExpUtility.getSafeRegExp(chineseDateTime_1.ChineseDateTime.DateRegexList2),
            recognizers_text_1.RegExpUtility.getSafeRegExp(chineseDateTime_1.ChineseDateTime.DateRegexList3),
            recognizers_text_1.RegExpUtility.getSafeRegExp(chineseDateTime_1.ChineseDateTime.DateRegexList4),
            recognizers_text_1.RegExpUtility.getSafeRegExp(chineseDateTime_1.ChineseDateTime.DateRegexList5),
            recognizers_text_1.RegExpUtility.getSafeRegExp(chineseDateTime_1.ChineseDateTime.DateRegexList6),
            recognizers_text_1.RegExpUtility.getSafeRegExp(chineseDateTime_1.ChineseDateTime.DateRegexList7),
            recognizers_text_1.RegExpUtility.getSafeRegExp(chineseDateTime_1.ChineseDateTime.DateRegexList8)
        ];
        this.monthOfYear = chineseDateTime_1.ChineseDateTime.ParserConfigurationMonthOfYear;
        this.dayOfMonth = chineseDateTime_1.ChineseDateTime.ParserConfigurationDayOfMonth;
        this.dayOfWeek = chineseDateTime_1.ChineseDateTime.ParserConfigurationDayOfWeek;
        this.specialDayRegex = recognizers_text_1.RegExpUtility.getSafeRegExp(chineseDateTime_1.ChineseDateTime.SpecialDayRegex);
        this.thisRegex = recognizers_text_1.RegExpUtility.getSafeRegExp(chineseDateTime_1.ChineseDateTime.DateThisRegex);
        this.nextRegex = recognizers_text_1.RegExpUtility.getSafeRegExp(chineseDateTime_1.ChineseDateTime.DateNextRegex);
        this.lastRegex = recognizers_text_1.RegExpUtility.getSafeRegExp(chineseDateTime_1.ChineseDateTime.DateLastRegex);
        this.weekDayRegex = recognizers_text_1.RegExpUtility.getSafeRegExp(chineseDateTime_1.ChineseDateTime.WeekDayRegex);
        this.integerExtractor = new recognizers_text_number_1.ChineseIntegerExtractor();
        this.numberParser = recognizers_text_number_1.AgnosticNumberParserFactory.getParser(recognizers_text_number_1.AgnosticNumberParserType.Number, new recognizers_text_number_1.ChineseNumberParserConfiguration());
    }
}
class ChineseDateParser extends baseDate_1.BaseDateParser {
    constructor() {
        let config = new ChineseDateParserConfiguration();
        super(config);
        this.lunarRegex = recognizers_text_1.RegExpUtility.getSafeRegExp(chineseDateTime_1.ChineseDateTime.LunarRegex);
        this.specialDateRegex = recognizers_text_1.RegExpUtility.getSafeRegExp(chineseDateTime_1.ChineseDateTime.SpecialDate);
        this.tokenNextRegex = recognizers_text_1.RegExpUtility.getSafeRegExp(chineseDateTime_1.ChineseDateTime.DateNextRe);
        this.tokenLastRegex = recognizers_text_1.RegExpUtility.getSafeRegExp(chineseDateTime_1.ChineseDateTime.DateLastRe);
        this.monthMaxDays = [31, 29, 31, 30, 31, 30, 31, 31, 30, 31, 30, 31];
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
                // TODO create test
                innerResult = this.parserDurationWithAgoAndLater(source, referenceDate);
            }
            if (innerResult.success) {
                innerResult.futureResolution = {};
                innerResult.futureResolution[constants_1.TimeTypeConstants.DATE] = utilities_1.FormatUtil.formatDate(innerResult.futureValue);
                innerResult.pastResolution = {};
                innerResult.pastResolution[constants_1.TimeTypeConstants.DATE] = utilities_1.FormatUtil.formatDate(innerResult.pastValue);
                innerResult.isLunar = this.parseLunarCalendar(source);
                resultValue = innerResult;
            }
        }
        let result = new parsers_1.DateTimeParseResult(extractorResult);
        result.value = resultValue;
        result.timexStr = resultValue ? resultValue.timex : '';
        result.resolutionStr = '';
        return result;
    }
    parseLunarCalendar(source) {
        return recognizers_text_1.RegExpUtility.isMatch(this.lunarRegex, source.trim());
    }
    parseBasicRegexMatch(source, referenceDate) {
        let trimmedSource = source.trim();
        let result = new utilities_1.DateTimeResolutionResult();
        this.config.dateRegex.some(regex => {
            let match = recognizers_text_1.RegExpUtility.getMatches(regex, trimmedSource).pop();
            if (match && match.index === 0 && match.length === trimmedSource.length) {
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
        let match = recognizers_text_1.RegExpUtility.getMatches(this.specialDateRegex, trimmedSource).pop();
        if (match && match.length === trimmedSource.length) {
            let day = 0;
            let month = referenceDate.getMonth();
            let year = referenceDate.getFullYear();
            let yearStr = match.groups('thisyear').value;
            let monthStr = match.groups('thismonth').value;
            let dayStr = match.groups('day').value;
            day = this.config.dayOfMonth.get(dayStr);
            let hasYear = !recognizers_text_1.StringUtility.isNullOrEmpty(yearStr);
            let hasMonth = !recognizers_text_1.StringUtility.isNullOrEmpty(monthStr);
            if (hasMonth) {
                if (recognizers_text_1.RegExpUtility.isMatch(this.tokenNextRegex, monthStr)) {
                    month++;
                    if (month === 12) {
                        month = 0;
                        year++;
                    }
                }
                else if (recognizers_text_1.RegExpUtility.isMatch(this.tokenLastRegex, monthStr)) {
                    month--;
                    if (month === -1) {
                        month = 12;
                        year--;
                    }
                }
                if (hasYear) {
                    if (recognizers_text_1.RegExpUtility.isMatch(this.tokenNextRegex, yearStr)) {
                        year++;
                    }
                    else if (recognizers_text_1.RegExpUtility.isMatch(this.tokenLastRegex, yearStr)) {
                        year--;
                    }
                }
            }
            result.timex = utilities_1.FormatUtil.luisDate(hasYear ? year : -1, hasMonth ? month : -1, day);
            let futureDate;
            let pastDate;
            if (day > this.monthMaxDays[month]) {
                futureDate = utilities_1.DateUtils.safeCreateFromMinValue(year, month + 1, day);
                pastDate = utilities_1.DateUtils.safeCreateFromMinValue(year, month - 1, day);
            }
            else {
                futureDate = utilities_1.DateUtils.safeCreateFromMinValue(year, month, day);
                pastDate = utilities_1.DateUtils.safeCreateFromMinValue(year, month, day);
                if (!hasMonth) {
                    if (futureDate < referenceDate)
                        futureDate = utilities_1.DateUtils.addMonths(futureDate, 1);
                    if (pastDate >= referenceDate)
                        pastDate = utilities_1.DateUtils.addMonths(pastDate, -1);
                }
                else if (hasMonth && !hasYear) {
                    if (futureDate < referenceDate)
                        futureDate = utilities_1.DateUtils.addYears(futureDate, 1);
                    if (pastDate >= referenceDate)
                        pastDate = utilities_1.DateUtils.addYears(pastDate, -1);
                }
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
            let value = utilities_1.DateUtils.this(referenceDate, weekday);
            if (weekday === 0)
                weekday = 7;
            if (weekday < referenceDate.getDay())
                value = utilities_1.DateUtils.next(referenceDate, weekday);
            result.timex = 'XXXX-WXX-' + weekday;
            let futureDate = new Date(value);
            let pastDate = new Date(value);
            if (futureDate < referenceDate)
                futureDate = utilities_1.DateUtils.addDays(futureDate, 7);
            if (pastDate >= referenceDate)
                pastDate = utilities_1.DateUtils.addDays(pastDate, -7);
            result.futureValue = futureDate;
            result.pastValue = pastDate;
            result.success = true;
            return result;
        }
        return result;
    }
    matchToDate(match, referenceDate) {
        let result = new utilities_1.DateTimeResolutionResult();
        let yearStr = match.groups('year').value;
        let yearChs = match.groups('yearchs').value;
        let monthStr = match.groups('month').value;
        let dayStr = match.groups('day').value;
        let month = 0;
        let day = 0;
        let year = 0;
        let yearTemp = this.convertChineseYearToNumber(yearChs);
        year = yearTemp === -1 ? 0 : yearTemp;
        if (this.config.monthOfYear.has(monthStr) && this.config.dayOfMonth.has(dayStr)) {
            month = this.getMonthOfYear(monthStr);
            day = this.getDayOfMonth(dayStr);
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
    convertChineseYearToNumber(source) {
        let year = 0;
        let er = this.config.integerExtractor.extract(source).pop();
        if (er && er.type === recognizers_text_number_2.Constants.SYS_NUM_INTEGER) {
            year = Number.parseInt(this.config.numberParser.parse(er).value);
        }
        if (year < 10) {
            year = 0;
            for (let i = 0; i < source.length; i++) {
                let char = source.charAt(i);
                year *= 10;
                let er = this.config.integerExtractor.extract(char).pop();
                if (er && er.type === recognizers_text_number_2.Constants.SYS_NUM_INTEGER) {
                    year += Number.parseInt(this.config.numberParser.parse(er).value);
                }
            }
        }
        return year < 10 ? -1 : year;
    }
    getMonthOfYear(source) {
        let month = this.config.monthOfYear.get(source) > 12
            ? this.config.monthOfYear.get(source) % 12
            : this.config.monthOfYear.get(source);
        return month - 1;
    }
    getDayOfMonth(source) {
        return this.config.dayOfMonth.get(source) > 31
            ? this.config.dayOfMonth.get(source) % 31
            : this.config.dayOfMonth.get(source);
    }
}
exports.ChineseDateParser = ChineseDateParser;
//# sourceMappingURL=dateConfiguration.js.map