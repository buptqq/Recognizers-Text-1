"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const recognizers_text_1 = require("recognizers-text");
const recognizers_text_number_1 = require("recognizers-text-number");
const baseDate_1 = require("../baseDate");
const baseDuration_1 = require("../baseDuration");
const dateConfiguration_1 = require("./dateConfiguration");
const durationConfiguration_1 = require("./durationConfiguration");
const frenchDateTime_1 = require("../../resources/frenchDateTime");
class FrenchDatePeriodExtractorConfiguration {
    constructor() {
        this.simpleCasesRegexes = [
            recognizers_text_1.RegExpUtility.getSafeRegExp(frenchDateTime_1.FrenchDateTime.SimpleCasesRegex),
            recognizers_text_1.RegExpUtility.getSafeRegExp(frenchDateTime_1.FrenchDateTime.BetweenRegex),
            recognizers_text_1.RegExpUtility.getSafeRegExp(frenchDateTime_1.FrenchDateTime.OneWordPeriodRegex),
            recognizers_text_1.RegExpUtility.getSafeRegExp(frenchDateTime_1.FrenchDateTime.MonthWithYear),
            recognizers_text_1.RegExpUtility.getSafeRegExp(frenchDateTime_1.FrenchDateTime.MonthNumWithYear),
            recognizers_text_1.RegExpUtility.getSafeRegExp(frenchDateTime_1.FrenchDateTime.YearRegex),
            recognizers_text_1.RegExpUtility.getSafeRegExp(frenchDateTime_1.FrenchDateTime.WeekDayOfMonthRegex),
            recognizers_text_1.RegExpUtility.getSafeRegExp(frenchDateTime_1.FrenchDateTime.WeekOfYearRegex),
            recognizers_text_1.RegExpUtility.getSafeRegExp(frenchDateTime_1.FrenchDateTime.MonthFrontBetweenRegex),
            recognizers_text_1.RegExpUtility.getSafeRegExp(frenchDateTime_1.FrenchDateTime.MonthFrontSimpleCasesRegex),
            recognizers_text_1.RegExpUtility.getSafeRegExp(frenchDateTime_1.FrenchDateTime.QuarterRegex),
            recognizers_text_1.RegExpUtility.getSafeRegExp(frenchDateTime_1.FrenchDateTime.QuarterRegexYearFront),
            recognizers_text_1.RegExpUtility.getSafeRegExp(frenchDateTime_1.FrenchDateTime.SeasonRegex),
            recognizers_text_1.RegExpUtility.getSafeRegExp(frenchDateTime_1.FrenchDateTime.PastSuffixRegex),
            recognizers_text_1.RegExpUtility.getSafeRegExp(frenchDateTime_1.FrenchDateTime.NextSuffixRegex),
            recognizers_text_1.RegExpUtility.getSafeRegExp(frenchDateTime_1.FrenchDateTime.ThisPrefixRegex),
            recognizers_text_1.RegExpUtility.getSafeRegExp(frenchDateTime_1.FrenchDateTime.LaterEarlyPeriodRegex),
            recognizers_text_1.RegExpUtility.getSafeRegExp(frenchDateTime_1.FrenchDateTime.WeekWithWeekDayRangeRegex)
        ];
        this.tillRegex = recognizers_text_1.RegExpUtility.getSafeRegExp(frenchDateTime_1.FrenchDateTime.TillRegex);
        this.followedUnit = recognizers_text_1.RegExpUtility.getSafeRegExp(frenchDateTime_1.FrenchDateTime.FollowedDateUnit);
        this.numberCombinedWithUnit = recognizers_text_1.RegExpUtility.getSafeRegExp(frenchDateTime_1.FrenchDateTime.NumberCombinedWithDateUnit);
        this.pastRegex = recognizers_text_1.RegExpUtility.getSafeRegExp(frenchDateTime_1.FrenchDateTime.PastSuffixRegex);
        this.futureRegex = recognizers_text_1.RegExpUtility.getSafeRegExp(frenchDateTime_1.FrenchDateTime.NextSuffixRegex);
        this.weekOfRegex = recognizers_text_1.RegExpUtility.getSafeRegExp(frenchDateTime_1.FrenchDateTime.WeekOfRegex);
        this.monthOfRegex = recognizers_text_1.RegExpUtility.getSafeRegExp(frenchDateTime_1.FrenchDateTime.MonthOfRegex);
        this.dateUnitRegex = recognizers_text_1.RegExpUtility.getSafeRegExp(frenchDateTime_1.FrenchDateTime.DateUnitRegex);
        this.inConnectorRegex = recognizers_text_1.RegExpUtility.getSafeRegExp(frenchDateTime_1.FrenchDateTime.InConnectorRegex);
        this.rangeUnitRegex = recognizers_text_1.RegExpUtility.getSafeRegExp(frenchDateTime_1.FrenchDateTime.RangeUnitRegex);
        this.weekDayOfMonthRegex = recognizers_text_1.RegExpUtility.getSafeRegExp(frenchDateTime_1.FrenchDateTime.WeekDayOfMonthRegex);
        this.fromRegex = recognizers_text_1.RegExpUtility.getSafeRegExp(frenchDateTime_1.FrenchDateTime.FromRegex);
        this.connectorAndRegex = recognizers_text_1.RegExpUtility.getSafeRegExp(frenchDateTime_1.FrenchDateTime.ConnectorAndRegex);
        this.beforeRegex = recognizers_text_1.RegExpUtility.getSafeRegExp(frenchDateTime_1.FrenchDateTime.BeforeRegex2);
        this.datePointExtractor = new baseDate_1.BaseDateExtractor(new dateConfiguration_1.FrenchDateExtractorConfiguration());
        this.integerExtractor = new recognizers_text_number_1.FrenchIntegerExtractor();
        this.durationExtractor = new baseDuration_1.BaseDurationExtractor(new durationConfiguration_1.FrenchDurationExtractorConfiguration());
    }
    getFromTokenIndex(source) {
        return recognizers_text_1.RegExpUtility.getFirstMatchIndex(this.fromRegex, source);
    }
    getBetweenTokenIndex(source) {
        return recognizers_text_1.RegExpUtility.getFirstMatchIndex(this.beforeRegex, source);
    }
    hasConnectorToken(source) {
        return recognizers_text_1.RegExpUtility.getFirstMatchIndex(this.connectorAndRegex, source).matched;
    }
}
exports.FrenchDatePeriodExtractorConfiguration = FrenchDatePeriodExtractorConfiguration;
class FrenchDatePeriodParserConfiguration {
    constructor(config) {
        this.tokenBeforeDate = frenchDateTime_1.FrenchDateTime.TokenBeforeDate;
        this.cardinalExtractor = config.cardinalExtractor;
        this.numberParser = config.numberParser;
        this.durationExtractor = config.durationExtractor;
        this.dateExtractor = config.dateExtractor;
        this.durationParser = config.durationParser;
        this.dateParser = config.dateParser;
        this.monthFrontBetweenRegex = recognizers_text_1.RegExpUtility.getSafeRegExp(frenchDateTime_1.FrenchDateTime.MonthFrontBetweenRegex);
        this.betweenRegex = recognizers_text_1.RegExpUtility.getSafeRegExp(frenchDateTime_1.FrenchDateTime.BetweenRegex);
        this.monthFrontSimpleCasesRegex = recognizers_text_1.RegExpUtility.getSafeRegExp(frenchDateTime_1.FrenchDateTime.MonthFrontSimpleCasesRegex);
        this.simpleCasesRegex = recognizers_text_1.RegExpUtility.getSafeRegExp(frenchDateTime_1.FrenchDateTime.SimpleCasesRegex);
        this.oneWordPeriodRegex = recognizers_text_1.RegExpUtility.getSafeRegExp(frenchDateTime_1.FrenchDateTime.OneWordPeriodRegex);
        this.monthWithYear = recognizers_text_1.RegExpUtility.getSafeRegExp(frenchDateTime_1.FrenchDateTime.MonthWithYear);
        this.monthNumWithYear = recognizers_text_1.RegExpUtility.getSafeRegExp(frenchDateTime_1.FrenchDateTime.MonthNumWithYear);
        this.yearRegex = recognizers_text_1.RegExpUtility.getSafeRegExp(frenchDateTime_1.FrenchDateTime.YearRegex);
        this.pastRegex = recognizers_text_1.RegExpUtility.getSafeRegExp(frenchDateTime_1.FrenchDateTime.PastSuffixRegex);
        this.futureRegex = recognizers_text_1.RegExpUtility.getSafeRegExp(frenchDateTime_1.FrenchDateTime.NextSuffixRegex);
        this.numberCombinedWithUnit = recognizers_text_1.RegExpUtility.getSafeRegExp(frenchDateTime_1.FrenchDateTime.NumberCombinedWithDurationUnit);
        this.weekOfMonthRegex = recognizers_text_1.RegExpUtility.getSafeRegExp(frenchDateTime_1.FrenchDateTime.WeekOfMonthRegex);
        this.weekOfYearRegex = recognizers_text_1.RegExpUtility.getSafeRegExp(frenchDateTime_1.FrenchDateTime.WeekOfYearRegex);
        this.quarterRegex = recognizers_text_1.RegExpUtility.getSafeRegExp(frenchDateTime_1.FrenchDateTime.QuarterRegex);
        this.quarterRegexYearFront = recognizers_text_1.RegExpUtility.getSafeRegExp(frenchDateTime_1.FrenchDateTime.QuarterRegexYearFront);
        this.seasonRegex = recognizers_text_1.RegExpUtility.getSafeRegExp(frenchDateTime_1.FrenchDateTime.SeasonRegex);
        this.whichWeekRegex = recognizers_text_1.RegExpUtility.getSafeRegExp(frenchDateTime_1.FrenchDateTime.WhichWeekRegex);
        this.weekOfRegex = recognizers_text_1.RegExpUtility.getSafeRegExp(frenchDateTime_1.FrenchDateTime.WeekOfRegex);
        this.monthOfRegex = recognizers_text_1.RegExpUtility.getSafeRegExp(frenchDateTime_1.FrenchDateTime.MonthOfRegex);
        this.restOfDateRegex = recognizers_text_1.RegExpUtility.getSafeRegExp(frenchDateTime_1.FrenchDateTime.RestOfDateRegex);
        this.nextPrefixRegex = recognizers_text_1.RegExpUtility.getSafeRegExp("(prochain|prochaine)\b");
        this.pastPrefixRegex = recognizers_text_1.RegExpUtility.getSafeRegExp("(dernier)\b");
        this.thisPrefixRegex = recognizers_text_1.RegExpUtility.getSafeRegExp("(ce|cette)\b");
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
        if (trimedText.endsWith("prochain") || trimedText.endsWith("prochaine")) {
            swift = 1;
        }
        if (trimedText.endsWith("dernière") ||
            trimedText.endsWith("dernières") ||
            trimedText.endsWith("derniere") ||
            trimedText.endsWith("dernieres")) {
            swift = -1;
        }
        return swift;
    }
    getSwiftYear(source) {
        let trimedText = source.trim().toLowerCase();
        let swift = -10;
        if (trimedText.endsWith("prochain") || trimedText.endsWith("prochaine")) {
            swift = 1;
        }
        if (trimedText.endsWith("dernières") ||
            trimedText.endsWith("dernière") ||
            trimedText.endsWith("dernieres") ||
            trimedText.endsWith("derniere") ||
            trimedText.endsWith("dernier")) {
            swift = -1;
        }
        else if (trimedText.startsWith("cette")) {
            swift = 0;
        }
        return swift;
    }
    isFuture(source) {
        let trimedText = source.trim().toLowerCase();
        return (trimedText.startsWith("cette") ||
            trimedText.endsWith("prochaine") ||
            trimedText.endsWith("prochain"));
    }
    isYearToDate(source) {
        let trimedText = source.trim().toLowerCase();
        return (trimedText === "année à ce jour" ||
            trimedText === "an à ce jour");
    }
    isMonthToDate(source) {
        let trimedText = source.trim().toLowerCase();
        return trimedText === "mois à ce jour";
    }
    isWeekOnly(source) {
        let trimedText = source.trim().toLowerCase();
        return (trimedText.endsWith("semaine") &&
            !trimedText.endsWith("fin de semaine"));
    }
    isWeekend(source) {
        let trimedText = source.trim().toLowerCase();
        return (trimedText.endsWith("fin de semaine") ||
            trimedText.endsWith("le weekend"));
    }
    isMonthOnly(source) {
        let trimedText = source.trim().toLowerCase();
        return trimedText.endsWith("mois");
    }
    isYearOnly(source) {
        let trimedText = source.trim().toLowerCase();
        return (trimedText.endsWith("années") ||
            trimedText.endsWith("ans") ||
            (trimedText.endsWith("l'annees") ||
                trimedText.endsWith("l'annee")));
    }
    isLastCardinal(source) {
        let trimedText = source.trim().toLowerCase();
        return (trimedText === "dernières" ||
            trimedText === "dernière" ||
            trimedText === "dernieres" ||
            trimedText === "derniere" ||
            trimedText === "dernier");
    }
}
exports.FrenchDatePeriodParserConfiguration = FrenchDatePeriodParserConfiguration;
//# sourceMappingURL=datePeriodConfiguration.js.map