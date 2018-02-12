"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const recognizers_text_1 = require("recognizers-text");
const recognizers_text_number_1 = require("recognizers-text-number");
const recognizers_text_number_2 = require("recognizers-text-number");
const baseDatePeriod_1 = require("../baseDatePeriod");
const dateConfiguration_1 = require("./dateConfiguration");
const durationConfiguration_1 = require("./durationConfiguration");
const utilities_1 = require("../utilities");
const chineseDateTime_1 = require("../../resources/chineseDateTime");
const parsers_1 = require("../parsers");
const constants_1 = require("../constants");
class ChineseDatePeriodExtractorConfiguration {
    constructor() {
        this.simpleCasesRegexes = [
            recognizers_text_1.RegExpUtility.getSafeRegExp(chineseDateTime_1.ChineseDateTime.SimpleCasesRegex),
            recognizers_text_1.RegExpUtility.getSafeRegExp(chineseDateTime_1.ChineseDateTime.OneWordPeriodRegex),
            recognizers_text_1.RegExpUtility.getSafeRegExp(chineseDateTime_1.ChineseDateTime.StrictYearRegex),
            recognizers_text_1.RegExpUtility.getSafeRegExp(chineseDateTime_1.ChineseDateTime.YearToYear),
            recognizers_text_1.RegExpUtility.getSafeRegExp(chineseDateTime_1.ChineseDateTime.YearAndMonth),
            recognizers_text_1.RegExpUtility.getSafeRegExp(chineseDateTime_1.ChineseDateTime.PureNumYearAndMonth),
            recognizers_text_1.RegExpUtility.getSafeRegExp(chineseDateTime_1.ChineseDateTime.DatePeriodYearInChineseRegex),
            recognizers_text_1.RegExpUtility.getSafeRegExp(chineseDateTime_1.ChineseDateTime.WeekOfMonthRegex),
            recognizers_text_1.RegExpUtility.getSafeRegExp(chineseDateTime_1.ChineseDateTime.SeasonWithYear),
            recognizers_text_1.RegExpUtility.getSafeRegExp(chineseDateTime_1.ChineseDateTime.QuarterRegex),
        ];
        this.datePointExtractor = new dateConfiguration_1.ChineseDateExtractor();
        this.integerExtractor = new recognizers_text_number_1.ChineseIntegerExtractor();
        this.tillRegex = recognizers_text_1.RegExpUtility.getSafeRegExp(chineseDateTime_1.ChineseDateTime.DatePeriodTillRegex);
        this.followedUnit = recognizers_text_1.RegExpUtility.getSafeRegExp(chineseDateTime_1.ChineseDateTime.FollowedUnit);
        this.numberCombinedWithUnit = recognizers_text_1.RegExpUtility.getSafeRegExp(chineseDateTime_1.ChineseDateTime.NumberCombinedWithUnit);
        this.pastRegex = recognizers_text_1.RegExpUtility.getSafeRegExp(chineseDateTime_1.ChineseDateTime.PastRegex);
        this.futureRegex = recognizers_text_1.RegExpUtility.getSafeRegExp(chineseDateTime_1.ChineseDateTime.FutureRegex);
    }
    getFromTokenIndex(source) {
        let result = { matched: false, index: -1 };
        if (source.endsWith("从")) {
            result.index = source.lastIndexOf("从");
            result.matched = true;
        }
        return result;
    }
    ;
    getBetweenTokenIndex(source) {
        return { matched: false, index: -1 };
    }
    ;
    hasConnectorToken(source) {
        return false;
    }
}
class ChineseDatePeriodExtractor extends baseDatePeriod_1.BaseDatePeriodExtractor {
    constructor() {
        super(new ChineseDatePeriodExtractorConfiguration());
    }
    extract(source, refDate) {
        if (!refDate)
            refDate = new Date();
        let referenceDate = refDate;
        let tokens = new Array()
            .concat(super.matchSimpleCases(source))
            .concat(super.mergeTwoTimePoints(source, refDate))
            .concat(this.matchNumberWithUnit(source));
        let result = utilities_1.Token.mergeAllTokens(tokens, source, this.extractorName);
        return result;
    }
    matchNumberWithUnit(source) {
        let tokens = new Array();
        let durations = new Array();
        this.config.integerExtractor.extract(source).forEach(er => {
            let afterStr = source.substr(er.start + er.length);
            let followedUnitMatch = recognizers_text_1.RegExpUtility.getMatches(this.config.followedUnit, afterStr).pop();
            if (followedUnitMatch && followedUnitMatch.index === 0) {
                durations.push(new utilities_1.Token(er.start, er.start + er.length + followedUnitMatch.length));
            }
        });
        recognizers_text_1.RegExpUtility.getMatches(this.config.numberCombinedWithUnit, source).forEach(match => {
            durations.push(new utilities_1.Token(match.index, match.index + match.length));
        });
        durations.forEach(duration => {
            let beforeStr = source.substr(0, duration.start).toLowerCase();
            if (recognizers_text_1.StringUtility.isNullOrWhitespace(beforeStr)) {
                return;
            }
            let match = recognizers_text_1.RegExpUtility.getMatches(this.config.pastRegex, beforeStr).pop();
            if (match && recognizers_text_1.StringUtility.isNullOrWhitespace(beforeStr.substr(match.index + match.length))) {
                tokens.push(new utilities_1.Token(match.index, duration.end));
                return;
            }
            match = recognizers_text_1.RegExpUtility.getMatches(this.config.futureRegex, beforeStr).pop();
            if (match && recognizers_text_1.StringUtility.isNullOrWhitespace(beforeStr.substr(match.index + match.length))) {
                tokens.push(new utilities_1.Token(match.index, duration.end));
                return;
            }
        });
        return tokens;
    }
}
exports.ChineseDatePeriodExtractor = ChineseDatePeriodExtractor;
class ChineseDatePeriodParserConfiguration {
    constructor() {
        this.simpleCasesRegex = recognizers_text_1.RegExpUtility.getSafeRegExp(chineseDateTime_1.ChineseDateTime.SimpleCasesRegex);
        this.yearRegex = recognizers_text_1.RegExpUtility.getSafeRegExp(chineseDateTime_1.ChineseDateTime.YearRegex);
        this.seasonRegex = recognizers_text_1.RegExpUtility.getSafeRegExp(chineseDateTime_1.ChineseDateTime.SeasonRegex);
        this.seasonMap = chineseDateTime_1.ChineseDateTime.ParserConfigurationSeasonMap;
        this.quarterRegex = recognizers_text_1.RegExpUtility.getSafeRegExp(chineseDateTime_1.ChineseDateTime.QuarterRegex);
        this.cardinalMap = chineseDateTime_1.ChineseDateTime.ParserConfigurationCardinalMap;
        this.unitMap = chineseDateTime_1.ChineseDateTime.ParserConfigurationUnitMap;
        this.durationExtractor = new durationConfiguration_1.ChineseDurationExtractor();
        this.pastRegex = recognizers_text_1.RegExpUtility.getSafeRegExp(chineseDateTime_1.ChineseDateTime.PastRegex);
        this.futureRegex = recognizers_text_1.RegExpUtility.getSafeRegExp(chineseDateTime_1.ChineseDateTime.FutureRegex);
        this.monthOfYear = chineseDateTime_1.ChineseDateTime.ParserConfigurationMonthOfYear;
        this.dayOfMonth = chineseDateTime_1.ChineseDateTime.ParserConfigurationDayOfMonth;
        this.monthOfYear = chineseDateTime_1.ChineseDateTime.ParserConfigurationMonthOfYear;
        this.oneWordPeriodRegex = recognizers_text_1.RegExpUtility.getSafeRegExp(chineseDateTime_1.ChineseDateTime.OneWordPeriodRegex);
        this.dateExtractor = new dateConfiguration_1.ChineseDateExtractor();
        this.dateParser = new dateConfiguration_1.ChineseDateParser();
        this.tokenBeforeDate = 'on ';
        this.weekOfMonthRegex = recognizers_text_1.RegExpUtility.getSafeRegExp(chineseDateTime_1.ChineseDateTime.WeekOfMonthRegex);
        this.thisPrefixRegex = recognizers_text_1.RegExpUtility.getSafeRegExp(chineseDateTime_1.ChineseDateTime.DatePeriodThisRegex);
        this.nextPrefixRegex = recognizers_text_1.RegExpUtility.getSafeRegExp(chineseDateTime_1.ChineseDateTime.DatePeriodNextRegex);
        this.pastPrefixRegex = recognizers_text_1.RegExpUtility.getSafeRegExp(chineseDateTime_1.ChineseDateTime.DatePeriodLastRegex);
    }
    getSwiftDayOrMonth(source) {
        let trimmedSource = source.trim().toLowerCase();
        if (trimmedSource.endsWith('去年')) {
            return -1;
        }
        if (trimmedSource.endsWith('明年')) {
            return 1;
        }
        if (trimmedSource.endsWith('前年')) {
            return -2;
        }
        if (trimmedSource.endsWith('后年')) {
            return 2;
        }
        if (trimmedSource.startsWith('下个')) {
            return 1;
        }
        if (trimmedSource.startsWith('上个')) {
            return -1;
        }
        if (recognizers_text_1.RegExpUtility.isMatch(this.thisPrefixRegex, trimmedSource)) {
            return 0;
        }
        if (recognizers_text_1.RegExpUtility.isMatch(this.nextPrefixRegex, trimmedSource)) {
            return 1;
        }
        if (recognizers_text_1.RegExpUtility.isMatch(this.pastPrefixRegex, trimmedSource)) {
            return -1;
        }
        return 0;
    }
    getSwiftYear(source) {
        let trimmedSource = source.trim().toLowerCase();
        let swift = -10;
        if (trimmedSource.startsWith('明年')) {
            swift = 1;
        }
        else if (trimmedSource.startsWith('去年')) {
            swift = -1;
        }
        else if (trimmedSource.startsWith('今年')) {
            swift = 0;
        }
        return swift;
    }
    isFuture(source) {
        return (recognizers_text_1.RegExpUtility.isMatch(this.thisPrefixRegex, source)
            || recognizers_text_1.RegExpUtility.isMatch(this.nextPrefixRegex, source));
    }
    isYearToDate(source) {
        let trimmedSource = source.trim().toLowerCase();
        return trimmedSource === '今年';
    }
    isMonthToDate(source) {
        return false;
    }
    isWeekOnly(source) {
        let trimmedSource = source.trim().toLowerCase();
        return trimmedSource.endsWith('周') || trimmedSource.endsWith('星期');
    }
    isWeekend(source) {
        let trimmedSource = source.trim().toLowerCase();
        return trimmedSource.endsWith('周末');
    }
    isMonthOnly(source) {
        let trimmedSource = source.trim().toLowerCase();
        return trimmedSource.endsWith('月');
    }
    isYearOnly(source) {
        let trimmedSource = source.trim().toLowerCase();
        return trimmedSource.endsWith('年');
    }
    isLastCardinal(source) {
        return source === '最后一';
    }
}
class ChineseDatePeriodParser extends baseDatePeriod_1.BaseDatePeriodParser {
    constructor() {
        let config = new ChineseDatePeriodParserConfiguration();
        super(config, false);
        this.integerExtractor = new recognizers_text_number_1.ChineseIntegerExtractor();
        this.numberParser = recognizers_text_number_1.AgnosticNumberParserFactory.getParser(recognizers_text_number_1.AgnosticNumberParserType.Integer, new recognizers_text_number_1.ChineseNumberParserConfiguration());
        this.yearInChineseRegex = recognizers_text_1.RegExpUtility.getSafeRegExp(chineseDateTime_1.ChineseDateTime.DatePeriodYearInChineseRegex);
        this.numberCombinedWithUnitRegex = recognizers_text_1.RegExpUtility.getSafeRegExp(chineseDateTime_1.ChineseDateTime.NumberCombinedWithUnit);
        this.unitRegex = recognizers_text_1.RegExpUtility.getSafeRegExp(chineseDateTime_1.ChineseDateTime.UnitRegex);
        this.yearAndMonthRegex = recognizers_text_1.RegExpUtility.getSafeRegExp(chineseDateTime_1.ChineseDateTime.YearAndMonth);
        this.pureNumberYearAndMonthRegex = recognizers_text_1.RegExpUtility.getSafeRegExp(chineseDateTime_1.ChineseDateTime.PureNumYearAndMonth);
        this.yearToYearRegex = recognizers_text_1.RegExpUtility.getSafeRegExp(chineseDateTime_1.ChineseDateTime.YearToYear);
        this.chineseYearRegex = recognizers_text_1.RegExpUtility.getSafeRegExp(chineseDateTime_1.ChineseDateTime.DatePeriodYearInChineseRegex);
    }
    parse(extractorResult, referenceDate) {
        if (!referenceDate)
            referenceDate = new Date();
        let resultValue;
        if (extractorResult.type === this.parserName) {
            let source = extractorResult.text.trim().toLowerCase();
            let innerResult = this.parseSimpleCases(source, referenceDate);
            if (!innerResult.success) {
                innerResult = this.parseOneWordPeriod(source, referenceDate);
            }
            if (!innerResult.success) {
                innerResult = this.mergeTwoTimePoints(source, referenceDate);
            }
            if (!innerResult.success) {
                innerResult = this.parseNumberWithUnit(source, referenceDate);
            }
            if (!innerResult.success) {
                innerResult = this.parseDuration(source, referenceDate);
            }
            if (!innerResult.success) {
                innerResult = this.parseYearAndMonth(source, referenceDate);
            }
            if (!innerResult.success) {
                innerResult = this.parseYearToYear(source, referenceDate);
            }
            if (!innerResult.success) {
                innerResult = this.parseYear(source, referenceDate);
            }
            if (!innerResult.success) {
                innerResult = this.parseWeekOfMonth(source, referenceDate);
            }
            if (!innerResult.success) {
                innerResult = this.parseSeason(source, referenceDate);
            }
            if (!innerResult.success) {
                innerResult = this.parseQuarter(source, referenceDate);
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
    getMatchSimpleCase(source) {
        return recognizers_text_1.RegExpUtility.getMatches(this.config.simpleCasesRegex, source).pop();
    }
    parseSimpleCases(source, referenceDate) {
        let result = new utilities_1.DateTimeResolutionResult();
        let year = referenceDate.getFullYear();
        let month = referenceDate.getMonth();
        let noYear = false;
        let inputYear = false;
        let match = this.getMatchSimpleCase(source);
        if (!match || match.index !== 0 || match.length !== source.length)
            return result;
        let days = match.groups('day');
        let beginDay = this.config.dayOfMonth.get(days.captures[0]);
        let endDay = this.config.dayOfMonth.get(days.captures[1]);
        let monthStr = match.groups('month').value;
        if (!recognizers_text_1.StringUtility.isNullOrEmpty(monthStr)) {
            month = this.config.monthOfYear.get(monthStr) - 1;
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
        let yearStr = match.groups('year').value;
        if (!recognizers_text_1.StringUtility.isNullOrEmpty(yearStr)) {
            year = Number.parseInt(yearStr, 10);
            inputYear = true;
        }
        else {
            noYear = true;
        }
        let beginDateLuis = utilities_1.FormatUtil.luisDate(inputYear || this.config.isFuture(monthStr) ? year : -1, month, beginDay);
        let endDateLuis = utilities_1.FormatUtil.luisDate(inputYear || this.config.isFuture(monthStr) ? year : -1, month, endDay);
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
    parseYear(source, referenceDate) {
        let trimmedSource = source.trim();
        let result = new utilities_1.DateTimeResolutionResult();
        let isChinese = false;
        let match = recognizers_text_1.RegExpUtility.getMatches(this.config.yearRegex, trimmedSource).pop();
        if (!match || match.length !== trimmedSource.length) {
            match = recognizers_text_1.RegExpUtility.getMatches(this.yearInChineseRegex, trimmedSource).pop();
            isChinese = (match && match.length === trimmedSource.length);
        }
        if (!match || match.length !== trimmedSource.length) {
            return result;
        }
        let yearStr = match.value;
        if (this.config.isYearOnly(yearStr)) {
            yearStr = yearStr.substr(0, yearStr.length - 1);
        }
        let year = this.convertYear(yearStr, isChinese);
        if (yearStr.length === 2) {
            if (year < 100 && year >= 20) {
                year += 1900;
            }
            else if (year < 20) {
                year += 2000;
            }
        }
        let beginDay = utilities_1.DateUtils.safeCreateFromMinValue(year, 1, 1);
        let endDay = utilities_1.DateUtils.safeCreateFromMinValue(year + 1, 1, 1);
        result.timex = utilities_1.FormatUtil.toString(year, 4);
        result.futureValue = [beginDay, endDay];
        result.pastValue = [beginDay, endDay];
        result.success = true;
        return result;
    }
    convertYear(yearStr, isChinese) {
        let year = -1;
        let er;
        if (isChinese) {
            let yearNum = 0;
            er = this.integerExtractor.extract(yearStr).pop();
            if (er && er.type === recognizers_text_number_2.Constants.SYS_NUM_INTEGER) {
                yearNum = Number.parseInt(this.numberParser.parse(er).value);
            }
            if (yearNum < 10) {
                yearNum = 0;
                for (let index = 0; index < yearStr.length; index++) {
                    let char = yearStr.charAt[index];
                    yearNum *= 10;
                    er = this.integerExtractor.extract(char).pop();
                    if (er && er.type === recognizers_text_number_2.Constants.SYS_NUM_INTEGER) {
                        yearNum += Number.parseInt(this.numberParser.parse(er).value);
                    }
                }
            }
            else {
                year = yearNum;
            }
        }
        else {
            year = Number.parseInt(yearStr, 10);
        }
        return year === 0 ? -1 : year;
    }
    getWeekOfMonth(cardinal, month, year, referenceDate, noYear) {
        let result = new utilities_1.DateTimeResolutionResult();
        let seedDate = this.computeDate(cardinal, 1, month, year);
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
    parseSeason(source, referenceDate) {
        let result = new utilities_1.DateTimeResolutionResult();
        let match = recognizers_text_1.RegExpUtility.getMatches(this.config.seasonRegex, source).pop();
        if (!match || match.length !== source.length)
            return result;
        let year = referenceDate.getFullYear();
        let yearNum = match.groups('year').value;
        let yearChinese = match.groups('yearchs').value;
        let yearRelative = match.groups('yearrel').value;
        let hasYear = false;
        if (!recognizers_text_1.StringUtility.isNullOrEmpty(yearNum)) {
            hasYear = true;
            if (this.config.isYearOnly(yearNum)) {
                yearNum = yearNum.substr(0, yearNum.length - 1);
            }
            year = this.convertYear(yearNum, false);
        }
        else if (!recognizers_text_1.StringUtility.isNullOrEmpty(yearChinese)) {
            hasYear = true;
            if (this.config.isYearOnly(yearChinese)) {
                yearChinese = yearChinese.substr(0, yearChinese.length - 1);
            }
            year = this.convertYear(yearChinese, true);
        }
        else if (!recognizers_text_1.StringUtility.isNullOrEmpty(yearRelative)) {
            hasYear = true;
            year += this.config.getSwiftDayOrMonth(yearRelative);
        }
        if (year < 100 && year >= 90) {
            year += 1900;
        }
        else if (year < 100 && year < 20) {
            year += 2000;
        }
        let seasonStr = match.groups('seas').value;
        let season = this.config.seasonMap.get(seasonStr);
        if (hasYear) {
            result.timex = `${utilities_1.FormatUtil.toString(year, 4)}-${season}`;
        }
        result.success = true;
        return result;
    }
    parseQuarter(source, referenceDate) {
        let result = new utilities_1.DateTimeResolutionResult();
        let match = recognizers_text_1.RegExpUtility.getMatches(this.config.quarterRegex, source).pop();
        if (!match || match.length !== source.length)
            return result;
        let year = referenceDate.getFullYear();
        let yearNum = match.groups('year').value;
        let yearChinese = match.groups('yearchs').value;
        let yearRelative = match.groups('yearrel').value;
        if (!recognizers_text_1.StringUtility.isNullOrEmpty(yearNum)) {
            if (this.config.isYearOnly(yearNum)) {
                yearNum = yearNum.substr(0, yearNum.length - 1);
            }
            year = this.convertYear(yearNum, false);
        }
        else if (!recognizers_text_1.StringUtility.isNullOrEmpty(yearChinese)) {
            if (this.config.isYearOnly(yearChinese)) {
                yearChinese = yearChinese.substr(0, yearChinese.length - 1);
            }
            year = this.convertYear(yearChinese, true);
        }
        else if (!recognizers_text_1.StringUtility.isNullOrEmpty(yearRelative)) {
            year += this.config.getSwiftDayOrMonth(yearRelative);
        }
        if (year < 100 && year >= 90) {
            year += 1900;
        }
        else if (year < 100 && year < 20) {
            year += 2000;
        }
        let cardinalStr = match.groups('cardinal').value;
        let quarterNum = this.config.cardinalMap.get(cardinalStr);
        let beginDate = utilities_1.DateUtils.safeCreateFromValue(utilities_1.DateUtils.minValue(), year, quarterNum * 3 - 3, 1);
        let endDate = utilities_1.DateUtils.safeCreateFromValue(utilities_1.DateUtils.minValue(), year, quarterNum * 3, 1);
        result.futureValue = [beginDate, endDate];
        result.pastValue = [beginDate, endDate];
        result.timex = `(${utilities_1.FormatUtil.luisDateFromDate(beginDate)},${utilities_1.FormatUtil.luisDateFromDate(endDate)},P3M)`;
        result.success = true;
        return result;
    }
    parseNumberWithUnit(source, referenceDate) {
        let result = new utilities_1.DateTimeResolutionResult();
        // if there are NO spaces between number and unit
        let match = recognizers_text_1.RegExpUtility.getMatches(this.numberCombinedWithUnitRegex, source).pop();
        if (!match)
            return result;
        let sourceUnit = match.groups('unit').value.trim().toLowerCase();
        if (!this.config.unitMap.has(sourceUnit))
            return result;
        let numStr = match.groups('num').value;
        let beforeStr = source.substr(0, match.index).trim().toLowerCase();
        return this.parseCommonDurationWithUnit(beforeStr, sourceUnit, numStr, referenceDate);
    }
    parseDuration(source, referenceDate) {
        let result = new utilities_1.DateTimeResolutionResult();
        // for case "前两年" "后三年"
        let durationResult = this.config.durationExtractor.extract(source, referenceDate).pop();
        if (!durationResult)
            return result;
        let match = recognizers_text_1.RegExpUtility.getMatches(this.unitRegex, durationResult.text).pop();
        if (!match)
            return result;
        let sourceUnit = match.groups('unit').value.trim().toLowerCase();
        if (!this.config.unitMap.has(sourceUnit))
            return result;
        let beforeStr = source.substr(0, durationResult.start).trim().toLowerCase();
        let numberStr = durationResult.text.substr(0, match.index).trim().toLowerCase();
        let numberValue = this.convertChineseToNumber(numberStr);
        let numStr = numberValue.toString();
        return this.parseCommonDurationWithUnit(beforeStr, sourceUnit, numStr, referenceDate);
    }
    parseCommonDurationWithUnit(beforeStr, sourceUnit, numStr, referenceDate) {
        let result = new utilities_1.DateTimeResolutionResult();
        let unitStr = this.config.unitMap.get(sourceUnit);
        let pastMatch = recognizers_text_1.RegExpUtility.getMatches(this.config.pastRegex, beforeStr).pop();
        let hasPast = pastMatch && pastMatch.length === beforeStr.length;
        let futureMatch = recognizers_text_1.RegExpUtility.getMatches(this.config.futureRegex, beforeStr).pop();
        let hasFuture = futureMatch && futureMatch.length === beforeStr.length;
        if (!hasFuture && !hasPast) {
            return result;
        }
        let beginDate = new Date(referenceDate);
        let endDate = new Date(referenceDate);
        let difference = Number.parseFloat(numStr);
        switch (unitStr) {
            case 'D':
                beginDate = hasPast ? utilities_1.DateUtils.addDays(referenceDate, -difference) : beginDate;
                endDate = hasFuture ? utilities_1.DateUtils.addDays(referenceDate, difference) : endDate;
                break;
            case 'W':
                beginDate = hasPast ? utilities_1.DateUtils.addDays(referenceDate, -7 * difference) : beginDate;
                endDate = hasFuture ? utilities_1.DateUtils.addDays(referenceDate, 7 * difference) : endDate;
                break;
            case 'MON':
                beginDate = hasPast ? utilities_1.DateUtils.addMonths(referenceDate, -Math.round(difference)) : beginDate;
                endDate = hasFuture ? utilities_1.DateUtils.addMonths(referenceDate, Math.round(difference)) : endDate;
                break;
            case 'Y':
                beginDate = hasPast ? utilities_1.DateUtils.addYears(referenceDate, -Math.round(difference)) : beginDate;
                endDate = hasFuture ? utilities_1.DateUtils.addYears(referenceDate, Math.round(difference)) : endDate;
                break;
            default: return result;
        }
        if (hasFuture) {
            beginDate = utilities_1.DateUtils.addDays(beginDate, 1);
            endDate = utilities_1.DateUtils.addDays(endDate, 1);
        }
        let beginTimex = utilities_1.FormatUtil.luisDateFromDate(beginDate);
        let endTimex = utilities_1.FormatUtil.luisDateFromDate(endDate);
        result.timex = `(${beginTimex},${endTimex},P${numStr}${unitStr.charAt(0)})`;
        result.futureValue = [beginDate, endDate];
        result.pastValue = [beginDate, endDate];
        result.success = true;
        return result;
    }
    convertChineseToNumber(source) {
        let num = -1;
        let er = this.integerExtractor.extract(source).pop();
        if (er && er.type === recognizers_text_number_2.Constants.SYS_NUM_INTEGER) {
            num = Number.parseInt(this.numberParser.parse(er).value);
        }
        return num;
    }
    parseYearAndMonth(source, referenceDate) {
        let result = new utilities_1.DateTimeResolutionResult();
        let match = recognizers_text_1.RegExpUtility.getMatches(this.yearAndMonthRegex, source).pop();
        if (!match || match.length !== source.length) {
            match = recognizers_text_1.RegExpUtility.getMatches(this.pureNumberYearAndMonthRegex, source).pop();
        }
        if (!match || match.length !== source.length) {
            return result;
        }
        // parse year
        let year = referenceDate.getFullYear();
        let yearNum = match.groups('year').value;
        let yearChinese = match.groups('yearchs').value;
        let yearRelative = match.groups('yearrel').value;
        if (!recognizers_text_1.StringUtility.isNullOrEmpty(yearNum)) {
            if (this.config.isYearOnly(yearNum)) {
                yearNum = yearNum.substr(0, yearNum.length - 1);
            }
            year = this.convertYear(yearNum, false);
        }
        else if (!recognizers_text_1.StringUtility.isNullOrEmpty(yearChinese)) {
            if (this.config.isYearOnly(yearChinese)) {
                yearChinese = yearChinese.substr(0, yearChinese.length - 1);
            }
            year = this.convertYear(yearChinese, true);
        }
        else if (!recognizers_text_1.StringUtility.isNullOrEmpty(yearRelative)) {
            year += this.config.getSwiftDayOrMonth(yearRelative);
        }
        if (year < 100 && year >= 90) {
            year += 1900;
        }
        else if (year < 100 && year < 20) {
            year += 2000;
        }
        let monthStr = match.groups('month').value.toLowerCase();
        let month = (this.config.monthOfYear.get(monthStr) % 12) - 1;
        let beginDate = utilities_1.DateUtils.safeCreateFromMinValue(year, month, 1);
        let endDate = month === 11
            ? utilities_1.DateUtils.safeCreateFromMinValue(year + 1, 1, 1)
            : utilities_1.DateUtils.safeCreateFromMinValue(year, month + 1, 1);
        result.timex = utilities_1.FormatUtil.toString(year, 4) + '-' + utilities_1.FormatUtil.toString(month, 2);
        result.futureValue = [beginDate, endDate];
        result.pastValue = [beginDate, endDate];
        result.success = true;
        return result;
    }
    parseYearToYear(source, referenceDate) {
        let result = new utilities_1.DateTimeResolutionResult();
        let match = recognizers_text_1.RegExpUtility.getMatches(this.yearToYearRegex, source).pop();
        if (!match) {
            return result;
        }
        let yearMatches = recognizers_text_1.RegExpUtility.getMatches(this.config.yearRegex, source);
        let chineseYearMatches = recognizers_text_1.RegExpUtility.getMatches(this.chineseYearRegex, source);
        let beginYear = 0;
        let endYear = 0;
        if (yearMatches.length === 2) {
            beginYear = this.convertChineseToNumber(yearMatches[0].groups('year').value);
            endYear = this.convertChineseToNumber(yearMatches[1].groups('year').value);
        }
        else if (chineseYearMatches.length === 2) {
            beginYear = this.convertChineseToNumber(chineseYearMatches[0].groups('year').value);
            endYear = this.convertChineseToNumber(chineseYearMatches[1].groups('year').value);
        }
        else if (yearMatches.length === 1 && chineseYearMatches.length === 1) {
            if (yearMatches[0].index < chineseYearMatches[0].index) {
                beginYear = this.convertChineseToNumber(yearMatches[0].groups('year').value);
                endYear = this.convertChineseToNumber(chineseYearMatches[0].groups('year').value);
            }
            else {
                beginYear = this.convertChineseToNumber(chineseYearMatches[0].groups('year').value);
                endYear = this.convertChineseToNumber(yearMatches[0].groups('year').value);
            }
        }
        beginYear = this.sanitizeYear(beginYear);
        endYear = this.sanitizeYear(endYear);
        let beginDate = utilities_1.DateUtils.safeCreateFromMinValue(beginYear, 1, 1);
        let endDate = utilities_1.DateUtils.safeCreateFromMinValue(endYear, 11, 31);
        let beginTimex = utilities_1.FormatUtil.toString(beginYear, 4);
        let endTimex = utilities_1.FormatUtil.toString(endYear, 4);
        result.timex = `(${beginYear},${endYear},P${endYear - beginYear}Y)`;
        result.futureValue = [beginDate, endDate];
        result.pastValue = [beginDate, endDate];
        result.success = true;
        return result;
    }
    sanitizeYear(year) {
        let result = year;
        if (year < 100 && year >= 90) {
            result += 1900;
        }
        else if (year < 100 && year < 20) {
            result += 2000;
        }
        return result;
    }
}
exports.ChineseDatePeriodParser = ChineseDatePeriodParser;
//# sourceMappingURL=datePeriodConfiguration.js.map