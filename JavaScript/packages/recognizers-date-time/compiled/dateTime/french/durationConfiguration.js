"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const recognizers_text_1 = require("recognizers-text");
const recognizers_text_number_1 = require("recognizers-text-number");
const frenchDateTime_1 = require("../../resources/frenchDateTime");
class FrenchDurationExtractorConfiguration {
    constructor() {
        this.allRegex = recognizers_text_1.RegExpUtility.getSafeRegExp(frenchDateTime_1.FrenchDateTime.AllRegex, "gis");
        this.halfRegex = recognizers_text_1.RegExpUtility.getSafeRegExp(frenchDateTime_1.FrenchDateTime.HalfRegex, "gis");
        this.followedUnit = recognizers_text_1.RegExpUtility.getSafeRegExp(frenchDateTime_1.FrenchDateTime.DurationFollowedUnit, "gis");
        this.numberCombinedWithUnit = recognizers_text_1.RegExpUtility.getSafeRegExp(frenchDateTime_1.FrenchDateTime.NumberCombinedWithDurationUnit, "gis");
        this.anUnitRegex = recognizers_text_1.RegExpUtility.getSafeRegExp(frenchDateTime_1.FrenchDateTime.AnUnitRegex, "gis");
        this.inExactNumberUnitRegex = recognizers_text_1.RegExpUtility.getSafeRegExp(frenchDateTime_1.FrenchDateTime.InExactNumberUnitRegex, "gis");
        this.suffixAndRegex = recognizers_text_1.RegExpUtility.getSafeRegExp(frenchDateTime_1.FrenchDateTime.SuffixAndRegex, "gis");
        this.relativeDurationUnitRegex = recognizers_text_1.RegExpUtility.getSafeRegExp(frenchDateTime_1.FrenchDateTime.RelativeDurationUnitRegex, "gis");
        this.cardinalExtractor = new recognizers_text_number_1.FrenchCardinalExtractor();
    }
}
exports.FrenchDurationExtractorConfiguration = FrenchDurationExtractorConfiguration;
class FrenchDurationParserConfiguration {
    constructor(config) {
        this.cardinalExtractor = config.cardinalExtractor;
        this.numberParser = config.numberParser;
        this.followedUnit = recognizers_text_1.RegExpUtility.getSafeRegExp(frenchDateTime_1.FrenchDateTime.DurationFollowedUnit);
        this.suffixAndRegex = recognizers_text_1.RegExpUtility.getSafeRegExp(frenchDateTime_1.FrenchDateTime.SuffixAndRegex);
        this.numberCombinedWithUnit = recognizers_text_1.RegExpUtility.getSafeRegExp(frenchDateTime_1.FrenchDateTime.NumberCombinedWithDurationUnit);
        this.anUnitRegex = recognizers_text_1.RegExpUtility.getSafeRegExp(frenchDateTime_1.FrenchDateTime.AnUnitRegex);
        this.allDateUnitRegex = recognizers_text_1.RegExpUtility.getSafeRegExp(frenchDateTime_1.FrenchDateTime.AllRegex);
        this.halfDateUnitRegex = recognizers_text_1.RegExpUtility.getSafeRegExp(frenchDateTime_1.FrenchDateTime.HalfRegex);
        this.inExactNumberUnitRegex = recognizers_text_1.RegExpUtility.getSafeRegExp(frenchDateTime_1.FrenchDateTime.InExactNumberUnitRegex);
        this.unitMap = config.unitMap;
        this.unitValueMap = config.unitValueMap;
        this.doubleNumbers = config.doubleNumbers;
    }
}
exports.FrenchDurationParserConfiguration = FrenchDurationParserConfiguration;
//# sourceMappingURL=durationConfiguration.js.map