"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const recognizers_text_1 = require("recognizers-text");
const constants_1 = require("./constants");
const utilities_1 = require("./utilities");
const parsers_1 = require("./parsers");
class BaseDatePeriodExtractor {
    constructor(config) {
        this.extractorName = constants_1.Constants.SYS_DATETIME_DATEPERIOD;
        this.config = config;
    }
    extract(source, refDate) {
        if (!refDate)
            refDate = new Date();
        let referenceDate = refDate;
        let tokens = new Array();
        tokens = tokens.concat(this.matchSimpleCases(source));
        tokens = tokens.concat(this.mergeTwoTimePoints(source, referenceDate));
        tokens = tokens.concat(this.matchDuration(source, referenceDate));
        tokens = tokens.concat(this.singleTimePointWithPatterns(source, referenceDate));
        let result = utilities_1.Token.mergeAllTokens(tokens, source, this.extractorName);
        return result;
    }
    matchSimpleCases(source) {
        let tokens = new Array();
        this.config.simpleCasesRegexes.forEach(regexp => {
            recognizers_text_1.RegExpUtility.getMatches(regexp, source).forEach(match => {
                tokens.push(new utilities_1.Token(match.index, match.index + match.length));
            });
        });
        return tokens;
    }
    mergeTwoTimePoints(source, refDate) {
        let tokens = new Array();
        let er = this.config.datePointExtractor.extract(source, refDate);
        if (er.length <= 1) {
            return tokens;
        }
        let idx = 0;
        while (idx < er.length - 1) {
            let middleBegin = er[idx].start + (er[idx].length || 0);
            let middleEnd = er[idx + 1].start || 0;
            if (middleBegin >= middleEnd) {
                idx++;
                continue;
            }
            let middleStr = source.substr(middleBegin, middleEnd - middleBegin).trim().toLowerCase();
            let match = recognizers_text_1.RegExpUtility.getMatches(this.config.tillRegex, middleStr);
            if (match && match.length > 0 && match[0].index === 0 && match[0].length === middleStr.length) {
                let periodBegin = er[idx].start || 0;
                let periodEnd = (er[idx + 1].start || 0) + (er[idx + 1].length || 0);
                let beforeStr = source.substring(0, periodBegin).trim().toLowerCase();
                let fromTokenIndex = this.config.getFromTokenIndex(beforeStr);
                let betweenTokenIndex = this.config.getBetweenTokenIndex(beforeStr);
                if (fromTokenIndex.matched || betweenTokenIndex.matched) {
                    periodBegin = fromTokenIndex.matched ? fromTokenIndex.index : betweenTokenIndex.index;
                }
                tokens.push(new utilities_1.Token(periodBegin, periodEnd));
                idx += 2;
                continue;
            }
            if (this.config.hasConnectorToken(middleStr)) {
                let periodBegin = er[idx].start || 0;
                let periodEnd = (er[idx + 1].start || 0) + (er[idx + 1].length || 0);
                let beforeStr = source.substring(0, periodBegin).trim().toLowerCase();
                let betweenTokenIndex = this.config.getBetweenTokenIndex(beforeStr);
                if (betweenTokenIndex.matched) {
                    periodBegin = betweenTokenIndex.index;
                    tokens.push(new utilities_1.Token(periodBegin, periodEnd));
                    idx += 2;
                    continue;
                }
            }
            idx++;
        }
        return tokens;
    }
    matchDuration(source, refDate) {
        let tokens = new Array();
        let durations = new Array();
        this.config.durationExtractor.extract(source, refDate).forEach(durationEx => {
            let match = recognizers_text_1.RegExpUtility.getMatches(this.config.dateUnitRegex, durationEx.text).pop();
            if (match) {
                durations.push(new utilities_1.Token(durationEx.start, durationEx.start + durationEx.length));
            }
        });
        durations.forEach(duration => {
            let beforeStr = source.substring(0, duration.start).toLowerCase();
            if (recognizers_text_1.StringUtility.isNullOrWhitespace(beforeStr))
                return;
            let match = recognizers_text_1.RegExpUtility.getMatches(this.config.pastRegex, beforeStr).pop();
            if (this.matchRegexInPrefix(beforeStr, match)) {
                tokens.push(new utilities_1.Token(match.index, duration.end));
                return;
            }
            match = recognizers_text_1.RegExpUtility.getMatches(this.config.futureRegex, beforeStr).pop();
            if (this.matchRegexInPrefix(beforeStr, match)) {
                tokens.push(new utilities_1.Token(match.index, duration.end));
                return;
            }
            match = recognizers_text_1.RegExpUtility.getMatches(this.config.inConnectorRegex, beforeStr).pop();
            if (this.matchRegexInPrefix(beforeStr, match)) {
                let rangeStr = source.substr(duration.start, duration.length);
                let rangeMatch = recognizers_text_1.RegExpUtility.getMatches(this.config.rangeUnitRegex, rangeStr).pop();
                if (rangeMatch) {
                    tokens.push(new utilities_1.Token(match.index, duration.end));
                }
                return;
            }
        });
        return tokens;
    }
    singleTimePointWithPatterns(source, refDate) {
        let tokens = new Array();
        let ers = this.config.datePointExtractor.extract(source, refDate);
        if (ers.length < 1)
            return tokens;
        ers.forEach(er => {
            if (er.start && er.length) {
                let beforeStr = source.substring(0, er.start);
                tokens = tokens
                    .concat(this.getTokenForRegexMatching(beforeStr, this.config.weekOfRegex, er))
                    .concat(this.getTokenForRegexMatching(beforeStr, this.config.monthOfRegex, er));
            }
        });
        return tokens;
    }
    getTokenForRegexMatching(source, regexp, er) {
        let tokens = new Array();
        let match = recognizers_text_1.RegExpUtility.getMatches(regexp, source).shift();
        if (match && source.trim().endsWith(match.value.trim())) {
            let startIndex = source.lastIndexOf(match.value);
            tokens.push(new utilities_1.Token(startIndex, er.start + er.length));
        }
        return tokens;
    }
    matchRegexInPrefix(source, match) {
        return (match && recognizers_text_1.StringUtility.isNullOrWhitespace(source.substring(match.index + match.length)));
    }
}
exports.BaseDatePeriodExtractor = BaseDatePeriodExtractor;
class BaseDatePeriodParser {
    constructor(config, inclusiveEndPeriod = false) {
        this.parserName = constants_1.Constants.SYS_DATETIME_DATEPERIOD;
        this.weekOfComment = 'WeekOf';
        this.monthOfComment = 'MonthOf';
        this.config = config;
        this.inclusiveEndPeriod = inclusiveEndPeriod;
    }
    parse(extractorResult, referenceDate) {
        if (!referenceDate)
            referenceDate = new Date();
        let resultValue;
        if (extractorResult.type === this.parserName) {
            let source = extractorResult.text.trim().toLowerCase();
            let innerResult = this.parseMonthWithYear(source, referenceDate);
            if (!innerResult.success) {
                innerResult = this.parseSimpleCases(source, referenceDate);
            }
            if (!innerResult.success) {
                innerResult = this.parseOneWordPeriod(source, referenceDate);
            }
            if (!innerResult.success) {
                innerResult = this.mergeTwoTimePoints(source, referenceDate);
            }
            if (!innerResult.success) {
                innerResult = this.parseYear(source, referenceDate);
            }
            if (!innerResult.success) {
                innerResult = this.parseWeekOfMonth(source, referenceDate);
            }
            if (!innerResult.success) {
                innerResult = this.parseWeekOfYear(source, referenceDate);
            }
            if (!innerResult.success) {
                innerResult = this.parseQuarter(source, referenceDate);
            }
            if (!innerResult.success) {
                innerResult = this.parseSeason(source, referenceDate);
            }
            if (!innerResult.success) {
                innerResult = this.parseWhichWeek(source, referenceDate);
            }
            if (!innerResult.success) {
                innerResult = this.parseWeekOfDate(source, referenceDate);
            }
            if (!innerResult.success) {
                innerResult = this.parseMonthOfDate(source, referenceDate);
            }
            // parse duration should be at the end since it will extract "the last week" from "the last week of July"
            if (!innerResult.success) {
                innerResult = this.parseDuration(source, referenceDate);
            }
            if (innerResult.success) {
                if (innerResult.futureValue && innerResult.pastValue) {
                    innerResult.futureResolution = {};
                    innerResult.futureResolution[constants_1.TimeTypeConstants.START_DATE] = utilities_1.FormatUtil.formatDate(innerResult.futureValue[0]);
                    innerResult.futureResolution[constants_1.TimeTypeConstants.END_DATE] = utilities_1.FormatUtil.formatDate(innerResult.futureValue[1]);
                    innerResult.pastResolution = {};
                    innerResult.pastResolution[constants_1.TimeTypeConstants.START_DATE] = utilities_1.FormatUtil.formatDate(innerResult.pastValue[0]);
                    innerResult.pastResolution[constants_1.TimeTypeConstants.END_DATE] = utilities_1.FormatUtil.formatDate(innerResult.pastValue[1]);
                }
                else {
                    innerResult.futureResolution = {};
                    innerResult.pastResolution = {};
                }
                resultValue = innerResult;
            }
        }
        let result = new parsers_1.DateTimeParseResult(extractorResult);
        result.value = resultValue;
        result.timexStr = resultValue ? resultValue.timex : '';
        result.resolutionStr = '';
        return result;
    }
    parseMonthWithYear(source, referenceDate) {
        let trimmedSource = source.trim().toLowerCase();
        let result = new utilities_1.DateTimeResolutionResult();
        let match = recognizers_text_1.RegExpUtility.getMatches(this.config.monthWithYear, trimmedSource).pop();
        if (!match) {
            match = recognizers_text_1.RegExpUtility.getMatches(this.config.monthNumWithYear, trimmedSource).pop();
        }
        if (!match || match.length !== trimmedSource.length)
            return result;
        let monthStr = match.groups('month').value;
        let yearStr = match.groups('year').value;
        let orderStr = match.groups('order').value;
        let month = this.config.monthOfYear.get(monthStr) - 1;
        let year = Number.parseInt(yearStr, 10);
        if (!year || isNaN(year)) {
            let swift = this.config.getSwiftYear(orderStr);
            if (swift < -1)
                return result;
            year = referenceDate.getFullYear() + swift;
        }
        let beginDate = utilities_1.DateUtils.safeCreateFromValue(utilities_1.DateUtils.minValue(), year, month, 1);
        let endDate = utilities_1.DateUtils.addDays(utilities_1.DateUtils.addMonths(beginDate, 1), this.inclusiveEndPeriod ? -1 : 0);
        result.futureValue = [beginDate, endDate];
        result.pastValue = [beginDate, endDate];
        result.timex = `${utilities_1.FormatUtil.toString(year, 4)}-${utilities_1.FormatUtil.toString(month + 1, 2)}`;
        result.success = true;
        return result;
    }
    getMatchSimpleCase(source) {
        let match = recognizers_text_1.RegExpUtility.getMatches(this.config.monthFrontBetweenRegex, source).pop();
        if (!match) {
            match = recognizers_text_1.RegExpUtility.getMatches(this.config.betweenRegex, source).pop();
        }
        if (!match) {
            match = recognizers_text_1.RegExpUtility.getMatches(this.config.monthFrontSimpleCasesRegex, source).pop();
        }
        if (!match) {
            match = recognizers_text_1.RegExpUtility.getMatches(this.config.simpleCasesRegex, source).pop();
        }
        return match;
    }
    parseSimpleCases(source, referenceDate) {
        let result = new utilities_1.DateTimeResolutionResult();
        let year = referenceDate.getFullYear();
        let month = referenceDate.getMonth();
        let noYear = false;
        let match = this.getMatchSimpleCase(source);
        if (!match || match.index !== 0 || match.length !== source.length)
            return result;
        let days = match.groups('day');
        let beginDay = this.config.dayOfMonth.get(days.captures[0]);
        let endDay = this.config.dayOfMonth.get(days.captures[1]);
        let monthStr = match.groups('month').value;
        if (!recognizers_text_1.StringUtility.isNullOrEmpty(monthStr)) {
            month = this.config.monthOfYear.get(monthStr) - 1;
            noYear = true;
        }
        else {
            monthStr = match.groups('relmonth').value;
            month += this.config.getSwiftDayOrMonth(monthStr);
            if (month < 0) {
                month = 0;
                year--;
            }
            else if (month > 11) {
                month = 11;
                year++;
            }
        }
        let beginDateLuis = utilities_1.FormatUtil.luisDate(this.config.isFuture(monthStr) ? year : -1, month, beginDay);
        let endDateLuis = utilities_1.FormatUtil.luisDate(this.config.isFuture(monthStr) ? year : -1, month, endDay);
        let yearStr = match.groups('year').value;
        if (!recognizers_text_1.StringUtility.isNullOrEmpty(yearStr)) {
            year = Number.parseInt(yearStr, 10);
            noYear = false;
        }
        let futureYear = year;
        let pastYear = year;
        let startDate = utilities_1.DateUtils.safeCreateFromValue(utilities_1.DateUtils.minValue(), year, month, beginDay);
        if (noYear && startDate < referenceDate)
            futureYear++;
        if (noYear && startDate >= referenceDate)
            pastYear--;
        result.timex = `(${beginDateLuis},${endDateLuis},P${endDay - beginDay}D)`;
        result.futureValue = [
            utilities_1.DateUtils.safeCreateFromValue(utilities_1.DateUtils.minValue(), futureYear, month, beginDay),
            utilities_1.DateUtils.safeCreateFromValue(utilities_1.DateUtils.minValue(), futureYear, month, endDay),
        ];
        result.pastValue = [
            utilities_1.DateUtils.safeCreateFromValue(utilities_1.DateUtils.minValue(), pastYear, month, beginDay),
            utilities_1.DateUtils.safeCreateFromValue(utilities_1.DateUtils.minValue(), pastYear, month, endDay),
        ];
        result.success = true;
        return result;
    }
    parseOneWordPeriod(source, referenceDate) {
        let result = new utilities_1.DateTimeResolutionResult();
        let year = referenceDate.getFullYear();
        let month = referenceDate.getMonth();
        let earlyPrefix = false;
        let latePrefix = false;
        if (this.config.isYearToDate(source)) {
            result.timex = utilities_1.FormatUtil.toString(year, 4);
            result.futureValue = [utilities_1.DateUtils.safeCreateFromValue(utilities_1.DateUtils.minValue(), year, 0, 1), referenceDate];
            result.pastValue = [utilities_1.DateUtils.safeCreateFromValue(utilities_1.DateUtils.minValue(), year, 0, 1), referenceDate];
            result.success = true;
            return result;
        }
        if (this.config.isMonthToDate(source)) {
            result.timex = `${utilities_1.FormatUtil.toString(year, 4)}-${utilities_1.FormatUtil.toString(month + 1, 2)}`;
            result.futureValue = [utilities_1.DateUtils.safeCreateFromValue(utilities_1.DateUtils.minValue(), year, month, 1), referenceDate];
            result.pastValue = [utilities_1.DateUtils.safeCreateFromValue(utilities_1.DateUtils.minValue(), year, month, 1), referenceDate];
            result.success = true;
            return result;
        }
        let futureYear = year;
        let pastYear = year;
        let trimedText = source.trim().toLowerCase();
        let match = recognizers_text_1.RegExpUtility.getMatches(this.config.oneWordPeriodRegex, trimedText).pop();
        if (!(match && match.index == 0 && match.length == trimedText.length)) {
            match = recognizers_text_1.RegExpUtility.getMatches(this.config.laterEarlyPeriodRegex, trimedText).pop();
        }
        if (!match || match.index !== 0 || match.length !== trimedText.length)
            return result;
        if (match.groups("EarlyPrefix").value) {
            earlyPrefix = true;
            trimedText = match.groups("suffix").value;
        }
        if (match.groups("LatePrefix").value) {
            latePrefix = true;
            trimedText = match.groups("suffix").value;
        }
        let monthStr = match.groups('month').value;
        if (!recognizers_text_1.StringUtility.isNullOrEmpty(monthStr)) {
            let swift = this.config.getSwiftYear(trimedText);
            month = this.config.monthOfYear.get(monthStr) - 1;
            if (swift >= -1) {
                result.timex = `${utilities_1.FormatUtil.toString(year + swift, 4)}-${utilities_1.FormatUtil.toString(month + 1, 2)}`;
                year += swift;
                futureYear = year;
                pastYear = year;
            }
            else {
                result.timex = `XXXX-${utilities_1.FormatUtil.toString(month + 1, 2)}`;
                if (month < referenceDate.getMonth())
                    futureYear++;
                if (month >= referenceDate.getMonth())
                    pastYear--;
            }
        }
        else {
            let swift = this.config.getSwiftDayOrMonth(trimedText);
            if (this.config.isWeekOnly(trimedText)) {
                let monday = utilities_1.DateUtils.addDays(utilities_1.DateUtils.this(referenceDate, utilities_1.DayOfWeek.Monday), 7 * swift);
                result.timex = `${utilities_1.FormatUtil.toString(monday.getFullYear(), 4)}-W${utilities_1.FormatUtil.toString(utilities_1.DateUtils.getWeekNumber(monday).weekNo, 2)}`;
                var beginDate = utilities_1.DateUtils.addDays(utilities_1.DateUtils.this(referenceDate, utilities_1.DayOfWeek.Monday), 7 * swift);
                var endDate = this.inclusiveEndPeriod
                    ? utilities_1.DateUtils.addDays(utilities_1.DateUtils.this(referenceDate, utilities_1.DayOfWeek.Sunday), 7 * swift)
                    : utilities_1.DateUtils.addDays(utilities_1.DateUtils.addDays(utilities_1.DateUtils.this(referenceDate, utilities_1.DayOfWeek.Sunday), 7 * swift), 1);
                if (earlyPrefix) {
                    endDate = this.inclusiveEndPeriod
                        ? utilities_1.DateUtils.addDays(utilities_1.DateUtils.this(referenceDate, utilities_1.DayOfWeek.Wednesday), 7 * swift)
                        : utilities_1.DateUtils.addDays(utilities_1.DateUtils.addDays(utilities_1.DateUtils.this(referenceDate, utilities_1.DayOfWeek.Wednesday), 7 * swift), 1);
                }
                if (latePrefix) {
                    beginDate = utilities_1.DateUtils.addDays(utilities_1.DateUtils.this(referenceDate, utilities_1.DayOfWeek.Thursday), 7 * swift);
                }
                result.futureValue = [beginDate, endDate];
                result.pastValue = [beginDate, endDate];
                result.success = true;
                return result;
            }
            if (this.config.isWeekend(trimedText)) {
                let beginDate = utilities_1.DateUtils.addDays(utilities_1.DateUtils.this(referenceDate, utilities_1.DayOfWeek.Saturday), 7 * swift);
                let endDate = utilities_1.DateUtils.addDays(utilities_1.DateUtils.this(referenceDate, utilities_1.DayOfWeek.Sunday), (7 * swift) + (this.inclusiveEndPeriod ? 0 : 1));
                result.timex = `${utilities_1.FormatUtil.toString(beginDate.getFullYear(), 4)}-W${utilities_1.FormatUtil.toString(utilities_1.DateUtils.getWeekNumber(beginDate).weekNo, 2)}-WE`;
                result.futureValue = [beginDate, endDate];
                result.pastValue = [beginDate, endDate];
                result.success = true;
                return result;
            }
            if (this.config.isMonthOnly(trimedText)) {
                let tempDate = new Date(referenceDate);
                tempDate.setMonth(referenceDate.getMonth() + swift);
                month = tempDate.getMonth();
                year = tempDate.getFullYear();
                result.timex = `${utilities_1.FormatUtil.toString(year, 4)}-${utilities_1.FormatUtil.toString(month + 1, 2)}`;
                futureYear = year;
                pastYear = year;
            }
            else if (this.config.isYearOnly(trimedText)) {
                let tempDate = new Date(referenceDate);
                tempDate.setFullYear(referenceDate.getFullYear() + swift);
                year = tempDate.getFullYear();
                var beginDate = utilities_1.DateUtils.safeCreateFromMinValue(year, 0, 1);
                var endDate = this.inclusiveEndPeriod
                    ? utilities_1.DateUtils.safeCreateFromMinValue(year, 11, 31)
                    : utilities_1.DateUtils.addDays(utilities_1.DateUtils.safeCreateFromMinValue(year, 11, 31), 1);
                if (earlyPrefix) {
                    endDate = this.inclusiveEndPeriod
                        ? utilities_1.DateUtils.safeCreateFromMinValue(year, 5, 30)
                        : utilities_1.DateUtils.addDays(utilities_1.DateUtils.safeCreateFromMinValue(year, 5, 30), 1);
                }
                if (latePrefix) {
                    beginDate = utilities_1.DateUtils.safeCreateFromMinValue(year, 6, 1);
                }
                result.timex = utilities_1.FormatUtil.toString(year, 4);
                result.futureValue = [beginDate, endDate];
                result.pastValue = [beginDate, endDate];
                result.success = true;
                return result;
            }
        }
        let futureStart = utilities_1.DateUtils.safeCreateFromMinValue(futureYear, month, 1);
        let futureEnd = this.inclusiveEndPeriod
            ? utilities_1.DateUtils.addDays(utilities_1.DateUtils.addMonths(utilities_1.DateUtils.safeCreateFromMinValue(futureYear, month, 1), 1), -1)
            : utilities_1.DateUtils.addMonths(utilities_1.DateUtils.safeCreateFromMinValue(futureYear, month, 1), 1);
        let pastStart = utilities_1.DateUtils.safeCreateFromMinValue(pastYear, month, 1);
        let pastEnd = this.inclusiveEndPeriod
            ? utilities_1.DateUtils.addDays(utilities_1.DateUtils.addMonths(utilities_1.DateUtils.safeCreateFromMinValue(pastYear, month, 1), 1), -1)
            : utilities_1.DateUtils.addMonths(utilities_1.DateUtils.safeCreateFromMinValue(pastYear, month, 1), 1);
        if (earlyPrefix) {
            futureEnd = this.inclusiveEndPeriod
                ? utilities_1.DateUtils.safeCreateFromMinValue(futureYear, month, 15)
                : utilities_1.DateUtils.addDays(utilities_1.DateUtils.safeCreateFromMinValue(futureYear, month, 15), 1);
            pastEnd = this.inclusiveEndPeriod
                ? utilities_1.DateUtils.safeCreateFromMinValue(pastYear, month, 15)
                : utilities_1.DateUtils.addDays(utilities_1.DateUtils.safeCreateFromMinValue(pastYear, month, 15), 1);
        }
        else if (latePrefix) {
            futureStart = utilities_1.DateUtils.safeCreateFromMinValue(futureYear, month, 16);
            pastStart = utilities_1.DateUtils.safeCreateFromMinValue(pastYear, month, 16);
        }
        result.futureValue = [futureStart, futureEnd];
        result.pastValue = [pastStart, pastEnd];
        result.success = true;
        return result;
    }
    mergeTwoTimePoints(source, referenceDate) {
        let trimmedSource = source.trim();
        let result = new utilities_1.DateTimeResolutionResult();
        let ers = this.config.dateExtractor.extract(trimmedSource, referenceDate);
        if (!ers || ers.length < 2) {
            ers = this.config.dateExtractor.extract(this.config.tokenBeforeDate + trimmedSource, referenceDate)
                .map(er => {
                er.start -= this.config.tokenBeforeDate.length;
                return er;
            });
            if (!ers || ers.length < 2)
                return result;
        }
        let match = recognizers_text_1.RegExpUtility.getMatches(this.config.weekWithWeekDayRangeRegex, source).pop();
        let weekPrefix = null;
        if (match) {
            weekPrefix = match.groups("week").value;
        }
        if (!recognizers_text_1.StringUtility.isNullOrWhitespace(weekPrefix)) {
            ers[0].text = weekPrefix + " " + ers[0].text;
            ers[1].text = weekPrefix + " " + ers[1].text;
        }
        let prs = ers.map(er => this.config.dateParser.parse(er, referenceDate)).filter(pr => pr);
        if (prs.length < 2)
            return result;
        let prBegin = prs[0];
        let prEnd = prs[1];
        let futureBegin = prBegin.value.futureValue;
        let futureEnd = prEnd.value.futureValue;
        let pastBegin = prBegin.value.pastValue;
        let pastEnd = prEnd.value.pastValue;
        result.subDateTimeEntities = prs;
        result.timex = `(${prBegin.timexStr},${prEnd.timexStr},P${utilities_1.DateUtils.diffDays(futureEnd, futureBegin)}D)`;
        result.futureValue = [futureBegin, futureEnd];
        result.pastValue = [pastBegin, pastEnd];
        result.success = true;
        return result;
    }
    parseYear(source, referenceDate) {
        let trimmedSource = source.trim();
        let result = new utilities_1.DateTimeResolutionResult();
        let match = recognizers_text_1.RegExpUtility.getMatches(this.config.yearRegex, trimmedSource).pop();
        if (!match || match.length !== trimmedSource.length)
            return result;
        let year = Number.parseInt(match.value, 10);
        let beginDate = utilities_1.DateUtils.safeCreateFromValue(utilities_1.DateUtils.minValue(), year, 0, 1);
        let endDate = utilities_1.DateUtils.addDays(utilities_1.DateUtils.safeCreateFromValue(utilities_1.DateUtils.minValue(), year + 1, 0, 1), this.inclusiveEndPeriod ? -1 : 0);
        result.timex = utilities_1.FormatUtil.toString(year, 4);
        result.futureValue = [beginDate, endDate];
        result.pastValue = [beginDate, endDate];
        result.success = true;
        return result;
    }
    parseDuration(source, referenceDate) {
        let result = new utilities_1.DateTimeResolutionResult();
        let ers = this.config.durationExtractor.extract(source, referenceDate);
        let beginDate = new Date(referenceDate);
        let endDate = new Date(referenceDate);
        let restNowSunday = false;
        let durationTimex = '';
        if (ers.length === 1) {
            let pr = this.config.durationParser.parse(ers[0]);
            if (pr === null)
                return result;
            let beforeStr = source.substr(0, pr.start).trim();
            let mod;
            let durationResult = pr.value;
            if (recognizers_text_1.StringUtility.isNullOrEmpty(durationResult.timex))
                return result;
            let prefixMatch = recognizers_text_1.RegExpUtility.getMatches(this.config.pastRegex, beforeStr).pop();
            if (prefixMatch) {
                mod = constants_1.TimeTypeConstants.beforeMod;
                beginDate = this.getSwiftDate(endDate, durationResult.timex, false);
            }
            prefixMatch = recognizers_text_1.RegExpUtility.getMatches(this.config.futureRegex, beforeStr).pop();
            if (prefixMatch && prefixMatch.length === beforeStr.length) {
                mod = constants_1.TimeTypeConstants.afterMod;
                // for future the beginDate should add 1 first
                beginDate = new Date(referenceDate.getFullYear(), referenceDate.getMonth(), referenceDate.getDate() + 1);
                endDate = this.getSwiftDate(beginDate, durationResult.timex, true);
            }
            prefixMatch = recognizers_text_1.RegExpUtility.getMatches(this.config.inConnectorRegex, beforeStr).pop();
            if (prefixMatch && prefixMatch.length === beforeStr.length) {
                mod = constants_1.TimeTypeConstants.afterMod;
                beginDate = new Date(referenceDate.getFullYear(), referenceDate.getMonth(), referenceDate.getDate() + 1);
                endDate = this.getSwiftDate(beginDate, durationResult.timex, true);
                let unit = durationResult.timex.substr(durationResult.timex.length - 1);
                durationResult.timex = `P1${unit}`;
                beginDate = this.getSwiftDate(endDate, durationResult.timex, false);
            }
            if (mod) {
                pr.value.mod = mod;
            }
            durationTimex = durationResult.timex;
            result.subDateTimeEntities = [pr];
        }
        // parse rest of
        let match = recognizers_text_1.RegExpUtility.getMatches(this.config.restOfDateRegex, source).pop();
        if (match) {
            let diffDays = 0;
            let durationStr = match.groups('duration').value;
            let durationUnit = this.config.unitMap.get(durationStr);
            switch (durationUnit) {
                case 'W':
                    diffDays = 7 - ((beginDate.getDay() === 0) ? 7 : beginDate.getDay());
                    endDate = utilities_1.DateUtils.addDays(referenceDate, diffDays);
                    restNowSunday = (diffDays === 0);
                    break;
                case 'MON':
                    endDate = utilities_1.DateUtils.safeCreateFromMinValue(beginDate.getFullYear(), beginDate.getMonth(), 1);
                    endDate.setMonth(beginDate.getMonth() + 1);
                    endDate.setDate(endDate.getDate() - 1);
                    diffDays = endDate.getDate() - beginDate.getDate() + 1;
                    break;
                case 'Y':
                    endDate = utilities_1.DateUtils.safeCreateFromMinValue(beginDate.getFullYear(), 11, 1);
                    endDate.setMonth(endDate.getMonth() + 1);
                    endDate.setDate(endDate.getDate() - 1);
                    diffDays = utilities_1.DateUtils.dayOfYear(endDate) - utilities_1.DateUtils.dayOfYear(beginDate) + 1;
                    break;
            }
            durationTimex = `P${diffDays}D`;
        }
        if (beginDate.getTime() !== endDate.getTime() || restNowSunday) {
            endDate = utilities_1.DateUtils.addDays(endDate, this.inclusiveEndPeriod ? -1 : 0);
            result.timex = `(${utilities_1.FormatUtil.luisDateFromDate(beginDate)},${utilities_1.FormatUtil.luisDateFromDate(endDate)},${durationTimex})`;
            result.futureValue = [beginDate, endDate];
            result.pastValue = [beginDate, endDate];
            result.success = true;
        }
        return result;
    }
    getSwiftDate(date, timex, isPositiveSwift) {
        let result = new Date(date);
        let numStr = timex.replace('P', '').substr(0, timex.length - 2);
        let unitStr = timex.substr(timex.length - 1);
        let swift = Number.parseInt(numStr, 10) || 0;
        if (swift === 0)
            return result;
        if (!isPositiveSwift)
            swift *= -1;
        switch (unitStr) {
            case 'D':
                result.setDate(date.getDate() + swift);
                break;
            case 'W':
                result.setDate(date.getDate() + (7 * swift));
                break;
            case 'M':
                result.setMonth(date.getMonth() + swift);
                break;
            case 'Y':
                result.setFullYear(date.getFullYear() + swift);
                break;
        }
        return result;
    }
    parseWeekOfMonth(source, referenceDate) {
        let result = new utilities_1.DateTimeResolutionResult();
        let match = recognizers_text_1.RegExpUtility.getMatches(this.config.weekOfMonthRegex, source).pop();
        if (!match || match.length !== source.length)
            return result;
        let cardinalStr = match.groups('cardinal').value;
        let monthStr = match.groups('month').value;
        let month = referenceDate.getMonth();
        let year = referenceDate.getFullYear();
        let noYear = false;
        let cardinal = this.config.isLastCardinal(cardinalStr) ? 5
            : this.config.cardinalMap.get(cardinalStr);
        if (recognizers_text_1.StringUtility.isNullOrEmpty(monthStr)) {
            let swift = this.config.getSwiftDayOrMonth(source);
            let tempDate = new Date(referenceDate);
            tempDate.setMonth(referenceDate.getMonth() + swift);
            month = tempDate.getMonth();
            year = tempDate.getFullYear();
        }
        else {
            month = this.config.monthOfYear.get(monthStr) - 1;
            noYear = true;
        }
        return this.getWeekOfMonth(cardinal, month, year, referenceDate, noYear);
    }
    getWeekOfMonth(cardinal, month, year, referenceDate, noYear) {
        let result = new utilities_1.DateTimeResolutionResult();
        let seedDate = this.computeDate(cardinal, 1, month, year);
        if (seedDate.getMonth() !== month) {
            cardinal--;
            seedDate.setDate(seedDate.getDate() - 7);
        }
        let futureDate = new Date(seedDate);
        let pastDate = new Date(seedDate);
        if (noYear && futureDate < referenceDate) {
            futureDate = this.computeDate(cardinal, 1, month, year + 1);
            if (futureDate.getMonth() !== month) {
                futureDate.setDate(futureDate.getDate() - 7);
            }
        }
        if (noYear && pastDate >= referenceDate) {
            pastDate = this.computeDate(cardinal, 1, month, year - 1);
            if (pastDate.getMonth() !== month) {
                pastDate.setDate(pastDate.getDate() - 7);
            }
        }
        result.timex = noYear ?
            `XXXX-${utilities_1.FormatUtil.toString(month + 1, 2)}-W${utilities_1.FormatUtil.toString(cardinal, 2)}` :
            `${utilities_1.FormatUtil.toString(year, 4)}-${utilities_1.FormatUtil.toString(month + 1, 2)}-W${utilities_1.FormatUtil.toString(cardinal, 2)}`;
        result.futureValue = [futureDate, utilities_1.DateUtils.addDays(futureDate, this.inclusiveEndPeriod ? 6 : 7)];
        result.pastValue = [pastDate, utilities_1.DateUtils.addDays(pastDate, this.inclusiveEndPeriod ? 6 : 7)];
        result.success = true;
        return result;
    }
    parseWeekOfYear(source, referenceDate) {
        let result = new utilities_1.DateTimeResolutionResult();
        let match = recognizers_text_1.RegExpUtility.getMatches(this.config.weekOfYearRegex, source).pop();
        if (!match || match.length !== source.length)
            return result;
        let cardinalStr = match.groups('cardinal').value;
        let yearStr = match.groups('year').value;
        let orderStr = match.groups('order').value;
        let year = Number.parseInt(yearStr, 10);
        if (isNaN(year)) {
            let swift = this.config.getSwiftYear(orderStr);
            if (swift < -1)
                return result;
            year = referenceDate.getFullYear() + swift;
        }
        let targetWeekMonday;
        if (this.config.isLastCardinal(cardinalStr)) {
            let lastDay = utilities_1.DateUtils.safeCreateFromMinValue(year, 11, 31);
            let lastDayWeekMonday = utilities_1.DateUtils.this(lastDay, utilities_1.DayOfWeek.Monday);
            let weekNum = utilities_1.DateUtils.getWeekNumber(lastDay).weekNo;
            if (weekNum === 1) {
                lastDayWeekMonday = utilities_1.DateUtils.this(utilities_1.DateUtils.addDays(lastDay, -7), utilities_1.DayOfWeek.Monday);
            }
            targetWeekMonday = lastDayWeekMonday;
            weekNum = utilities_1.DateUtils.getWeekNumber(targetWeekMonday).weekNo;
            result.timex = `${utilities_1.FormatUtil.toString(year, 4)}-${utilities_1.FormatUtil.toString(targetWeekMonday.getMonth() + 1, 2)}-W${utilities_1.FormatUtil.toString(weekNum, 2)}`;
        }
        else {
            let cardinal = this.config.cardinalMap.get(cardinalStr);
            let firstDay = utilities_1.DateUtils.safeCreateFromMinValue(year, 0, 1);
            let firstDayWeekMonday = utilities_1.DateUtils.this(firstDay, utilities_1.DayOfWeek.Monday);
            let weekNum = utilities_1.DateUtils.getWeekNumber(firstDay).weekNo;
            if (weekNum !== 1) {
                firstDayWeekMonday = utilities_1.DateUtils.this(utilities_1.DateUtils.addDays(firstDay, 7), utilities_1.DayOfWeek.Monday);
            }
            targetWeekMonday = utilities_1.DateUtils.addDays(firstDayWeekMonday, 7 * (cardinal - 1));
            let targetWeekSunday = utilities_1.DateUtils.this(targetWeekMonday, utilities_1.DayOfWeek.Sunday);
            result.timex = `${utilities_1.FormatUtil.toString(year, 4)}-${utilities_1.FormatUtil.toString(targetWeekSunday.getMonth() + 1, 2)}-W${utilities_1.FormatUtil.toString(cardinal, 2)}`;
        }
        result.futureValue = [targetWeekMonday, utilities_1.DateUtils.addDays(targetWeekMonday, this.inclusiveEndPeriod ? 6 : 7)];
        result.pastValue = [targetWeekMonday, utilities_1.DateUtils.addDays(targetWeekMonday, this.inclusiveEndPeriod ? 6 : 7)];
        result.success = true;
        return result;
    }
    parseQuarter(source, referenceDate) {
        let result = new utilities_1.DateTimeResolutionResult();
        let match = recognizers_text_1.RegExpUtility.getMatches(this.config.quarterRegex, source).pop();
        if (!match || match.length !== source.length) {
            match = recognizers_text_1.RegExpUtility.getMatches(this.config.quarterRegexYearFront, source).pop();
        }
        if (!match || match.length !== source.length)
            return result;
        let cardinalStr = match.groups('cardinal').value;
        let yearStr = match.groups('year').value;
        let orderStr = match.groups('order').value;
        let year = Number.parseInt(yearStr, 10);
        if (isNaN(year)) {
            let swift = this.config.getSwiftYear(orderStr);
            if (swift < -1)
                return result;
            year = referenceDate.getFullYear() + swift;
        }
        let quarterNum = this.config.cardinalMap.get(cardinalStr);
        let beginDate = utilities_1.DateUtils.safeCreateFromValue(utilities_1.DateUtils.minValue(), year, quarterNum * 3 - 3, 1);
        let endDate = utilities_1.DateUtils.safeCreateFromValue(utilities_1.DateUtils.minValue(), year, quarterNum * 3, 1);
        result.futureValue = [beginDate, endDate];
        result.pastValue = [beginDate, endDate];
        result.timex = `(${utilities_1.FormatUtil.luisDateFromDate(beginDate)},${utilities_1.FormatUtil.luisDateFromDate(endDate)},P3M)`;
        result.success = true;
        return result;
    }
    parseSeason(source, referenceDate) {
        let result = new utilities_1.DateTimeResolutionResult();
        let match = recognizers_text_1.RegExpUtility.getMatches(this.config.seasonRegex, source).pop();
        if (!match || match.length !== source.length)
            return result;
        let swift = this.config.getSwiftYear(source);
        let yearStr = match.groups('year').value;
        let year = referenceDate.getFullYear();
        let seasonStr = match.groups('seas').value;
        let season = this.config.seasonMap.get(seasonStr);
        if (swift >= -1 || !recognizers_text_1.StringUtility.isNullOrEmpty(yearStr)) {
            if (recognizers_text_1.StringUtility.isNullOrEmpty(yearStr))
                yearStr = utilities_1.FormatUtil.toString(year + swift, 4);
            result.timex = `${yearStr}-${season}`;
        }
        else {
            result.timex = season;
        }
        result.success = true;
        return result;
    }
    parseWhichWeek(source, referenceDate) {
        let result = new utilities_1.DateTimeResolutionResult();
        let match = recognizers_text_1.RegExpUtility.getMatches(this.config.whichWeekRegex, source).pop();
        if (!match)
            return result;
        let num = Number.parseInt(match.groups('number').value, 10);
        let year = referenceDate.getFullYear();
        let firstDay = utilities_1.DateUtils.safeCreateFromValue(utilities_1.DateUtils.minValue(), year, 0, 1);
        let firstWeekday = utilities_1.DateUtils.this(firstDay, utilities_1.DayOfWeek.Monday);
        let resultDate = utilities_1.DateUtils.addDays(firstWeekday, 7 * num);
        result.timex = `${utilities_1.FormatUtil.toString(year, 4)}-W${utilities_1.FormatUtil.toString(num, 2)}`;
        result.futureValue = [resultDate, utilities_1.DateUtils.addDays(resultDate, 7)];
        result.pastValue = [resultDate, utilities_1.DateUtils.addDays(resultDate, 7)];
        result.success = true;
        return result;
    }
    parseWeekOfDate(source, referenceDate) {
        let result = new utilities_1.DateTimeResolutionResult();
        let match = recognizers_text_1.RegExpUtility.getMatches(this.config.weekOfRegex, source).pop();
        let ers = this.config.dateExtractor.extract(source, referenceDate);
        if (!match || ers.length !== 1)
            return result;
        let dateResolution = this.config.dateParser.parse(ers[0], referenceDate).value;
        result.timex = dateResolution.timex;
        result.comment = this.weekOfComment;
        result.futureValue = this.getWeekRangeFromDate(dateResolution.futureValue);
        result.pastValue = this.getWeekRangeFromDate(dateResolution.pastValue);
        result.success = true;
        return result;
    }
    parseMonthOfDate(source, referenceDate) {
        let result = new utilities_1.DateTimeResolutionResult();
        let match = recognizers_text_1.RegExpUtility.getMatches(this.config.monthOfRegex, source).pop();
        let ers = this.config.dateExtractor.extract(source, referenceDate);
        if (!match || ers.length !== 1)
            return result;
        let dateResolution = this.config.dateParser.parse(ers[0], referenceDate).value;
        result.timex = dateResolution.timex;
        result.comment = this.monthOfComment;
        result.futureValue = this.getMonthRangeFromDate(dateResolution.futureValue);
        result.pastValue = this.getMonthRangeFromDate(dateResolution.pastValue);
        result.success = true;
        return result;
    }
    computeDate(cardinal, weekday, month, year) {
        let firstDay = new Date(year, month, 1);
        let firstWeekday = utilities_1.DateUtils.this(firstDay, weekday);
        if (weekday === 0)
            weekday = 7;
        let firstDayOfWeek = firstDay.getDay() !== 0 ? firstDay.getDay() : 7;
        if (weekday < firstDayOfWeek)
            firstWeekday = utilities_1.DateUtils.next(firstDay, weekday);
        firstWeekday.setDate(firstWeekday.getDate() + (7 * (cardinal - 1)));
        return firstWeekday;
    }
    getWeekRangeFromDate(seedDate) {
        let beginDate = utilities_1.DateUtils.this(seedDate, utilities_1.DayOfWeek.Monday);
        let endDate = utilities_1.DateUtils.addDays(beginDate, this.inclusiveEndPeriod ? 6 : 7);
        return [beginDate, endDate];
    }
    getMonthRangeFromDate(seedDate) {
        let beginDate = utilities_1.DateUtils.safeCreateFromValue(utilities_1.DateUtils.minValue(), seedDate.getFullYear(), seedDate.getMonth(), 1);
        let endDate = utilities_1.DateUtils.safeCreateFromValue(utilities_1.DateUtils.minValue(), seedDate.getFullYear(), seedDate.getMonth() + 1, 1);
        endDate.setDate(endDate.getDate() + (this.inclusiveEndPeriod ? -1 : 0));
        return [beginDate, endDate];
    }
}
exports.BaseDatePeriodParser = BaseDatePeriodParser;
//# sourceMappingURL=baseDatePeriod.js.map