"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const recognizers_text_1 = require("recognizers-text");
const recognizers_text_number_1 = require("recognizers-text-number");
const baseDate_1 = require("../baseDate");
const baseTime_1 = require("../baseTime");
const baseDateTime_1 = require("../baseDateTime");
const baseDuration_1 = require("../baseDuration");
const dateConfiguration_1 = require("./dateConfiguration");
const dateTimeConfiguration_1 = require("./dateTimeConfiguration");
const durationConfiguration_1 = require("./durationConfiguration");
const spanishDateTime_1 = require("../../resources/spanishDateTime");
const timeConfiguration_1 = require("./timeConfiguration");
const baseTimePeriod_1 = require("../baseTimePeriod");
const timePeriodConfiguration_1 = require("./timePeriodConfiguration");
class SpanishDateTimePeriodExtractorConfiguration {
    constructor() {
        this.simpleCasesRegexes = [
            recognizers_text_1.RegExpUtility.getSafeRegExp(spanishDateTime_1.SpanishDateTime.PureNumFromTo),
            recognizers_text_1.RegExpUtility.getSafeRegExp(spanishDateTime_1.SpanishDateTime.PureNumBetweenAnd)
        ];
        this.prepositionRegex = recognizers_text_1.RegExpUtility.getSafeRegExp(spanishDateTime_1.SpanishDateTime.PrepositionRegex);
        this.tillRegex = recognizers_text_1.RegExpUtility.getSafeRegExp(spanishDateTime_1.SpanishDateTime.TillRegex);
        this.specificTimeOfDayRegex = recognizers_text_1.RegExpUtility.getSafeRegExp(spanishDateTime_1.SpanishDateTime.SpecificTimeOfDayRegex);
        this.timeOfDayRegex = recognizers_text_1.RegExpUtility.getSafeRegExp(spanishDateTime_1.SpanishDateTime.TimeOfDayRegex);
        this.followedUnit = recognizers_text_1.RegExpUtility.getSafeRegExp(spanishDateTime_1.SpanishDateTime.FollowedUnit);
        this.timeUnitRegex = recognizers_text_1.RegExpUtility.getSafeRegExp(spanishDateTime_1.SpanishDateTime.UnitRegex);
        this.pastPrefixRegex = recognizers_text_1.RegExpUtility.getSafeRegExp(spanishDateTime_1.SpanishDateTime.PastRegex);
        this.nextPrefixRegex = recognizers_text_1.RegExpUtility.getSafeRegExp(spanishDateTime_1.SpanishDateTime.FutureRegex);
        this.numberCombinedWithUnit = recognizers_text_1.RegExpUtility.getSafeRegExp(spanishDateTime_1.SpanishDateTime.DateTimePeriodNumberCombinedWithUnit);
        this.weekDayRegex = recognizers_text_1.RegExpUtility.getSafeRegExp(spanishDateTime_1.SpanishDateTime.WeekDayRegex);
        this.periodTimeOfDayWithDateRegex = recognizers_text_1.RegExpUtility.getSafeRegExp(spanishDateTime_1.SpanishDateTime.PeriodTimeOfDayWithDateRegex);
        this.relativeTimeUnitRegex = recognizers_text_1.RegExpUtility.getSafeRegExp(spanishDateTime_1.SpanishDateTime.RelativeTimeUnitRegex);
        this.restOfDateTimeRegex = recognizers_text_1.RegExpUtility.getSafeRegExp(spanishDateTime_1.SpanishDateTime.RestOfDateTimeRegex);
        this.generalEndingRegex = recognizers_text_1.RegExpUtility.getSafeRegExp(spanishDateTime_1.SpanishDateTime.GeneralEndingRegex);
        this.middlePauseRegex = recognizers_text_1.RegExpUtility.getSafeRegExp(spanishDateTime_1.SpanishDateTime.MiddlePauseRegex);
        this.fromRegex = recognizers_text_1.RegExpUtility.getSafeRegExp(spanishDateTime_1.SpanishDateTime.FromRegex);
        this.connectorAndRegex = recognizers_text_1.RegExpUtility.getSafeRegExp(spanishDateTime_1.SpanishDateTime.ConnectorAndRegex);
        this.betweenRegex = recognizers_text_1.RegExpUtility.getSafeRegExp(spanishDateTime_1.SpanishDateTime.BetweenRegex);
        this.cardinalExtractor = new recognizers_text_number_1.SpanishCardinalExtractor();
        this.singleDateExtractor = new baseDate_1.BaseDateExtractor(new dateConfiguration_1.SpanishDateExtractorConfiguration());
        this.singleTimeExtractor = new baseTime_1.BaseTimeExtractor(new timeConfiguration_1.SpanishTimeExtractorConfiguration());
        this.singleDateTimeExtractor = new baseDateTime_1.BaseDateTimeExtractor(new dateTimeConfiguration_1.SpanishDateTimeExtractorConfiguration());
        this.durationExtractor = new baseDuration_1.BaseDurationExtractor(new durationConfiguration_1.SpanishDurationExtractorConfiguration());
        this.timePeriodExtractor = new baseTimePeriod_1.BaseTimePeriodExtractor(new timePeriodConfiguration_1.SpanishTimePeriodExtractorConfiguration());
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
exports.SpanishDateTimePeriodExtractorConfiguration = SpanishDateTimePeriodExtractorConfiguration;
class SpanishDateTimePeriodParserConfiguration {
    constructor(config) {
        this.dateExtractor = config.dateExtractor;
        this.timeExtractor = config.timeExtractor;
        this.dateTimeExtractor = config.dateTimeExtractor;
        this.timePeriodExtractor = config.timePeriodExtractor;
        this.cardinalExtractor = config.cardinalExtractor;
        this.durationExtractor = config.durationExtractor;
        this.numberParser = config.numberParser;
        this.dateParser = config.dateParser;
        this.timeParser = config.timeParser;
        this.dateTimeParser = config.dateTimeParser;
        this.timePeriodParser = config.timePeriodParser;
        this.durationParser = config.durationParser;
        this.unitMap = config.unitMap;
        this.numbers = config.numbers;
        this.nextPrefixRegex = recognizers_text_1.RegExpUtility.getSafeRegExp(spanishDateTime_1.SpanishDateTime.NextPrefixRegex);
        this.pastPrefixRegex = recognizers_text_1.RegExpUtility.getSafeRegExp(spanishDateTime_1.SpanishDateTime.PastPrefixRegex);
        this.thisPrefixRegex = recognizers_text_1.RegExpUtility.getSafeRegExp(spanishDateTime_1.SpanishDateTime.ThisPrefixRegex);
        this.pureNumberFromToRegex = recognizers_text_1.RegExpUtility.getSafeRegExp(spanishDateTime_1.SpanishDateTime.PureNumFromTo);
        this.pureNumberBetweenAndRegex = recognizers_text_1.RegExpUtility.getSafeRegExp(spanishDateTime_1.SpanishDateTime.PureNumBetweenAnd);
        this.specificTimeOfDayRegex = recognizers_text_1.RegExpUtility.getSafeRegExp(spanishDateTime_1.SpanishDateTime.SpecificTimeOfDayRegex);
        this.timeOfDayRegex = recognizers_text_1.RegExpUtility.getSafeRegExp(spanishDateTime_1.SpanishDateTime.TimeOfDayRegex);
        this.pastRegex = recognizers_text_1.RegExpUtility.getSafeRegExp(spanishDateTime_1.SpanishDateTime.PastRegex);
        this.futureRegex = recognizers_text_1.RegExpUtility.getSafeRegExp(spanishDateTime_1.SpanishDateTime.FutureRegex);
        this.numberCombinedWithUnitRegex = recognizers_text_1.RegExpUtility.getSafeRegExp(spanishDateTime_1.SpanishDateTime.DateTimePeriodNumberCombinedWithUnit);
        this.unitRegex = recognizers_text_1.RegExpUtility.getSafeRegExp(spanishDateTime_1.SpanishDateTime.UnitRegex);
        this.periodTimeOfDayWithDateRegex = recognizers_text_1.RegExpUtility.getSafeRegExp(spanishDateTime_1.SpanishDateTime.PeriodTimeOfDayWithDateRegex);
        this.relativeTimeUnitRegex = recognizers_text_1.RegExpUtility.getSafeRegExp(spanishDateTime_1.SpanishDateTime.RelativeTimeUnitRegex);
        this.restOfDateTimeRegex = recognizers_text_1.RegExpUtility.getSafeRegExp(spanishDateTime_1.SpanishDateTime.RestOfDateTimeRegex);
    }
    getMatchedTimeRange(source) {
        let trimedText = source.trim().toLowerCase();
        let timeStr = "";
        let beginHour = 0;
        let endHour = 0;
        let endMin = 0;
        if (trimedText.endsWith("madrugada")) {
            timeStr = "TDA";
            beginHour = 4;
            endHour = 8;
        }
        else if (trimedText.endsWith("mañana")) {
            timeStr = "TMO";
            beginHour = 8;
            endHour = 12;
        }
        else if (trimedText.includes("pasado mediodia") || trimedText.includes("pasado el mediodia")) {
            timeStr = "TAF";
            beginHour = 12;
            endHour = 16;
        }
        else if (trimedText.endsWith("tarde")) {
            timeStr = "TEV";
            beginHour = 16;
            endHour = 20;
        }
        else if (trimedText.endsWith("noche")) {
            timeStr = "TNI";
            beginHour = 20;
            endHour = 23;
            endMin = 59;
        }
        else {
            timeStr = null;
            return {
                success: false,
                timeStr,
                beginHour,
                endHour,
                endMin
            };
        }
        return {
            success: true,
            timeStr,
            beginHour,
            endHour,
            endMin
        };
    }
    getSwiftPrefix(source) {
        let trimedText = source.trim().toLowerCase();
        let swift = 0;
        // TODO: Replace with a regex
        if (recognizers_text_1.RegExpUtility.getFirstMatchIndex(this.pastPrefixRegex, trimedText).matched ||
            trimedText === "anoche") {
            swift = -1;
        }
        else if (recognizers_text_1.RegExpUtility.getFirstMatchIndex(this.nextPrefixRegex, trimedText).matched) {
            swift = 1;
        }
        return swift;
    }
}
exports.SpanishDateTimePeriodParserConfiguration = SpanishDateTimePeriodParserConfiguration;
//# sourceMappingURL=dateTimePeriodConfiguration.js.map