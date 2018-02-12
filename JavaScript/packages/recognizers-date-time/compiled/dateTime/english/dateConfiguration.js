"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const baseDuration_1 = require("../baseDuration");
const recognizers_text_1 = require("recognizers-text");
const recognizers_text_number_1 = require("recognizers-text-number");
const englishDateTime_1 = require("../../resources/englishDateTime");
const baseConfiguration_1 = require("./baseConfiguration");
const durationConfiguration_1 = require("./durationConfiguration");
class EnglishDateExtractorConfiguration {
    constructor() {
        this.dateRegexList = [
            recognizers_text_1.RegExpUtility.getSafeRegExp(englishDateTime_1.EnglishDateTime.DateExtractor1),
            recognizers_text_1.RegExpUtility.getSafeRegExp(englishDateTime_1.EnglishDateTime.DateExtractor2),
            recognizers_text_1.RegExpUtility.getSafeRegExp(englishDateTime_1.EnglishDateTime.DateExtractor3),
            recognizers_text_1.RegExpUtility.getSafeRegExp(englishDateTime_1.EnglishDateTime.DateExtractor4),
            recognizers_text_1.RegExpUtility.getSafeRegExp(englishDateTime_1.EnglishDateTime.DateExtractor5),
            recognizers_text_1.RegExpUtility.getSafeRegExp(englishDateTime_1.EnglishDateTime.DateExtractor6),
            recognizers_text_1.RegExpUtility.getSafeRegExp(englishDateTime_1.EnglishDateTime.DateExtractor7),
            recognizers_text_1.RegExpUtility.getSafeRegExp(englishDateTime_1.EnglishDateTime.DateExtractor8),
            recognizers_text_1.RegExpUtility.getSafeRegExp(englishDateTime_1.EnglishDateTime.DateExtractor9),
            recognizers_text_1.RegExpUtility.getSafeRegExp(englishDateTime_1.EnglishDateTime.DateExtractorA),
        ];
        this.implicitDateList = [
            recognizers_text_1.RegExpUtility.getSafeRegExp(englishDateTime_1.EnglishDateTime.OnRegex),
            recognizers_text_1.RegExpUtility.getSafeRegExp(englishDateTime_1.EnglishDateTime.RelaxedOnRegex),
            recognizers_text_1.RegExpUtility.getSafeRegExp(englishDateTime_1.EnglishDateTime.SpecialDayRegex),
            recognizers_text_1.RegExpUtility.getSafeRegExp(englishDateTime_1.EnglishDateTime.ThisRegex),
            recognizers_text_1.RegExpUtility.getSafeRegExp(englishDateTime_1.EnglishDateTime.LastDateRegex),
            recognizers_text_1.RegExpUtility.getSafeRegExp(englishDateTime_1.EnglishDateTime.NextDateRegex),
            recognizers_text_1.RegExpUtility.getSafeRegExp(englishDateTime_1.EnglishDateTime.SingleWeekDayRegex),
            recognizers_text_1.RegExpUtility.getSafeRegExp(englishDateTime_1.EnglishDateTime.WeekDayOfMonthRegex),
            recognizers_text_1.RegExpUtility.getSafeRegExp(englishDateTime_1.EnglishDateTime.SpecialDate),
        ];
        this.monthEnd = recognizers_text_1.RegExpUtility.getSafeRegExp(englishDateTime_1.EnglishDateTime.MonthEnd);
        this.ofMonth = recognizers_text_1.RegExpUtility.getSafeRegExp(englishDateTime_1.EnglishDateTime.OfMonth);
        this.dateUnitRegex = recognizers_text_1.RegExpUtility.getSafeRegExp(englishDateTime_1.EnglishDateTime.DateUnitRegex);
        this.forTheRegex = recognizers_text_1.RegExpUtility.getSafeRegExp(englishDateTime_1.EnglishDateTime.ForTheRegex);
        this.weekDayAndDayOfMothRegex = recognizers_text_1.RegExpUtility.getSafeRegExp(englishDateTime_1.EnglishDateTime.WeekDayAndDayOfMothRegex);
        this.relativeMonthRegex = recognizers_text_1.RegExpUtility.getSafeRegExp(englishDateTime_1.EnglishDateTime.RelativeMonthRegex);
        this.weekDayRegex = recognizers_text_1.RegExpUtility.getSafeRegExp(englishDateTime_1.EnglishDateTime.WeekDayRegex);
        this.dayOfWeek = englishDateTime_1.EnglishDateTime.DayOfWeek;
        this.ordinalExtractor = new recognizers_text_number_1.EnglishOrdinalExtractor();
        this.integerExtractor = new recognizers_text_number_1.EnglishIntegerExtractor();
        this.numberParser = new recognizers_text_number_1.BaseNumberParser(new recognizers_text_number_1.EnglishNumberParserConfiguration());
        this.durationExtractor = new baseDuration_1.BaseDurationExtractor(new durationConfiguration_1.EnglishDurationExtractorConfiguration());
        this.utilityConfiguration = new baseConfiguration_1.EnglishDateTimeUtilityConfiguration();
    }
}
exports.EnglishDateExtractorConfiguration = EnglishDateExtractorConfiguration;
class EnglishDateParserConfiguration {
    constructor(config) {
        this.ordinalExtractor = config.ordinalExtractor;
        this.integerExtractor = config.integerExtractor;
        this.cardinalExtractor = config.cardinalExtractor;
        this.durationExtractor = config.durationExtractor;
        this.numberParser = config.numberParser;
        this.durationParser = config.durationParser;
        this.monthOfYear = config.monthOfYear;
        this.dayOfMonth = config.dayOfMonth;
        this.dayOfWeek = config.dayOfWeek;
        this.unitMap = config.unitMap;
        this.cardinalMap = config.cardinalMap;
        this.dateRegex = [
            recognizers_text_1.RegExpUtility.getSafeRegExp(englishDateTime_1.EnglishDateTime.DateExtractor1),
            recognizers_text_1.RegExpUtility.getSafeRegExp(englishDateTime_1.EnglishDateTime.DateExtractor2),
            recognizers_text_1.RegExpUtility.getSafeRegExp(englishDateTime_1.EnglishDateTime.DateExtractor3),
            recognizers_text_1.RegExpUtility.getSafeRegExp(englishDateTime_1.EnglishDateTime.DateExtractor4),
            recognizers_text_1.RegExpUtility.getSafeRegExp(englishDateTime_1.EnglishDateTime.DateExtractor5),
            recognizers_text_1.RegExpUtility.getSafeRegExp(englishDateTime_1.EnglishDateTime.DateExtractor6),
            recognizers_text_1.RegExpUtility.getSafeRegExp(englishDateTime_1.EnglishDateTime.DateExtractor7),
            recognizers_text_1.RegExpUtility.getSafeRegExp(englishDateTime_1.EnglishDateTime.DateExtractor8),
            recognizers_text_1.RegExpUtility.getSafeRegExp(englishDateTime_1.EnglishDateTime.DateExtractor9),
            recognizers_text_1.RegExpUtility.getSafeRegExp(englishDateTime_1.EnglishDateTime.DateExtractorA),
        ];
        this.onRegex = recognizers_text_1.RegExpUtility.getSafeRegExp(englishDateTime_1.EnglishDateTime.OnRegex);
        this.specialDayRegex = recognizers_text_1.RegExpUtility.getSafeRegExp(englishDateTime_1.EnglishDateTime.SpecialDayRegex);
        this.nextRegex = recognizers_text_1.RegExpUtility.getSafeRegExp(englishDateTime_1.EnglishDateTime.NextDateRegex);
        this.unitRegex = recognizers_text_1.RegExpUtility.getSafeRegExp(englishDateTime_1.EnglishDateTime.DateUnitRegex);
        this.monthRegex = recognizers_text_1.RegExpUtility.getSafeRegExp(englishDateTime_1.EnglishDateTime.MonthRegex);
        this.weekDayRegex = recognizers_text_1.RegExpUtility.getSafeRegExp(englishDateTime_1.EnglishDateTime.WeekDayRegex);
        this.lastRegex = recognizers_text_1.RegExpUtility.getSafeRegExp(englishDateTime_1.EnglishDateTime.LastDateRegex);
        this.thisRegex = recognizers_text_1.RegExpUtility.getSafeRegExp(englishDateTime_1.EnglishDateTime.ThisRegex);
        this.weekDayOfMonthRegex = recognizers_text_1.RegExpUtility.getSafeRegExp(englishDateTime_1.EnglishDateTime.WeekDayOfMonthRegex);
        this.forTheRegex = recognizers_text_1.RegExpUtility.getSafeRegExp(englishDateTime_1.EnglishDateTime.ForTheRegex);
        this.weekDayAndDayOfMothRegex = recognizers_text_1.RegExpUtility.getSafeRegExp(englishDateTime_1.EnglishDateTime.WeekDayAndDayOfMothRegex);
        this.relativeMonthRegex = recognizers_text_1.RegExpUtility.getSafeRegExp(englishDateTime_1.EnglishDateTime.RelativeMonthRegex);
        this.utilityConfiguration = config.utilityConfiguration;
        this.dateTokenPrefix = englishDateTime_1.EnglishDateTime.DateTokenPrefix;
    }
    getSwiftDay(source) {
        let trimmedText = source.trim().toLowerCase();
        let swift = 0;
        let matches = recognizers_text_1.RegExpUtility.getMatches(EnglishDateParserConfiguration.relativeDayRegex, source);
        if (trimmedText === "today") {
            swift = 0;
        }
        else if (trimmedText === "tomorrow" || trimmedText === "tmr") {
            swift = 1;
        }
        else if (trimmedText === "yesterday") {
            swift = -1;
        }
        else if (trimmedText.endsWith("day after tomorrow") ||
            trimmedText.endsWith("day after tmr")) {
            swift = 2;
        }
        else if (trimmedText.endsWith("day before yesterday")) {
            swift = -2;
        }
        else if (matches.length) {
            swift = this.getSwift(source);
        }
        return swift;
    }
    getSwiftMonth(source) {
        return this.getSwift(source);
    }
    getSwift(source) {
        let trimmedText = source.trim().toLowerCase();
        let swift = 0;
        let nextPrefixMatches = recognizers_text_1.RegExpUtility.getMatches(EnglishDateParserConfiguration.nextPrefixRegex, trimmedText);
        let pastPrefixMatches = recognizers_text_1.RegExpUtility.getMatches(EnglishDateParserConfiguration.pastPrefixRegex, trimmedText);
        if (nextPrefixMatches.length) {
            swift = 1;
        }
        else if (pastPrefixMatches.length) {
            swift = -1;
        }
        return swift;
    }
    isCardinalLast(source) {
        let trimmedText = source.trim().toLowerCase();
        return trimmedText === "last";
    }
}
// The following three regexes only used in this configuration
// They are not used in the base parser, therefore they are not extracted
// If the spanish date parser need the same regexes, they should be extracted
EnglishDateParserConfiguration.relativeDayRegex = recognizers_text_1.RegExpUtility.getSafeRegExp(englishDateTime_1.EnglishDateTime.RelativeDayRegex);
EnglishDateParserConfiguration.nextPrefixRegex = recognizers_text_1.RegExpUtility.getSafeRegExp(englishDateTime_1.EnglishDateTime.NextPrefixRegex);
EnglishDateParserConfiguration.pastPrefixRegex = recognizers_text_1.RegExpUtility.getSafeRegExp(englishDateTime_1.EnglishDateTime.PastPrefixRegex);
exports.EnglishDateParserConfiguration = EnglishDateParserConfiguration;
//# sourceMappingURL=dateConfiguration.js.map