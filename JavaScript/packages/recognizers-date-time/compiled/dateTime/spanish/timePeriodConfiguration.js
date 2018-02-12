"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const recognizers_text_1 = require("recognizers-text");
const baseTime_1 = require("../baseTime");
const timeConfiguration_1 = require("./timeConfiguration");
const baseConfiguration_1 = require("./baseConfiguration");
const spanishDateTime_1 = require("../../resources/spanishDateTime");
class SpanishTimePeriodExtractorConfiguration {
    constructor() {
        this.singleTimeExtractor = new baseTime_1.BaseTimeExtractor(new timeConfiguration_1.SpanishTimeExtractorConfiguration());
        this.utilityConfiguration = new baseConfiguration_1.SpanishDateTimeUtilityConfiguration();
        this.simpleCasesRegex = [
            recognizers_text_1.RegExpUtility.getSafeRegExp(spanishDateTime_1.SpanishDateTime.PureNumFromTo, "gis"),
            recognizers_text_1.RegExpUtility.getSafeRegExp(spanishDateTime_1.SpanishDateTime.PureNumBetweenAnd, "gis")
        ];
        this.tillRegex = recognizers_text_1.RegExpUtility.getSafeRegExp(spanishDateTime_1.SpanishDateTime.TillRegex, "gis");
        this.timeOfDayRegex = recognizers_text_1.RegExpUtility.getSafeRegExp(spanishDateTime_1.SpanishDateTime.TimeOfDayRegex, "gis");
        this.fromRegex = recognizers_text_1.RegExpUtility.getSafeRegExp(spanishDateTime_1.SpanishDateTime.FromRegex, "gis");
        this.connectorAndRegex = recognizers_text_1.RegExpUtility.getSafeRegExp(spanishDateTime_1.SpanishDateTime.ConnectorAndRegex, "gis");
        this.betweenRegex = recognizers_text_1.RegExpUtility.getSafeRegExp(spanishDateTime_1.SpanishDateTime.BetweenRegex, "gis");
    }
    getFromTokenIndex(text) {
        return recognizers_text_1.RegExpUtility.getFirstMatchIndex(this.fromRegex, text);
    }
    hasConnectorToken(text) {
        return recognizers_text_1.RegExpUtility.getFirstMatchIndex(this.connectorAndRegex, text).matched;
    }
    getBetweenTokenIndex(text) {
        return recognizers_text_1.RegExpUtility.getFirstMatchIndex(this.betweenRegex, text);
    }
}
exports.SpanishTimePeriodExtractorConfiguration = SpanishTimePeriodExtractorConfiguration;
class SpanishTimePeriodParserConfiguration {
    constructor(config) {
        this.timeExtractor = config.timeExtractor;
        this.timeParser = config.timeParser;
        this.numbers = config.numbers;
        this.utilityConfiguration = config.utilityConfiguration;
        this.pureNumberFromToRegex = recognizers_text_1.RegExpUtility.getSafeRegExp(spanishDateTime_1.SpanishDateTime.PureNumFromTo, "gis");
        this.pureNumberBetweenAndRegex = recognizers_text_1.RegExpUtility.getSafeRegExp(spanishDateTime_1.SpanishDateTime.PureNumBetweenAnd, "gis");
        this.timeOfDayRegex = recognizers_text_1.RegExpUtility.getSafeRegExp(spanishDateTime_1.SpanishDateTime.TimeOfDayRegex, "gis");
    }
    getMatchedTimexRange(text) {
        let trimedText = text.trim().toLowerCase();
        let beginHour = 0;
        let endHour = 0;
        let endMin = 0;
        let timex = "";
        if (trimedText.endsWith("madrugada")) {
            timex = "TDA";
            beginHour = 4;
            endHour = 8;
        }
        else if (trimedText.endsWith("mañana")) {
            timex = "TMO";
            beginHour = 8;
            endHour = 12;
        }
        else if (trimedText.includes("pasado mediodia") || trimedText.includes("pasado el mediodia")) {
            timex = "TAF";
            beginHour = 12;
            endHour = 16;
        }
        else if (trimedText.endsWith("tarde")) {
            timex = "TEV";
            beginHour = 16;
            endHour = 20;
        }
        else if (trimedText.endsWith("noche")) {
            timex = "TNI";
            beginHour = 20;
            endHour = 23;
            endMin = 59;
        }
        else {
            timex = null;
            return {
                matched: false,
                timex,
                beginHour,
                endHour,
                endMin
            };
        }
        return {
            matched: true,
            timex,
            beginHour,
            endHour,
            endMin
        };
    }
}
exports.SpanishTimePeriodParserConfiguration = SpanishTimePeriodParserConfiguration;
//# sourceMappingURL=timePeriodConfiguration.js.map