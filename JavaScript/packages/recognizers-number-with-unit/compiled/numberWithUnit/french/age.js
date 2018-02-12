"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const recognizers_text_number_1 = require("recognizers-text-number");
const constants_1 = require("../constants");
const base_1 = require("./base");
const frenchNumericWithUnit_1 = require("../../resources/frenchNumericWithUnit");
class FrenchAgeExtractorConfiguration extends base_1.FrenchNumberWithUnitExtractorConfiguration {
    constructor(ci) {
        if (!ci) {
            ci = new recognizers_text_number_1.CultureInfo(recognizers_text_number_1.Culture.French);
        }
        super(ci);
        this.extractType = constants_1.Constants.SYS_UNIT_AGE;
        this.suffixList = frenchNumericWithUnit_1.FrenchNumericWithUnit.AgeSuffixList;
        this.prefixList = new Map();
        this.ambiguousUnitList = new Array();
    }
}
exports.FrenchAgeExtractorConfiguration = FrenchAgeExtractorConfiguration;
class FrenchAgeParserConfiguration extends base_1.FrenchNumberWithUnitParserConfiguration {
    constructor(ci) {
        if (!ci) {
            ci = new recognizers_text_number_1.CultureInfo(recognizers_text_number_1.Culture.French);
        }
        super(ci);
        this.BindDictionary(frenchNumericWithUnit_1.FrenchNumericWithUnit.AgeSuffixList);
    }
}
exports.FrenchAgeParserConfiguration = FrenchAgeParserConfiguration;
//# sourceMappingURL=age.js.map