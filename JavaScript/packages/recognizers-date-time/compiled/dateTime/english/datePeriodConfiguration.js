"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const baseDate_1 = require("../baseDate");
const recognizers_text_1 = require("recognizers-text");
const recognizers_text_number_1 = require("recognizers-text-number");
const baseDuration_1 = require("../baseDuration");
const englishDateTime_1 = require("../../resources/englishDateTime");
const durationConfiguration_1 = require("./durationConfiguration");
const dateConfiguration_1 = require("./dateConfiguration");
class EnglishDatePeriodExtractorConfiguration {
    constructor() {
        this.simpleCasesRegexes = [
            recognizers_text_1.RegExpUtility.getSafeRegExp(englishDateTime_1.EnglishDateTime.SimpleCasesRegex),
            recognizers_text_1.RegExpUtility.getSafeRegExp(englishDateTime_1.EnglishDateTime.BetweenRegex),
            recognizers_text_1.RegExpUtility.getSafeRegExp(englishDateTime_1.EnglishDateTime.OneWordPeriodRegex),
            recognizers_text_1.RegExpUtility.getSafeRegExp(englishDateTime_1.EnglishDateTime.MonthWithYear),
            recognizers_text_1.RegExpUtility.getSafeRegExp(englishDateTime_1.EnglishDateTime.MonthNumWithYear),
            recognizers_text_1.RegExpUtility.getSafeRegExp(englishDateTime_1.EnglishDateTime.YearRegex),
            recognizers_text_1.RegExpUtility.getSafeRegExp(englishDateTime_1.EnglishDateTime.WeekOfMonthRegex),
            recognizers_text_1.RegExpUtility.getSafeRegExp(englishDateTime_1.EnglishDateTime.WeekOfYearRegex),
            recognizers_text_1.RegExpUtility.getSafeRegExp(englishDateTime_1.EnglishDateTime.MonthFrontBetweenRegex),
            recognizers_text_1.RegExpUtility.getSafeRegExp(englishDateTime_1.EnglishDateTime.MonthFrontSimpleCasesRegex),
            recognizers_text_1.RegExpUtility.getSafeRegExp(englishDateTime_1.EnglishDateTime.QuarterRegex),
            recognizers_text_1.RegExpUtility.getSafeRegExp(englishDateTime_1.EnglishDateTime.QuarterRegexYearFront),
            recognizers_text_1.RegExpUtility.getSafeRegExp(englishDateTime_1.EnglishDateTime.SeasonRegex),
            recognizers_text_1.RegExpUtility.getSafeRegExp(englishDateTime_1.EnglishDateTime.WhichWeekRegex),
            recognizers_text_1.RegExpUtility.getSafeRegExp(englishDateTime_1.EnglishDateTime.RestOfDateRegex),
            recognizers_text_1.RegExpUtility.getSafeRegExp(englishDateTime_1.EnglishDateTime.LaterEarlyPeriodRegex),
            recognizers_text_1.RegExpUtility.getSafeRegExp(englishDateTime_1.EnglishDateTime.WeekWithWeekDayRangeRegex)
        ];
        this.tillRegex = recognizers_text_1.RegExpUtility.getSafeRegExp(englishDateTime_1.EnglishDateTime.TillRegex);
        this.followedUnit = recognizers_text_1.RegExpUtility.getSafeRegExp(englishDateTime_1.EnglishDateTime.FollowedDateUnit);
        this.numberCombinedWithUnit = recognizers_text_1.RegExpUtility.getSafeRegExp(englishDateTime_1.EnglishDateTime.NumberCombinedWithDateUnit);
        this.pastRegex = recognizers_text_1.RegExpUtility.getSafeRegExp(englishDateTime_1.EnglishDateTime.PastPrefixRegex);
        this.futureRegex = recognizers_text_1.RegExpUtility.getSafeRegExp(englishDateTime_1.EnglishDateTime.NextPrefixRegex);
        this.weekOfRegex = recognizers_text_1.RegExpUtility.getSafeRegExp(englishDateTime_1.EnglishDateTime.WeekOfRegex);
        this.monthOfRegex = recognizers_text_1.RegExpUtility.getSafeRegExp(englishDateTime_1.EnglishDateTime.MonthOfRegex);
        this.dateUnitRegex = recognizers_text_1.RegExpUtility.getSafeRegExp(englishDateTime_1.EnglishDateTime.DateUnitRegex);
        this.inConnectorRegex = recognizers_text_1.RegExpUtility.getSafeRegExp(englishDateTime_1.EnglishDateTime.InConnectorRegex);
        this.rangeUnitRegex = recognizers_text_1.RegExpUtility.getSafeRegExp(englishDateTime_1.EnglishDateTime.RangeUnitRegex);
        this.datePointExtractor = new baseDate_1.BaseDateExtractor(new dateConfiguration_1.EnglishDateExtractorConfiguration());
        this.integerExtractor = new recognizers_text_number_1.EnglishIntegerExtractor();
        this.durationExtractor = new baseDuration_1.BaseDurationExtractor(new durationConfiguration_1.EnglishDurationExtractorConfiguration());
        this.rangeConnectorRegex = recognizers_text_1.RegExpUtility.getSafeRegExp(englishDateTime_1.EnglishDateTime.RangeConnectorRegex);
    }
    getFromTokenIndex(source) {
        let result = { matched: false, index: -1 };
        if (source.endsWith("from")) {
            result.index = source.lastIndexOf("from");
            result.matched = true;
        }
        return result;
    }
    ;
    getBetweenTokenIndex(source) {
        let result = { matched: false, index: -1 };
        if (source.endsWith("between")) {
            result.index = source.lastIndexOf("between");
            result.matched = true;
        }
        return result;
    }
    ;
    hasConnectorToken(source) {
        let match = recognizers_text_1.RegExpUtility.getMatches(this.rangeConnectorRegex, source).pop();
        return match && match.length === source.length;
    }
    ;
}
exports.EnglishDatePeriodExtractorConfiguration = EnglishDatePeriodExtractorConfiguration;
class EnglishDatePeriodParserConfiguration {
    constructor(config) {
        this.dateExtractor = config.dateExtractor;
        this.dateParser = config.dateParser;
        this.durationExtractor = config.durationExtractor;
        this.durationParser = config.durationParser;
        this.monthFrontBetweenRegex = recognizers_text_1.RegExpUtility.getSafeRegExp(englishDateTime_1.EnglishDateTime.MonthFrontBetweenRegex);
        this.betweenRegex = recognizers_text_1.RegExpUtility.getSafeRegExp(englishDateTime_1.EnglishDateTime.BetweenRegex);
        this.monthFrontSimpleCasesRegex = recognizers_text_1.RegExpUtility.getSafeRegExp(englishDateTime_1.EnglishDateTime.MonthFrontSimpleCasesRegex);
        this.simpleCasesRegex = recognizers_text_1.RegExpUtility.getSafeRegExp(englishDateTime_1.EnglishDateTime.SimpleCasesRegex);
        this.oneWordPeriodRegex = recognizers_text_1.RegExpUtility.getSafeRegExp(englishDateTime_1.EnglishDateTime.OneWordPeriodRegex);
        this.monthWithYear = recognizers_text_1.RegExpUtility.getSafeRegExp(englishDateTime_1.EnglishDateTime.MonthWithYear);
        this.monthNumWithYear = recognizers_text_1.RegExpUtility.getSafeRegExp(englishDateTime_1.EnglishDateTime.MonthNumWithYear);
        this.yearRegex = recognizers_text_1.RegExpUtility.getSafeRegExp(englishDateTime_1.EnglishDateTime.YearRegex);
        this.pastRegex = recognizers_text_1.RegExpUtility.getSafeRegExp(englishDateTime_1.EnglishDateTime.PastPrefixRegex);
        this.futureRegex = recognizers_text_1.RegExpUtility.getSafeRegExp(englishDateTime_1.EnglishDateTime.NextPrefixRegex);
        this.inConnectorRegex = config.utilityConfiguration.inConnectorRegex;
        this.weekOfMonthRegex = recognizers_text_1.RegExpUtility.getSafeRegExp(englishDateTime_1.EnglishDateTime.WeekOfMonthRegex);
        this.weekOfYearRegex = recognizers_text_1.RegExpUtility.getSafeRegExp(englishDateTime_1.EnglishDateTime.WeekOfYearRegex);
        this.quarterRegex = recognizers_text_1.RegExpUtility.getSafeRegExp(englishDateTime_1.EnglishDateTime.QuarterRegex);
        this.quarterRegexYearFront = recognizers_text_1.RegExpUtility.getSafeRegExp(englishDateTime_1.EnglishDateTime.QuarterRegexYearFront);
        this.seasonRegex = recognizers_text_1.RegExpUtility.getSafeRegExp(englishDateTime_1.EnglishDateTime.SeasonRegex);
        this.weekOfRegex = recognizers_text_1.RegExpUtility.getSafeRegExp(englishDateTime_1.EnglishDateTime.WeekOfRegex);
        this.monthOfRegex = recognizers_text_1.RegExpUtility.getSafeRegExp(englishDateTime_1.EnglishDateTime.MonthOfRegex);
        this.whichWeekRegex = recognizers_text_1.RegExpUtility.getSafeRegExp(englishDateTime_1.EnglishDateTime.WhichWeekRegex);
        this.nextPrefixRegex = recognizers_text_1.RegExpUtility.getSafeRegExp(englishDateTime_1.EnglishDateTime.NextPrefixRegex);
        this.pastPrefixRegex = recognizers_text_1.RegExpUtility.getSafeRegExp(englishDateTime_1.EnglishDateTime.PastPrefixRegex);
        this.thisPrefixRegex = recognizers_text_1.RegExpUtility.getSafeRegExp(englishDateTime_1.EnglishDateTime.ThisPrefixRegex);
        this.restOfDateRegex = recognizers_text_1.RegExpUtility.getSafeRegExp(englishDateTime_1.EnglishDateTime.RestOfDateRegex);
        this.laterEarlyPeriodRegex = recognizers_text_1.RegExpUtility.getSafeRegExp(englishDateTime_1.EnglishDateTime.LaterEarlyPeriodRegex);
        this.weekWithWeekDayRangeRegex = recognizers_text_1.RegExpUtility.getSafeRegExp(englishDateTime_1.EnglishDateTime.WeekWithWeekDayRangeRegex);
        this.tokenBeforeDate = englishDateTime_1.EnglishDateTime.TokenBeforeDate;
        this.dayOfMonth = config.dayOfMonth;
        this.monthOfYear = config.monthOfYear;
        this.cardinalMap = config.cardinalMap;
        this.seasonMap = config.seasonMap;
        this.unitMap = config.unitMap;
    }
    getSwiftDayOrMonth(source) {
        let trimmedSource = source.trim().toLowerCase();
        let swift = 0;
        if (recognizers_text_1.RegExpUtility.getMatches(this.nextPrefixRegex, trimmedSource).length > 0) {
            swift = 1;
        }
        else if (recognizers_text_1.RegExpUtility.getMatches(this.pastPrefixRegex, trimmedSource).length > 0) {
            swift = -1;
        }
        return swift;
    }
    getSwiftYear(source) {
        let trimmedSource = source.trim().toLowerCase();
        let swift = -10;
        if (recognizers_text_1.RegExpUtility.getMatches(this.nextPrefixRegex, trimmedSource).length > 0) {
            swift = 1;
        }
        else if (recognizers_text_1.RegExpUtility.getMatches(this.pastPrefixRegex, trimmedSource).length > 0) {
            swift = -1;
        }
        else if (recognizers_text_1.RegExpUtility.getMatches(this.thisPrefixRegex, trimmedSource).length > 0) {
            swift = 0;
        }
        return swift;
    }
    isFuture(source) {
        let trimmedSource = source.trim().toLowerCase();
        return (trimmedSource.startsWith('this') || trimmedSource.startsWith('next'));
    }
    isYearToDate(source) {
        let trimmedSource = source.trim().toLowerCase();
        return trimmedSource === 'year to date';
    }
    isMonthToDate(source) {
        let trimmedSource = source.trim().toLowerCase();
        return trimmedSource === 'month to date';
    }
    isWeekOnly(source) {
        let trimmedSource = source.trim().toLowerCase();
        return trimmedSource.endsWith('week');
    }
    isWeekend(source) {
        let trimmedSource = source.trim().toLowerCase();
        return trimmedSource.endsWith('weekend');
    }
    isMonthOnly(source) {
        let trimmedSource = source.trim().toLowerCase();
        return trimmedSource.endsWith('month');
    }
    isYearOnly(source) {
        let trimmedSource = source.trim().toLowerCase();
        return trimmedSource.endsWith('year');
    }
    isLastCardinal(source) {
        let trimmedSource = source.trim().toLowerCase();
        return trimmedSource === 'last';
    }
}
exports.EnglishDatePeriodParserConfiguration = EnglishDatePeriodParserConfiguration;
//# sourceMappingURL=datePeriodConfiguration.js.map