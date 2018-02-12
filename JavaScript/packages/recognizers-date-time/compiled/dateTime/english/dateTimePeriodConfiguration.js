"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const baseDate_1 = require("../baseDate");
const baseTime_1 = require("../baseTime");
const baseDateTime_1 = require("../baseDateTime");
const baseTimePeriod_1 = require("../baseTimePeriod");
const baseDuration_1 = require("../baseDuration");
const recognizers_text_1 = require("recognizers-text");
const recognizers_text_number_1 = require("recognizers-text-number");
const englishDateTime_1 = require("../../resources/englishDateTime");
const durationConfiguration_1 = require("./durationConfiguration");
const timeConfiguration_1 = require("./timeConfiguration");
const dateTimeConfiguration_1 = require("./dateTimeConfiguration");
const dateConfiguration_1 = require("./dateConfiguration");
const timePeriodConfiguration_1 = require("../english/timePeriodConfiguration");
class EnglishDateTimePeriodExtractorConfiguration {
    constructor() {
        this.cardinalExtractor = new recognizers_text_number_1.EnglishCardinalExtractor();
        this.singleDateExtractor = new baseDate_1.BaseDateExtractor(new dateConfiguration_1.EnglishDateExtractorConfiguration());
        this.singleTimeExtractor = new baseTime_1.BaseTimeExtractor(new timeConfiguration_1.EnglishTimeExtractorConfiguration());
        this.singleDateTimeExtractor = new baseDateTime_1.BaseDateTimeExtractor(new dateTimeConfiguration_1.EnglishDateTimeExtractorConfiguration());
        this.durationExtractor = new baseDuration_1.BaseDurationExtractor(new durationConfiguration_1.EnglishDurationExtractorConfiguration());
        this.timePeriodExtractor = new baseTimePeriod_1.BaseTimePeriodExtractor(new timePeriodConfiguration_1.EnglishTimePeriodExtractorConfiguration());
        this.simpleCasesRegexes = [
            recognizers_text_1.RegExpUtility.getSafeRegExp(englishDateTime_1.EnglishDateTime.PureNumFromTo),
            recognizers_text_1.RegExpUtility.getSafeRegExp(englishDateTime_1.EnglishDateTime.PureNumBetweenAnd),
        ];
        this.prepositionRegex = recognizers_text_1.RegExpUtility.getSafeRegExp(englishDateTime_1.EnglishDateTime.PrepositionRegex);
        this.tillRegex = recognizers_text_1.RegExpUtility.getSafeRegExp(englishDateTime_1.EnglishDateTime.TillRegex);
        this.specificTimeOfDayRegex = recognizers_text_1.RegExpUtility.getSafeRegExp(englishDateTime_1.EnglishDateTime.PeriodSpecificTimeOfDayRegex);
        this.timeOfDayRegex = recognizers_text_1.RegExpUtility.getSafeRegExp(englishDateTime_1.EnglishDateTime.PeriodTimeOfDayRegex);
        this.periodTimeOfDayWithDateRegex = recognizers_text_1.RegExpUtility.getSafeRegExp(englishDateTime_1.EnglishDateTime.PeriodTimeOfDayWithDateRegex);
        this.followedUnit = recognizers_text_1.RegExpUtility.getSafeRegExp(englishDateTime_1.EnglishDateTime.TimeFollowedUnit);
        this.numberCombinedWithUnit = recognizers_text_1.RegExpUtility.getSafeRegExp(englishDateTime_1.EnglishDateTime.TimeNumberCombinedWithUnit);
        this.timeUnitRegex = recognizers_text_1.RegExpUtility.getSafeRegExp(englishDateTime_1.EnglishDateTime.TimeUnitRegex);
        this.pastPrefixRegex = recognizers_text_1.RegExpUtility.getSafeRegExp(englishDateTime_1.EnglishDateTime.PastPrefixRegex);
        this.nextPrefixRegex = recognizers_text_1.RegExpUtility.getSafeRegExp(englishDateTime_1.EnglishDateTime.NextPrefixRegex);
        this.rangeConnectorRegex = recognizers_text_1.RegExpUtility.getSafeRegExp(englishDateTime_1.EnglishDateTime.RangeConnectorRegex);
        this.relativeTimeUnitRegex = recognizers_text_1.RegExpUtility.getSafeRegExp(englishDateTime_1.EnglishDateTime.RelativeTimeUnitRegex);
        this.restOfDateTimeRegex = recognizers_text_1.RegExpUtility.getSafeRegExp(englishDateTime_1.EnglishDateTime.RestOfDateTimeRegex);
        this.generalEndingRegex = recognizers_text_1.RegExpUtility.getSafeRegExp(englishDateTime_1.EnglishDateTime.GeneralEndingRegex);
        this.middlePauseRegex = recognizers_text_1.RegExpUtility.getSafeRegExp(englishDateTime_1.EnglishDateTime.MiddlePauseRegex);
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
        return recognizers_text_1.RegExpUtility.getMatches(this.rangeConnectorRegex, source).length > 0;
    }
    ;
}
exports.EnglishDateTimePeriodExtractorConfiguration = EnglishDateTimePeriodExtractorConfiguration;
class EnglishDateTimePeriodParserConfiguration {
    constructor(config) {
        this.pureNumberFromToRegex = recognizers_text_1.RegExpUtility.getSafeRegExp(englishDateTime_1.EnglishDateTime.PureNumFromTo);
        this.pureNumberBetweenAndRegex = recognizers_text_1.RegExpUtility.getSafeRegExp(englishDateTime_1.EnglishDateTime.PureNumBetweenAnd);
        this.periodTimeOfDayWithDateRegex = recognizers_text_1.RegExpUtility.getSafeRegExp(englishDateTime_1.EnglishDateTime.PeriodTimeOfDayWithDateRegex);
        this.specificTimeOfDayRegex = recognizers_text_1.RegExpUtility.getSafeRegExp(englishDateTime_1.EnglishDateTime.SpecificTimeOfDayRegex);
        this.pastRegex = recognizers_text_1.RegExpUtility.getSafeRegExp(englishDateTime_1.EnglishDateTime.PastPrefixRegex);
        this.futureRegex = recognizers_text_1.RegExpUtility.getSafeRegExp(englishDateTime_1.EnglishDateTime.NextPrefixRegex);
        this.relativeTimeUnitRegex = recognizers_text_1.RegExpUtility.getSafeRegExp(englishDateTime_1.EnglishDateTime.RelativeTimeUnitRegex);
        this.numbers = config.numbers;
        this.unitMap = config.unitMap;
        this.dateExtractor = config.dateExtractor;
        this.timePeriodExtractor = config.timePeriodExtractor;
        this.timeExtractor = config.timeExtractor;
        this.dateTimeExtractor = config.dateTimeExtractor;
        this.durationExtractor = config.durationExtractor;
        this.dateParser = config.dateParser;
        this.timeParser = config.timeParser;
        this.dateTimeParser = config.dateTimeParser;
        this.timePeriodParser = config.timePeriodParser;
        this.durationParser = config.durationParser;
        this.morningStartEndRegex = recognizers_text_1.RegExpUtility.getSafeRegExp(englishDateTime_1.EnglishDateTime.MorningStartEndRegex);
        this.afternoonStartEndRegex = recognizers_text_1.RegExpUtility.getSafeRegExp(englishDateTime_1.EnglishDateTime.AfternoonStartEndRegex);
        this.eveningStartEndRegex = recognizers_text_1.RegExpUtility.getSafeRegExp(englishDateTime_1.EnglishDateTime.EveningStartEndRegex);
        this.nightStartEndRegex = recognizers_text_1.RegExpUtility.getSafeRegExp(englishDateTime_1.EnglishDateTime.NightStartEndRegex);
        this.restOfDateTimeRegex = recognizers_text_1.RegExpUtility.getSafeRegExp(englishDateTime_1.EnglishDateTime.RestOfDateTimeRegex);
    }
    getMatchedTimeRange(source) {
        let timeStr;
        let beginHour = 0;
        let endHour = 0;
        let endMin = 0;
        let success = false;
        if (recognizers_text_1.RegExpUtility.getMatches(this.morningStartEndRegex, source).length > 0) {
            timeStr = 'TMO';
            beginHour = 8;
            endHour = 12;
            success = true;
        }
        else if (recognizers_text_1.RegExpUtility.getMatches(this.afternoonStartEndRegex, source).length > 0) {
            timeStr = 'TAF';
            beginHour = 12;
            endHour = 16;
            success = true;
        }
        else if (recognizers_text_1.RegExpUtility.getMatches(this.eveningStartEndRegex, source).length > 0) {
            timeStr = 'TEV';
            beginHour = 16;
            endHour = 20;
            success = true;
        }
        else if (recognizers_text_1.RegExpUtility.getMatches(this.nightStartEndRegex, source).length > 0) {
            timeStr = 'TNI';
            beginHour = 20;
            endHour = 23;
            endMin = 59;
            success = true;
        }
        return { timeStr: timeStr, beginHour: beginHour, endHour: endHour, endMin: endMin, success: success };
    }
    getSwiftPrefix(source) {
        let swift = 0;
        if (source.startsWith('next'))
            swift = 1;
        else if (source.startsWith('last'))
            swift = -1;
        return swift;
    }
}
exports.EnglishDateTimePeriodParserConfiguration = EnglishDateTimePeriodParserConfiguration;
//# sourceMappingURL=dateTimePeriodConfiguration.js.map