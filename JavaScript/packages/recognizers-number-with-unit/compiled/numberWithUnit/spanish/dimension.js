"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const recognizers_text_number_1 = require("recognizers-text-number");
const constants_1 = require("../constants");
const base_1 = require("./base");
const spanishNumericWithUnit_1 = require("../../resources/spanishNumericWithUnit");
class SpanishDimensionExtractorConfiguration extends base_1.SpanishNumberWithUnitExtractorConfiguration {
    constructor(ci) {
        if (!ci) {
            ci = new recognizers_text_number_1.CultureInfo(recognizers_text_number_1.Culture.Spanish);
        }
        super(ci);
        this.extractType = constants_1.Constants.SYS_UNIT_DIMENSION;
        this.suffixList = spanishNumericWithUnit_1.SpanishNumericWithUnit.DimensionSuffixList;
        this.prefixList = new Map();
        this.ambiguousUnitList = spanishNumericWithUnit_1.SpanishNumericWithUnit.AmbiguousDimensionUnitList;
    }
}
exports.SpanishDimensionExtractorConfiguration = SpanishDimensionExtractorConfiguration;
class SpanishDimensionParserConfiguration extends base_1.SpanishNumberWithUnitParserConfiguration {
    constructor(ci) {
        if (!ci) {
            ci = new recognizers_text_number_1.CultureInfo(recognizers_text_number_1.Culture.Spanish);
        }
        super(ci);
        this.BindDictionary(spanishNumericWithUnit_1.SpanishNumericWithUnit.DimensionSuffixList);
    }
}
exports.SpanishDimensionParserConfiguration = SpanishDimensionParserConfiguration;
//# sourceMappingURL=dimension.js.map