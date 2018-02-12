"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const baseDate_1 = require("../baseDate");
const baseTime_1 = require("../baseTime");
const recognizers_text_1 = require("recognizers-text");
const baseDuration_1 = require("../baseDuration");
const englishDateTime_1 = require("../../resources/englishDateTime");
const baseConfiguration_1 = require("./baseConfiguration");
const durationConfiguration_1 = require("./durationConfiguration");
const dateConfiguration_1 = require("./dateConfiguration");
const timeConfiguration_1 = require("./timeConfiguration");
class EnglishDateTimeExtractorConfiguration {
    constructor() {
        this.datePointExtractor = new baseDate_1.BaseDateExtractor(new dateConfiguration_1.EnglishDateExtractorConfiguration());
        this.timePointExtractor = new baseTime_1.BaseTimeExtractor(new timeConfiguration_1.EnglishTimeExtractorConfiguration());
        this.durationExtractor = new baseDuration_1.BaseDurationExtractor(new durationConfiguration_1.EnglishDurationExtractorConfiguration());
        this.suffixRegex = recognizers_text_1.RegExpUtility.getSafeRegExp(englishDateTime_1.EnglishDateTime.SuffixRegex);
        this.nowRegex = recognizers_text_1.RegExpUtility.getSafeRegExp(englishDateTime_1.EnglishDateTime.NowRegex);
        this.timeOfTodayAfterRegex = recognizers_text_1.RegExpUtility.getSafeRegExp(englishDateTime_1.EnglishDateTime.TimeOfTodayAfterRegex);
        this.simpleTimeOfTodayAfterRegex = recognizers_text_1.RegExpUtility.getSafeRegExp(englishDateTime_1.EnglishDateTime.SimpleTimeOfTodayAfterRegex);
        this.nightRegex = recognizers_text_1.RegExpUtility.getSafeRegExp(englishDateTime_1.EnglishDateTime.TimeOfDayRegex);
        this.timeOfTodayBeforeRegex = recognizers_text_1.RegExpUtility.getSafeRegExp(englishDateTime_1.EnglishDateTime.TimeOfTodayBeforeRegex);
        this.simpleTimeOfTodayBeforeRegex = recognizers_text_1.RegExpUtility.getSafeRegExp(englishDateTime_1.EnglishDateTime.SimpleTimeOfTodayBeforeRegex);
        this.theEndOfRegex = recognizers_text_1.RegExpUtility.getSafeRegExp(englishDateTime_1.EnglishDateTime.TheEndOfRegex);
        this.unitRegex = recognizers_text_1.RegExpUtility.getSafeRegExp(englishDateTime_1.EnglishDateTime.TimeUnitRegex);
        this.prepositionRegex = recognizers_text_1.RegExpUtility.getSafeRegExp(englishDateTime_1.EnglishDateTime.PrepositionRegex);
        this.connectorRegex = recognizers_text_1.RegExpUtility.getSafeRegExp(englishDateTime_1.EnglishDateTime.ConnectorRegex);
        this.utilityConfiguration = new baseConfiguration_1.EnglishDateTimeUtilityConfiguration();
    }
    isConnectorToken(source) {
        return (recognizers_text_1.StringUtility.isNullOrWhitespace(source)
            || recognizers_text_1.RegExpUtility.getMatches(this.connectorRegex, source).length > 0
            || recognizers_text_1.RegExpUtility.getMatches(this.prepositionRegex, source).length > 0);
    }
}
exports.EnglishDateTimeExtractorConfiguration = EnglishDateTimeExtractorConfiguration;
class EnglishDateTimeParserConfiguration {
    constructor(config) {
        this.tokenBeforeDate = englishDateTime_1.EnglishDateTime.TokenBeforeDate;
        this.tokenBeforeTime = englishDateTime_1.EnglishDateTime.TokenBeforeTime;
        this.dateExtractor = config.dateExtractor;
        this.timeExtractor = config.timeExtractor;
        this.dateParser = config.dateParser;
        this.timeParser = config.timeParser;
        this.nowRegex = recognizers_text_1.RegExpUtility.getSafeRegExp(englishDateTime_1.EnglishDateTime.NowRegex);
        this.amTimeRegex = recognizers_text_1.RegExpUtility.getSafeRegExp(englishDateTime_1.EnglishDateTime.AMTimeRegex);
        this.pmTimeRegex = recognizers_text_1.RegExpUtility.getSafeRegExp(englishDateTime_1.EnglishDateTime.PMTimeRegex);
        this.simpleTimeOfTodayAfterRegex = recognizers_text_1.RegExpUtility.getSafeRegExp(englishDateTime_1.EnglishDateTime.SimpleTimeOfTodayAfterRegex);
        this.simpleTimeOfTodayBeforeRegex = recognizers_text_1.RegExpUtility.getSafeRegExp(englishDateTime_1.EnglishDateTime.SimpleTimeOfTodayBeforeRegex);
        this.specificTimeOfDayRegex = recognizers_text_1.RegExpUtility.getSafeRegExp(englishDateTime_1.EnglishDateTime.SpecificTimeOfDayRegex);
        this.theEndOfRegex = recognizers_text_1.RegExpUtility.getSafeRegExp(englishDateTime_1.EnglishDateTime.TheEndOfRegex);
        this.unitRegex = recognizers_text_1.RegExpUtility.getSafeRegExp(englishDateTime_1.EnglishDateTime.TimeUnitRegex);
        this.numbers = config.numbers;
        this.cardinalExtractor = config.cardinalExtractor;
        this.numberParser = config.numberParser;
        this.durationExtractor = config.durationExtractor;
        this.durationParser = config.durationParser;
        this.unitMap = config.unitMap;
        this.utilityConfiguration = config.utilityConfiguration;
    }
    getHour(text, hour) {
        let trimmedText = text.trim().toLowerCase();
        let result = hour;
        if (trimmedText.endsWith("morning") && hour >= 12) {
            result -= 12;
        }
        else if (!trimmedText.endsWith("morning") && hour < 12) {
            result += 12;
        }
        return result;
    }
    getMatchedNowTimex(text) {
        let trimmedText = text.trim().toLowerCase();
        let timex;
        if (trimmedText.endsWith("now")) {
            timex = "PRESENT_REF";
        }
        else if (trimmedText === "recently" || trimmedText === "previously") {
            timex = "PAST_REF";
        }
        else if (trimmedText === "as soon as possible" || trimmedText === "asap") {
            timex = "FUTURE_REF";
        }
        else {
            timex = null;
            return { matched: false, timex: timex };
        }
        return { matched: true, timex: timex };
    }
    getSwiftDay(text) {
        let trimmedText = text.trim().toLowerCase();
        let swift = 0;
        if (trimmedText.startsWith("next")) {
            swift = 1;
        }
        else if (trimmedText.startsWith("last")) {
            swift = -1;
        }
        return swift;
    }
    haveAmbiguousToken(text, matchedText) { return false; }
}
exports.EnglishDateTimeParserConfiguration = EnglishDateTimeParserConfiguration;
//# sourceMappingURL=dateTimeConfiguration.js.map