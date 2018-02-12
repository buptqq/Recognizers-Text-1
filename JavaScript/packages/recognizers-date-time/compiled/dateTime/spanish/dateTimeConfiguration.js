"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const recognizers_text_1 = require("recognizers-text");
const baseDate_1 = require("../baseDate");
const baseTime_1 = require("../baseTime");
const baseDuration_1 = require("../baseDuration");
const dateConfiguration_1 = require("./dateConfiguration");
const durationConfiguration_1 = require("./durationConfiguration");
const baseConfiguration_1 = require("./baseConfiguration");
const spanishDateTime_1 = require("../../resources/spanishDateTime");
const timeConfiguration_1 = require("./timeConfiguration");
class SpanishDateTimeExtractorConfiguration {
    constructor() {
        this.prepositionRegex = recognizers_text_1.RegExpUtility.getSafeRegExp(spanishDateTime_1.SpanishDateTime.PrepositionRegex, "gis");
        this.nowRegex = recognizers_text_1.RegExpUtility.getSafeRegExp(spanishDateTime_1.SpanishDateTime.NowRegex, "gis");
        this.suffixRegex = recognizers_text_1.RegExpUtility.getSafeRegExp(spanishDateTime_1.SpanishDateTime.SuffixRegex, "gis");
        this.timeOfDayRegex = recognizers_text_1.RegExpUtility.getSafeRegExp(spanishDateTime_1.SpanishDateTime.TimeOfDayRegex, "gis");
        this.specificTimeOfDayRegex = recognizers_text_1.RegExpUtility.getSafeRegExp(spanishDateTime_1.SpanishDateTime.SpecificTimeOfDayRegex, "gis");
        this.timeOfTodayAfterRegex = recognizers_text_1.RegExpUtility.getSafeRegExp(spanishDateTime_1.SpanishDateTime.TimeOfTodayAfterRegex, "gis");
        this.timeOfTodayBeforeRegex = recognizers_text_1.RegExpUtility.getSafeRegExp(spanishDateTime_1.SpanishDateTime.TimeOfTodayBeforeRegex, "gis");
        this.simpleTimeOfTodayAfterRegex = recognizers_text_1.RegExpUtility.getSafeRegExp(spanishDateTime_1.SpanishDateTime.SimpleTimeOfTodayAfterRegex, "gis");
        this.simpleTimeOfTodayBeforeRegex = recognizers_text_1.RegExpUtility.getSafeRegExp(spanishDateTime_1.SpanishDateTime.SimpleTimeOfTodayBeforeRegex, "gis");
        this.theEndOfRegex = recognizers_text_1.RegExpUtility.getSafeRegExp(spanishDateTime_1.SpanishDateTime.TheEndOfRegex, "gis");
        this.unitRegex = recognizers_text_1.RegExpUtility.getSafeRegExp(spanishDateTime_1.SpanishDateTime.UnitRegex, "gis");
        this.connectorRegex = recognizers_text_1.RegExpUtility.getSafeRegExp(spanishDateTime_1.SpanishDateTime.ConnectorRegex, "gis");
        this.nightRegex = recognizers_text_1.RegExpUtility.getSafeRegExp(spanishDateTime_1.SpanishDateTime.NightRegex, "gis");
        this.datePointExtractor = new baseDate_1.BaseDateExtractor(new dateConfiguration_1.SpanishDateExtractorConfiguration());
        this.timePointExtractor = new baseTime_1.BaseTimeExtractor(new timeConfiguration_1.SpanishTimeExtractorConfiguration());
        this.durationExtractor = new baseDuration_1.BaseDurationExtractor(new durationConfiguration_1.SpanishDurationExtractorConfiguration());
        this.utilityConfiguration = new baseConfiguration_1.SpanishDateTimeUtilityConfiguration();
    }
    isConnectorToken(source) {
        let trimmed = source.trim();
        return trimmed === ""
            || recognizers_text_1.RegExpUtility.getFirstMatchIndex(this.prepositionRegex, source).matched
            || recognizers_text_1.RegExpUtility.getFirstMatchIndex(this.connectorRegex, source).matched;
    }
}
exports.SpanishDateTimeExtractorConfiguration = SpanishDateTimeExtractorConfiguration;
class SpanishDateTimeParserConfiguration {
    constructor(config) {
        this.tokenBeforeDate = spanishDateTime_1.SpanishDateTime.TokenBeforeDate;
        this.tokenBeforeTime = spanishDateTime_1.SpanishDateTime.TokenBeforeTime;
        this.nowRegex = recognizers_text_1.RegExpUtility.getSafeRegExp(spanishDateTime_1.SpanishDateTime.NowRegex, "gis");
        this.amTimeRegex = recognizers_text_1.RegExpUtility.getSafeRegExp(spanishDateTime_1.SpanishDateTime.AmTimeRegex, "gis");
        this.pmTimeRegex = recognizers_text_1.RegExpUtility.getSafeRegExp(spanishDateTime_1.SpanishDateTime.PmTimeRegex, "gis");
        this.simpleTimeOfTodayAfterRegex = recognizers_text_1.RegExpUtility.getSafeRegExp(spanishDateTime_1.SpanishDateTime.SimpleTimeOfTodayAfterRegex, "gis");
        this.simpleTimeOfTodayBeforeRegex = recognizers_text_1.RegExpUtility.getSafeRegExp(spanishDateTime_1.SpanishDateTime.SimpleTimeOfTodayBeforeRegex, "gis");
        this.specificTimeOfDayRegex = recognizers_text_1.RegExpUtility.getSafeRegExp(spanishDateTime_1.SpanishDateTime.SpecificTimeOfDayRegex, "gis");
        this.theEndOfRegex = recognizers_text_1.RegExpUtility.getSafeRegExp(spanishDateTime_1.SpanishDateTime.TheEndOfRegex, "gis");
        this.unitRegex = recognizers_text_1.RegExpUtility.getSafeRegExp(spanishDateTime_1.SpanishDateTime.UnitRegex, "gis");
        this.nextPrefixRegex = recognizers_text_1.RegExpUtility.getSafeRegExp(spanishDateTime_1.SpanishDateTime.NextPrefixRegex, "gis");
        this.pastPrefixRegex = recognizers_text_1.RegExpUtility.getSafeRegExp(spanishDateTime_1.SpanishDateTime.PastPrefixRegex, "gis");
        this.dateExtractor = config.dateExtractor;
        this.timeExtractor = config.timeExtractor;
        this.dateParser = config.dateParser;
        this.timeParser = config.timeParser;
        this.numbers = config.numbers;
        this.cardinalExtractor = config.cardinalExtractor;
        this.numberParser = config.numberParser;
        this.durationExtractor = config.durationExtractor;
        this.durationParser = config.durationParser;
        this.unitMap = config.unitMap;
        this.utilityConfiguration = config.utilityConfiguration;
    }
    haveAmbiguousToken(text, matchedText) {
        return text.toLowerCase().includes("esta mañana")
            && matchedText.toLocaleLowerCase().includes("mañana");
    }
    getMatchedNowTimex(text) {
        let trimedText = text.trim().toLowerCase();
        let timex = "";
        if (trimedText.endsWith("ahora") || trimedText.endsWith("mismo") || trimedText.endsWith("momento")) {
            timex = "PRESENT_REF";
        }
        else if (trimedText.endsWith("posible") || trimedText.endsWith("pueda") ||
            trimedText.endsWith("puedas") || trimedText.endsWith("podamos") || trimedText.endsWith("puedan")) {
            timex = "FUTURE_REF";
        }
        else if (trimedText.endsWith("mente")) {
            timex = "PAST_REF";
        }
        else {
            return {
                matched: false,
                timex: null
            };
        }
        return {
            matched: true,
            timex: timex
        };
    }
    getSwiftDay(text) {
        let trimedText = text.trim().toLowerCase();
        let swift = 0;
        if (recognizers_text_1.RegExpUtility.getFirstMatchIndex(this.pastPrefixRegex, trimedText).matched) {
            swift = -1;
        }
        else if (recognizers_text_1.RegExpUtility.getFirstMatchIndex(this.nextPrefixRegex, trimedText).matched) {
            swift = 1;
        }
        return swift;
    }
    getHour(text, hour) {
        let trimedText = text.trim().toLowerCase();
        let result = hour;
        // TODO: Replace with a regex
        if ((trimedText.endsWith("mañana") || trimedText.endsWith("madrugada")) && hour >= 12) {
            result -= 12;
        }
        else if (!(trimedText.endsWith("mañana") || trimedText.endsWith("madrugada")) && hour < 12) {
            result += 12;
        }
        return result;
    }
}
exports.SpanishDateTimeParserConfiguration = SpanishDateTimeParserConfiguration;
//# sourceMappingURL=dateTimeConfiguration.js.map