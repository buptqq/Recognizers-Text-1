"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const baseTime_1 = require("../baseTime");
const recognizers_text_1 = require("recognizers-text");
const englishDateTime_1 = require("../../resources/englishDateTime");
const timeConfiguration_1 = require("./timeConfiguration");
class EnglishTimePeriodExtractorConfiguration {
    constructor() {
        this.simpleCasesRegex = [
            recognizers_text_1.RegExpUtility.getSafeRegExp(englishDateTime_1.EnglishDateTime.PureNumFromTo, "gis"),
            recognizers_text_1.RegExpUtility.getSafeRegExp(englishDateTime_1.EnglishDateTime.PureNumBetweenAnd, "gis")
        ];
        this.tillRegex = recognizers_text_1.RegExpUtility.getSafeRegExp(englishDateTime_1.EnglishDateTime.TillRegex, "gis");
        this.timeOfDayRegex = recognizers_text_1.RegExpUtility.getSafeRegExp(englishDateTime_1.EnglishDateTime.TimeOfDayRegex, "gis");
        this.singleTimeExtractor = new baseTime_1.BaseTimeExtractor(new timeConfiguration_1.EnglishTimeExtractorConfiguration());
    }
    getFromTokenIndex(source) {
        let index = -1;
        if (source.endsWith("from")) {
            index = source.lastIndexOf("from");
            return { matched: true, index: index };
        }
        return { matched: false, index: index };
    }
    getBetweenTokenIndex(source) {
        let index = -1;
        if (source.endsWith("between")) {
            index = source.lastIndexOf("between");
            return { matched: true, index: index };
        }
        return { matched: false, index: index };
    }
    hasConnectorToken(source) {
        return source === "and";
    }
}
exports.EnglishTimePeriodExtractorConfiguration = EnglishTimePeriodExtractorConfiguration;
class EnglishTimePeriodParserConfiguration {
    constructor(config) {
        this.timeExtractor = config.timeExtractor;
        this.timeParser = config.timeParser;
        this.pureNumberFromToRegex = recognizers_text_1.RegExpUtility.getSafeRegExp(englishDateTime_1.EnglishDateTime.PureNumFromTo);
        this.pureNumberBetweenAndRegex = recognizers_text_1.RegExpUtility.getSafeRegExp(englishDateTime_1.EnglishDateTime.PureNumBetweenAnd);
        this.timeOfDayRegex = recognizers_text_1.RegExpUtility.getSafeRegExp(englishDateTime_1.EnglishDateTime.TimeOfDayRegex);
        this.numbers = config.numbers;
        this.utilityConfiguration = config.utilityConfiguration;
    }
    getMatchedTimexRange(text) {
        let trimmedText = text.trim().toLowerCase();
        if (trimmedText.endsWith("s")) {
            trimmedText = trimmedText.substring(0, trimmedText.length - 1);
        }
        let result = {
            matched: false,
            timex: '',
            beginHour: 0,
            endHour: 0,
            endMin: 0
        };
        if (trimmedText.endsWith("morning")) {
            result.timex = "TMO";
            result.beginHour = 8;
            result.endHour = 12;
        }
        else if (trimmedText.endsWith("afternoon")) {
            result.timex = "TAF";
            result.beginHour = 12;
            result.endHour = 16;
        }
        else if (trimmedText.endsWith("evening")) {
            result.timex = "TEV";
            result.beginHour = 16;
            result.endHour = 20;
        }
        else if (trimmedText === "daytime") {
            result.timex = "TDT";
            result.beginHour = 8;
            result.endHour = 18;
        }
        else if (trimmedText.endsWith("night")) {
            result.timex = "TNI";
            result.beginHour = 20;
            result.endHour = 23;
            result.endMin = 59;
        }
        else {
            result.timex = null;
            result.matched = false;
            return result;
        }
        result.matched = true;
        return result;
    }
}
exports.EnglishTimePeriodParserConfiguration = EnglishTimePeriodParserConfiguration;
//# sourceMappingURL=timePeriodConfiguration.js.map