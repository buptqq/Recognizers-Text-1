"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const recognizers_text_1 = require("recognizers-text");
const recognizers_text_number_1 = require("recognizers-text-number");
const spanishDateTime_1 = require("../../resources/spanishDateTime");
class SpanishDurationExtractorConfiguration {
    constructor() {
        this.allRegex = recognizers_text_1.RegExpUtility.getSafeRegExp(spanishDateTime_1.SpanishDateTime.AllRegex, "gis");
        this.halfRegex = recognizers_text_1.RegExpUtility.getSafeRegExp(spanishDateTime_1.SpanishDateTime.HalfRegex, "gis");
        this.followedUnit = recognizers_text_1.RegExpUtility.getSafeRegExp(spanishDateTime_1.SpanishDateTime.FollowedUnit, "gis");
        this.numberCombinedWithUnit = recognizers_text_1.RegExpUtility.getSafeRegExp(spanishDateTime_1.SpanishDateTime.DurationNumberCombinedWithUnit, "gis");
        this.anUnitRegex = recognizers_text_1.RegExpUtility.getSafeRegExp(spanishDateTime_1.SpanishDateTime.AnUnitRegex, "gis");
        this.inExactNumberUnitRegex = recognizers_text_1.RegExpUtility.getSafeRegExp(spanishDateTime_1.SpanishDateTime.InExactNumberUnitRegex, "gis");
        this.suffixAndRegex = recognizers_text_1.RegExpUtility.getSafeRegExp(spanishDateTime_1.SpanishDateTime.SuffixAndRegex, "gis");
        this.relativeDurationUnitRegex = recognizers_text_1.RegExpUtility.getSafeRegExp(spanishDateTime_1.SpanishDateTime.RelativeDurationUnitRegex, "gis");
        this.cardinalExtractor = new recognizers_text_number_1.SpanishCardinalExtractor();
    }
}
exports.SpanishDurationExtractorConfiguration = SpanishDurationExtractorConfiguration;
class SpanishDurationParserConfiguration {
    constructor(config) {
        this.cardinalExtractor = config.cardinalExtractor;
        this.numberParser = config.numberParser;
        this.followedUnit = recognizers_text_1.RegExpUtility.getSafeRegExp(spanishDateTime_1.SpanishDateTime.FollowedUnit);
        this.suffixAndRegex = recognizers_text_1.RegExpUtility.getSafeRegExp(spanishDateTime_1.SpanishDateTime.SuffixAndRegex);
        this.numberCombinedWithUnit = recognizers_text_1.RegExpUtility.getSafeRegExp(spanishDateTime_1.SpanishDateTime.DurationNumberCombinedWithUnit);
        this.anUnitRegex = recognizers_text_1.RegExpUtility.getSafeRegExp(spanishDateTime_1.SpanishDateTime.AnUnitRegex);
        this.allDateUnitRegex = recognizers_text_1.RegExpUtility.getSafeRegExp(spanishDateTime_1.SpanishDateTime.AllRegex);
        this.halfDateUnitRegex = recognizers_text_1.RegExpUtility.getSafeRegExp(spanishDateTime_1.SpanishDateTime.HalfRegex);
        this.inExactNumberUnitRegex = recognizers_text_1.RegExpUtility.getSafeRegExp(spanishDateTime_1.SpanishDateTime.InExactNumberUnitRegex);
        this.unitMap = config.unitMap;
        this.unitValueMap = config.unitValueMap;
        this.doubleNumbers = config.doubleNumbers;
    }
}
exports.SpanishDurationParserConfiguration = SpanishDurationParserConfiguration;
//# sourceMappingURL=durationConfiguration.js.map