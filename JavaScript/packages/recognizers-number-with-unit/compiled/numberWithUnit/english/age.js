"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const recognizers_text_number_1 = require("recognizers-text-number");
const constants_1 = require("../constants");
const base_1 = require("./base");
const englishNumericWithUnit_1 = require("../../resources/englishNumericWithUnit");
class EnglishAgeExtractorConfiguration extends base_1.EnglishNumberWithUnitExtractorConfiguration {
    constructor(ci) {
        if (!ci) {
            ci = new recognizers_text_number_1.CultureInfo(recognizers_text_number_1.Culture.English);
        }
        super(ci);
        this.extractType = constants_1.Constants.SYS_UNIT_AGE;
        this.suffixList = englishNumericWithUnit_1.EnglishNumericWithUnit.AgeSuffixList;
        this.prefixList = new Map();
        this.ambiguousUnitList = new Array();
    }
}
exports.EnglishAgeExtractorConfiguration = EnglishAgeExtractorConfiguration;
class EnglishAgeParserConfiguration extends base_1.EnglishNumberWithUnitParserConfiguration {
    constructor(ci) {
        if (!ci) {
            ci = new recognizers_text_number_1.CultureInfo(recognizers_text_number_1.Culture.English);
        }
        super(ci);
        this.BindDictionary(englishNumericWithUnit_1.EnglishNumericWithUnit.AgeSuffixList);
    }
}
exports.EnglishAgeParserConfiguration = EnglishAgeParserConfiguration;
//# sourceMappingURL=age.js.map