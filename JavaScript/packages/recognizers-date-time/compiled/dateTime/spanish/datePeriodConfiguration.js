"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const recognizers_text_1 = require("recognizers-text");
const recognizers_text_number_1 = require("recognizers-text-number");
const baseDate_1 = require("../baseDate");
const baseDuration_1 = require("../baseDuration");
const dateConfiguration_1 = require("./dateConfiguration");
const durationConfiguration_1 = require("./durationConfiguration");
const spanishDateTime_1 = require("../../resources/spanishDateTime");
class SpanishDatePeriodExtractorConfiguration {
    constructor() {
        this.simpleCasesRegexes = [
            recognizers_text_1.RegExpUtility.getSafeRegExp(spanishDateTime_1.SpanishDateTime.SimpleCasesRegex),
            recognizers_text_1.RegExpUtility.getSafeRegExp(spanishDateTime_1.SpanishDateTime.DayBetweenRegex),
            recognizers_text_1.RegExpUtility.getSafeRegExp(spanishDateTime_1.SpanishDateTime.SimpleCasesRegex),
            recognizers_text_1.RegExpUtility.getSafeRegExp(spanishDateTime_1.SpanishDateTime.DayBetweenRegex),
            recognizers_text_1.RegExpUtility.getSafeRegExp(spanishDateTime_1.SpanishDateTime.OneWordPeriodRegex),
            recognizers_text_1.RegExpUtility.getSafeRegExp(spanishDateTime_1.SpanishDateTime.MonthWithYearRegex),
            recognizers_text_1.RegExpUtility.getSafeRegExp(spanishDateTime_1.SpanishDateTime.MonthNumWithYearRegex),
            recognizers_text_1.RegExpUtility.getSafeRegExp(spanishDateTime_1.SpanishDateTime.YearRegex),
            recognizers_text_1.RegExpUtility.getSafeRegExp(spanishDateTime_1.SpanishDateTime.WeekOfMonthRegex),
            recognizers_text_1.RegExpUtility.getSafeRegExp(spanishDateTime_1.SpanishDateTime.WeekOfYearRegex),
            recognizers_text_1.RegExpUtility.getSafeRegExp(spanishDateTime_1.SpanishDateTime.MonthFrontBetweenRegex),
            recognizers_text_1.RegExpUtility.getSafeRegExp(spanishDateTime_1.SpanishDateTime.MonthFrontSimpleCasesRegex),
            recognizers_text_1.RegExpUtility.getSafeRegExp(spanishDateTime_1.SpanishDateTime.QuarterRegex),
            recognizers_text_1.RegExpUtility.getSafeRegExp(spanishDateTime_1.SpanishDateTime.QuarterRegexYearFront),
            recognizers_text_1.RegExpUtility.getSafeRegExp(spanishDateTime_1.SpanishDateTime.SeasonRegex),
            recognizers_text_1.RegExpUtility.getSafeRegExp(spanishDateTime_1.SpanishDateTime.RestOfDateRegex),
            recognizers_text_1.RegExpUtility.getSafeRegExp(spanishDateTime_1.SpanishDateTime.LaterEarlyPeriodRegex),
            recognizers_text_1.RegExpUtility.getSafeRegExp(spanishDateTime_1.SpanishDateTime.WeekWithWeekDayRangeRegex)
        ];
        this.tillRegex = recognizers_text_1.RegExpUtility.getSafeRegExp(spanishDateTime_1.SpanishDateTime.TillRegex);
        this.followedUnit = recognizers_text_1.RegExpUtility.getSafeRegExp(spanishDateTime_1.SpanishDateTime.FollowedDateUnit);
        this.numberCombinedWithUnit = recognizers_text_1.RegExpUtility.getSafeRegExp(spanishDateTime_1.SpanishDateTime.NumberCombinedWithDateUnit);
        this.pastRegex = recognizers_text_1.RegExpUtility.getSafeRegExp(spanishDateTime_1.SpanishDateTime.PastRegex);
        this.futureRegex = recognizers_text_1.RegExpUtility.getSafeRegExp(spanishDateTime_1.SpanishDateTime.FutureRegex);
        this.weekOfRegex = recognizers_text_1.RegExpUtility.getSafeRegExp(spanishDateTime_1.SpanishDateTime.WeekOfRegex);
        this.monthOfRegex = recognizers_text_1.RegExpUtility.getSafeRegExp(spanishDateTime_1.SpanishDateTime.MonthOfRegex);
        this.dateUnitRegex = recognizers_text_1.RegExpUtility.getSafeRegExp(spanishDateTime_1.SpanishDateTime.DateUnitRegex);
        this.inConnectorRegex = recognizers_text_1.RegExpUtility.getSafeRegExp(spanishDateTime_1.SpanishDateTime.InConnectorRegex);
        this.rangeUnitRegex = recognizers_text_1.RegExpUtility.getSafeRegExp(spanishDateTime_1.SpanishDateTime.RangeUnitRegex);
        this.fromRegex = recognizers_text_1.RegExpUtility.getSafeRegExp(spanishDateTime_1.SpanishDateTime.FromRegex);
        this.connectorAndRegex = recognizers_text_1.RegExpUtility.getSafeRegExp(spanishDateTime_1.SpanishDateTime.ConnectorAndRegex);
        this.betweenRegex = recognizers_text_1.RegExpUtility.getSafeRegExp(spanishDateTime_1.SpanishDateTime.BetweenRegex);
        this.datePointExtractor = new baseDate_1.BaseDateExtractor(new dateConfiguration_1.SpanishDateExtractorConfiguration());
        this.integerExtractor = new recognizers_text_number_1.SpanishIntegerExtractor();
        this.durationExtractor = new baseDuration_1.BaseDurationExtractor(new durationConfiguration_1.SpanishDurationExtractorConfiguration());
    }
    getFromTokenIndex(source) {
        return recognizers_text_1.RegExpUtility.getFirstMatchIndex(this.fromRegex, source);
    }
    getBetweenTokenIndex(source) {
        return recognizers_text_1.RegExpUtility.getFirstMatchIndex(this.betweenRegex, source);
    }
    hasConnectorToken(source) {
        return recognizers_text_1.RegExpUtility.getFirstMatchIndex(this.connectorAndRegex, source).matched;
    }
}
exports.SpanishDatePeriodExtractorConfiguration = SpanishDatePeriodExtractorConfiguration;
class SpanishDatePeriodParserConfiguration {
    constructor(config) {
        this.tokenBeforeDate = spanishDateTime_1.SpanishDateTime.TokenBeforeDate;
        this.cardinalExtractor = config.cardinalExtractor;
        this.numberParser = config.numberParser;
        this.durationExtractor = config.durationExtractor;
        this.dateExtractor = config.dateExtractor;
        this.durationParser = config.durationParser;
        this.dateParser = config.dateParser;
        this.monthFrontBetweenRegex = recognizers_text_1.RegExpUtility.getSafeRegExp(spanishDateTime_1.SpanishDateTime.MonthFrontBetweenRegex);
        this.betweenRegex = recognizers_text_1.RegExpUtility.getSafeRegExp(spanishDateTime_1.SpanishDateTime.DayBetweenRegex);
        this.monthFrontSimpleCasesRegex = recognizers_text_1.RegExpUtility.getSafeRegExp(spanishDateTime_1.SpanishDateTime.MonthFrontSimpleCasesRegex);
        this.simpleCasesRegex = recognizers_text_1.RegExpUtility.getSafeRegExp(spanishDateTime_1.SpanishDateTime.SimpleCasesRegex);
        this.oneWordPeriodRegex = recognizers_text_1.RegExpUtility.getSafeRegExp(spanishDateTime_1.SpanishDateTime.OneWordPeriodRegex);
        this.monthWithYear = recognizers_text_1.RegExpUtility.getSafeRegExp(spanishDateTime_1.SpanishDateTime.MonthWithYearRegex);
        this.monthNumWithYear = recognizers_text_1.RegExpUtility.getSafeRegExp(spanishDateTime_1.SpanishDateTime.MonthNumWithYearRegex);
        this.yearRegex = recognizers_text_1.RegExpUtility.getSafeRegExp(spanishDateTime_1.SpanishDateTime.YearRegex);
        this.pastRegex = recognizers_text_1.RegExpUtility.getSafeRegExp(spanishDateTime_1.SpanishDateTime.PastRegex);
        this.futureRegex = recognizers_text_1.RegExpUtility.getSafeRegExp(spanishDateTime_1.SpanishDateTime.FutureRegex);
        this.numberCombinedWithUnit = recognizers_text_1.RegExpUtility.getSafeRegExp(spanishDateTime_1.SpanishDateTime.DurationNumberCombinedWithUnit);
        this.weekOfMonthRegex = recognizers_text_1.RegExpUtility.getSafeRegExp(spanishDateTime_1.SpanishDateTime.WeekOfMonthRegex);
        this.weekOfYearRegex = recognizers_text_1.RegExpUtility.getSafeRegExp(spanishDateTime_1.SpanishDateTime.WeekOfYearRegex);
        this.quarterRegex = recognizers_text_1.RegExpUtility.getSafeRegExp(spanishDateTime_1.SpanishDateTime.QuarterRegex);
        this.quarterRegexYearFront = recognizers_text_1.RegExpUtility.getSafeRegExp(spanishDateTime_1.SpanishDateTime.QuarterRegexYearFront);
        this.seasonRegex = recognizers_text_1.RegExpUtility.getSafeRegExp(spanishDateTime_1.SpanishDateTime.SeasonRegex);
        this.whichWeekRegex = recognizers_text_1.RegExpUtility.getSafeRegExp(spanishDateTime_1.SpanishDateTime.WhichWeekRegex);
        this.weekOfRegex = recognizers_text_1.RegExpUtility.getSafeRegExp(spanishDateTime_1.SpanishDateTime.WeekOfRegex);
        this.monthOfRegex = recognizers_text_1.RegExpUtility.getSafeRegExp(spanishDateTime_1.SpanishDateTime.MonthOfRegex);
        this.restOfDateRegex = recognizers_text_1.RegExpUtility.getSafeRegExp(spanishDateTime_1.SpanishDateTime.RestOfDateRegex);
        this.laterEarlyPeriodRegex = recognizers_text_1.RegExpUtility.getSafeRegExp(spanishDateTime_1.SpanishDateTime.LaterEarlyPeriodRegex);
        this.weekWithWeekDayRangeRegex = recognizers_text_1.RegExpUtility.getSafeRegExp(spanishDateTime_1.SpanishDateTime.WeekWithWeekDayRangeRegex);
        this.nextPrefixRegex = recognizers_text_1.RegExpUtility.getSafeRegExp(spanishDateTime_1.SpanishDateTime.NextPrefixRegex);
        this.pastPrefixRegex = recognizers_text_1.RegExpUtility.getSafeRegExp(spanishDateTime_1.SpanishDateTime.PastPrefixRegex);
        this.thisPrefixRegex = recognizers_text_1.RegExpUtility.getSafeRegExp(spanishDateTime_1.SpanishDateTime.ThisPrefixRegex);
        this.inConnectorRegex = config.utilityConfiguration.inConnectorRegex;
        this.unitMap = config.unitMap;
        this.cardinalMap = config.cardinalMap;
        this.dayOfMonth = config.dayOfMonth;
        this.monthOfYear = config.monthOfYear;
        this.seasonMap = config.seasonMap;
    }
    getSwiftDayOrMonth(source) {
        let trimedText = source.trim().toLowerCase();
        let swift = 0;
        if (recognizers_text_1.RegExpUtility.getFirstMatchIndex(this.nextPrefixRegex, trimedText).matched) {
            swift = 1;
        }
        if (recognizers_text_1.RegExpUtility.getFirstMatchIndex(this.pastPrefixRegex, trimedText).matched) {
            swift = -1;
        }
        return swift;
    }
    getSwiftYear(source) {
        let trimedText = source.trim().toLowerCase();
        let swift = -10;
        if (recognizers_text_1.RegExpUtility.getFirstMatchIndex(this.nextPrefixRegex, trimedText).matched) {
            swift = 1;
        }
        if (recognizers_text_1.RegExpUtility.getFirstMatchIndex(this.pastPrefixRegex, trimedText).matched) {
            swift = -1;
        }
        else if (recognizers_text_1.RegExpUtility.getFirstMatchIndex(this.thisPrefixRegex, trimedText).matched) {
            swift = 0;
        }
        return swift;
    }
    isFuture(source) {
        let trimedText = source.trim().toLowerCase();
        return recognizers_text_1.RegExpUtility.getFirstMatchIndex(this.thisPrefixRegex, trimedText).matched
            || recognizers_text_1.RegExpUtility.getFirstMatchIndex(this.nextPrefixRegex, trimedText).matched;
    }
    isYearToDate(source) {
        let trimedText = source.trim().toLowerCase();
        return trimedText === "año a la fecha"
            || trimedText === "años a la fecha";
    }
    isMonthToDate(source) {
        let trimedText = source.trim().toLowerCase();
        return trimedText === "mes a la fecha"
            || trimedText === "meses a la fecha";
    }
    isWeekOnly(source) {
        let trimedText = source.trim().toLowerCase();
        return trimedText.endsWith("semana")
            && !trimedText.endsWith("fin de semana");
    }
    isWeekend(source) {
        let trimedText = source.trim().toLowerCase();
        return trimedText.endsWith("fin de semana");
    }
    isMonthOnly(source) {
        let trimedText = source.trim().toLowerCase();
        return trimedText.endsWith("mes")
            || trimedText.endsWith("meses");
    }
    isYearOnly(source) {
        let trimedText = source.trim().toLowerCase();
        return trimedText.endsWith("año")
            || trimedText.endsWith("años");
    }
    isLastCardinal(source) {
        let trimedText = source.trim().toLowerCase();
        return recognizers_text_1.RegExpUtility.getFirstMatchIndex(this.pastPrefixRegex, trimedText).matched;
    }
}
exports.SpanishDatePeriodParserConfiguration = SpanishDatePeriodParserConfiguration;
//# sourceMappingURL=datePeriodConfiguration.js.map