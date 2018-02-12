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
const frenchDateTime_1 = require("../../resources/frenchDateTime");
const timeConfiguration_1 = require("./timeConfiguration");
const baseTimePeriod_1 = require("../baseTimePeriod");
const timePeriodConfiguration_1 = require("./timePeriodConfiguration");
class FrenchDateTimePeriodExtractorConfiguration {
    constructor() {
        this.simpleCasesRegexes = [
            recognizers_text_1.RegExpUtility.getSafeRegExp(frenchDateTime_1.FrenchDateTime.PureNumFromTo),
            recognizers_text_1.RegExpUtility.getSafeRegExp(frenchDateTime_1.FrenchDateTime.PureNumBetweenAnd),
            recognizers_text_1.RegExpUtility.getSafeRegExp(frenchDateTime_1.FrenchDateTime.SpecificTimeOfDayRegex)
        ];
        this.prepositionRegex = recognizers_text_1.RegExpUtility.getSafeRegExp(frenchDateTime_1.FrenchDateTime.PrepositionRegex);
        this.tillRegex = recognizers_text_1.RegExpUtility.getSafeRegExp(frenchDateTime_1.FrenchDateTime.TillRegex);
        this.specificTimeOfDayRegex = recognizers_text_1.RegExpUtility.getSafeRegExp(frenchDateTime_1.FrenchDateTime.PeriodSpecificTimeOfDayRegex);
        this.timeOfDayRegex = recognizers_text_1.RegExpUtility.getSafeRegExp(frenchDateTime_1.FrenchDateTime.PeriodTimeOfDayRegex);
        this.followedUnit = recognizers_text_1.RegExpUtility.getSafeRegExp(frenchDateTime_1.FrenchDateTime.TimeFollowedUnit);
        this.timeUnitRegex = recognizers_text_1.RegExpUtility.getSafeRegExp(frenchDateTime_1.FrenchDateTime.TimeUnitRegex);
        this.pastPrefixRegex = recognizers_text_1.RegExpUtility.getSafeRegExp(frenchDateTime_1.FrenchDateTime.PastSuffixRegex);
        this.nextPrefixRegex = recognizers_text_1.RegExpUtility.getSafeRegExp(frenchDateTime_1.FrenchDateTime.NextSuffixRegex);
        this.numberCombinedWithUnit = recognizers_text_1.RegExpUtility.getSafeRegExp(frenchDateTime_1.FrenchDateTime.TimeNumberCombinedWithUnit);
        this.weekDayRegex = recognizers_text_1.RegExpUtility.getSafeRegExp(frenchDateTime_1.FrenchDateTime.WeekDayRegex);
        this.periodTimeOfDayWithDateRegex = recognizers_text_1.RegExpUtility.getSafeRegExp(frenchDateTime_1.FrenchDateTime.PeriodTimeOfDayWithDateRegex);
        this.relativeTimeUnitRegex = recognizers_text_1.RegExpUtility.getSafeRegExp(frenchDateTime_1.FrenchDateTime.RelativeTimeUnitRegex);
        this.restOfDateTimeRegex = recognizers_text_1.RegExpUtility.getSafeRegExp(frenchDateTime_1.FrenchDateTime.RestOfDateTimeRegex);
        this.generalEndingRegex = recognizers_text_1.RegExpUtility.getSafeRegExp(frenchDateTime_1.FrenchDateTime.GeneralEndingRegex);
        this.middlePauseRegex = recognizers_text_1.RegExpUtility.getSafeRegExp(frenchDateTime_1.FrenchDateTime.MiddlePauseRegex);
        this.fromRegex = recognizers_text_1.RegExpUtility.getSafeRegExp(frenchDateTime_1.FrenchDateTime.FromRegex2);
        this.connectorAndRegex = recognizers_text_1.RegExpUtility.getSafeRegExp(frenchDateTime_1.FrenchDateTime.ConnectorAndRegex);
        this.beforeRegex = recognizers_text_1.RegExpUtility.getSafeRegExp(frenchDateTime_1.FrenchDateTime.BeforeRegex);
        this.cardinalExtractor = new recognizers_text_number_1.FrenchCardinalExtractor();
        this.singleDateExtractor = new baseDate_1.BaseDateExtractor(new dateConfiguration_1.FrenchDateExtractorConfiguration());
        this.singleTimeExtractor = new baseTime_1.BaseTimeExtractor(new timeConfiguration_1.FrenchTimeExtractorConfiguration());
        this.singleDateTimeExtractor = new baseDateTime_1.BaseDateTimeExtractor(new dateTimeConfiguration_1.FrenchDateTimeExtractorConfiguration());
        this.durationExtractor = new baseDuration_1.BaseDurationExtractor(new durationConfiguration_1.FrenchDurationExtractorConfiguration());
        this.timePeriodExtractor = new baseTimePeriod_1.BaseTimePeriodExtractor(new timePeriodConfiguration_1.FrenchTimePeriodExtractorConfiguration());
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
exports.FrenchDateTimePeriodExtractorConfiguration = FrenchDateTimePeriodExtractorConfiguration;
class FrenchDateTimePeriodParserConfiguration {
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
        this.nextPrefixRegex = recognizers_text_1.RegExpUtility.getSafeRegExp(frenchDateTime_1.FrenchDateTime.NextSuffixRegex);
        this.pastPrefixRegex = recognizers_text_1.RegExpUtility.getSafeRegExp(frenchDateTime_1.FrenchDateTime.PastSuffixRegex);
        this.thisPrefixRegex = recognizers_text_1.RegExpUtility.getSafeRegExp(frenchDateTime_1.FrenchDateTime.ThisPrefixRegex);
        this.morningStartEndRegex = recognizers_text_1.RegExpUtility.getSafeRegExp(frenchDateTime_1.FrenchDateTime.MorningStartEndRegex);
        this.afternoonStartEndRegex = recognizers_text_1.RegExpUtility.getSafeRegExp(frenchDateTime_1.FrenchDateTime.AfternoonStartEndRegex);
        this.eveningStartEndRegex = recognizers_text_1.RegExpUtility.getSafeRegExp(frenchDateTime_1.FrenchDateTime.EveningStartEndRegex);
        this.nightStartEndRegex = recognizers_text_1.RegExpUtility.getSafeRegExp(frenchDateTime_1.FrenchDateTime.NightStartEndRegex);
        this.pureNumberFromToRegex = recognizers_text_1.RegExpUtility.getSafeRegExp(frenchDateTime_1.FrenchDateTime.PureNumFromTo);
        this.pureNumberBetweenAndRegex = recognizers_text_1.RegExpUtility.getSafeRegExp(frenchDateTime_1.FrenchDateTime.PureNumBetweenAnd);
        this.specificTimeOfDayRegex = recognizers_text_1.RegExpUtility.getSafeRegExp(frenchDateTime_1.FrenchDateTime.SpecificTimeOfDayRegex);
        this.timeOfDayRegex = recognizers_text_1.RegExpUtility.getSafeRegExp(frenchDateTime_1.FrenchDateTime.TimeOfDayRegex);
        this.pastRegex = recognizers_text_1.RegExpUtility.getSafeRegExp(frenchDateTime_1.FrenchDateTime.PastSuffixRegex);
        this.futureRegex = recognizers_text_1.RegExpUtility.getSafeRegExp(frenchDateTime_1.FrenchDateTime.NextSuffixRegex);
        this.numberCombinedWithUnitRegex = recognizers_text_1.RegExpUtility.getSafeRegExp(frenchDateTime_1.FrenchDateTime.TimeNumberCombinedWithUnit);
        this.unitRegex = recognizers_text_1.RegExpUtility.getSafeRegExp(frenchDateTime_1.FrenchDateTime.TimeUnitRegex);
        this.periodTimeOfDayWithDateRegex = recognizers_text_1.RegExpUtility.getSafeRegExp(frenchDateTime_1.FrenchDateTime.PeriodTimeOfDayWithDateRegex);
        this.relativeTimeUnitRegex = recognizers_text_1.RegExpUtility.getSafeRegExp(frenchDateTime_1.FrenchDateTime.RelativeTimeUnitRegex);
        this.restOfDateTimeRegex = recognizers_text_1.RegExpUtility.getSafeRegExp(frenchDateTime_1.FrenchDateTime.RestOfDateTimeRegex);
    }
    getMatchedTimeRange(source) {
        let trimedText = source.trim().toLowerCase();
        let timeStr = "";
        let beginHour = 0;
        let endHour = 0;
        let endMin = 0;
        if (recognizers_text_1.RegExpUtility.getFirstMatchIndex(this.morningStartEndRegex, trimedText).matched) {
            timeStr = "TMO";
            beginHour = 8;
            endHour = 12;
        }
        else if (recognizers_text_1.RegExpUtility.getFirstMatchIndex(this.afternoonStartEndRegex, trimedText).matched) {
            timeStr = "TAF";
            beginHour = 12;
            endHour = 16;
        }
        else if (recognizers_text_1.RegExpUtility.getFirstMatchIndex(this.eveningStartEndRegex, trimedText).matched) {
            timeStr = "TEV";
            beginHour = 16;
            endHour = 20;
        }
        else if (recognizers_text_1.RegExpUtility.getFirstMatchIndex(this.nightStartEndRegex, trimedText).matched) {
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
        if (trimedText.startsWith("prochain") ||
            trimedText.endsWith("prochain") ||
            trimedText.startsWith("prochaine") ||
            trimedText.endsWith("prochaine")) {
            swift = 1;
        }
        else if (trimedText.startsWith("derniere") ||
            trimedText.startsWith("dernier") ||
            trimedText.endsWith("derniere") ||
            trimedText.endsWith("dernier")) {
            swift = -1;
        }
        return swift;
    }
}
exports.FrenchDateTimePeriodParserConfiguration = FrenchDateTimePeriodParserConfiguration;
//# sourceMappingURL=dateTimePeriodConfiguration.js.map