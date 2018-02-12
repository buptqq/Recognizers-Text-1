"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const recognizers_text_1 = require("recognizers-text");
const recognizers_text_number_1 = require("recognizers-text-number");
const englishDateTime_1 = require("../../resources/englishDateTime");
class EnglishDurationExtractorConfiguration {
    constructor() {
        this.allRegex = recognizers_text_1.RegExpUtility.getSafeRegExp(englishDateTime_1.EnglishDateTime.AllRegex);
        this.halfRegex = recognizers_text_1.RegExpUtility.getSafeRegExp(englishDateTime_1.EnglishDateTime.HalfRegex);
        this.followedUnit = recognizers_text_1.RegExpUtility.getSafeRegExp(englishDateTime_1.EnglishDateTime.DurationFollowedUnit);
        this.numberCombinedWithUnit = recognizers_text_1.RegExpUtility.getSafeRegExp(englishDateTime_1.EnglishDateTime.NumberCombinedWithDurationUnit);
        this.anUnitRegex = recognizers_text_1.RegExpUtility.getSafeRegExp(englishDateTime_1.EnglishDateTime.AnUnitRegex);
        this.inExactNumberUnitRegex = recognizers_text_1.RegExpUtility.getSafeRegExp(englishDateTime_1.EnglishDateTime.InExactNumberUnitRegex);
        this.suffixAndRegex = recognizers_text_1.RegExpUtility.getSafeRegExp(englishDateTime_1.EnglishDateTime.SuffixAndRegex);
        this.relativeDurationUnitRegex = recognizers_text_1.RegExpUtility.getSafeRegExp(englishDateTime_1.EnglishDateTime.RelativeDurationUnitRegex);
        this.cardinalExtractor = new recognizers_text_number_1.EnglishCardinalExtractor();
    }
}
exports.EnglishDurationExtractorConfiguration = EnglishDurationExtractorConfiguration;
class EnglishDurationParserConfiguration {
    constructor(config) {
        this.cardinalExtractor = config.cardinalExtractor;
        this.numberParser = config.numberParser;
        this.followedUnit = recognizers_text_1.RegExpUtility.getSafeRegExp(englishDateTime_1.EnglishDateTime.DurationFollowedUnit);
        this.suffixAndRegex = recognizers_text_1.RegExpUtility.getSafeRegExp(englishDateTime_1.EnglishDateTime.SuffixAndRegex);
        this.numberCombinedWithUnit = recognizers_text_1.RegExpUtility.getSafeRegExp(englishDateTime_1.EnglishDateTime.NumberCombinedWithDurationUnit);
        this.anUnitRegex = recognizers_text_1.RegExpUtility.getSafeRegExp(englishDateTime_1.EnglishDateTime.AnUnitRegex);
        this.allDateUnitRegex = recognizers_text_1.RegExpUtility.getSafeRegExp(englishDateTime_1.EnglishDateTime.AllRegex);
        this.halfDateUnitRegex = recognizers_text_1.RegExpUtility.getSafeRegExp(englishDateTime_1.EnglishDateTime.HalfRegex);
        this.inExactNumberUnitRegex = recognizers_text_1.RegExpUtility.getSafeRegExp(englishDateTime_1.EnglishDateTime.InExactNumberUnitRegex);
        this.unitMap = config.unitMap;
        this.unitValueMap = config.unitValueMap;
        this.doubleNumbers = config.doubleNumbers;
    }
}
exports.EnglishDurationParserConfiguration = EnglishDurationParserConfiguration;
//# sourceMappingURL=durationConfiguration.js.map