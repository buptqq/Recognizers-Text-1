"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const recognizers_text_number_1 = require("recognizers-text-number");
const constants_1 = require("../constants");
const base_1 = require("./base");
const spanishNumericWithUnit_1 = require("../../resources/spanishNumericWithUnit");
class SpanishAgeExtractorConfiguration extends base_1.SpanishNumberWithUnitExtractorConfiguration {
    constructor(ci) {
        if (!ci) {
            ci = new recognizers_text_number_1.CultureInfo(recognizers_text_number_1.Culture.Spanish);
        }
        super(ci);
        this.extractType = constants_1.Constants.SYS_UNIT_AGE;
        this.suffixList = spanishNumericWithUnit_1.SpanishNumericWithUnit.AgeSuffixList;
        this.prefixList = new Map();
        this.ambiguousUnitList = new Array();
    }
}
exports.SpanishAgeExtractorConfiguration = SpanishAgeExtractorConfiguration;
class SpanishAgeParserConfiguration extends base_1.SpanishNumberWithUnitParserConfiguration {
    constructor(ci) {
        if (!ci) {
            ci = new recognizers_text_number_1.CultureInfo(recognizers_text_number_1.Culture.Spanish);
        }
        super(ci);
        this.BindDictionary(spanishNumericWithUnit_1.SpanishNumericWithUnit.AgeSuffixList);
    }
}
exports.SpanishAgeParserConfiguration = SpanishAgeParserConfiguration;
//# sourceMappingURL=age.js.map