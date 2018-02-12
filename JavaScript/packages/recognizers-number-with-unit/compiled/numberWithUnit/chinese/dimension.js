"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const recognizers_text_number_1 = require("recognizers-text-number");
const constants_1 = require("../constants");
const base_1 = require("./base");
const chineseNumericWithUnit_1 = require("../../resources/chineseNumericWithUnit");
class ChineseDimensionExtractorConfiguration extends base_1.ChineseNumberWithUnitExtractorConfiguration {
    constructor(ci) {
        if (!ci) {
            ci = new recognizers_text_number_1.CultureInfo(recognizers_text_number_1.Culture.Chinese);
        }
        super(ci);
        this.extractType = constants_1.Constants.SYS_UNIT_DIMENSION;
        this.suffixList = chineseNumericWithUnit_1.ChineseNumericWithUnit.DimensionSuffixList;
        this.prefixList = new Map();
        this.ambiguousUnitList = chineseNumericWithUnit_1.ChineseNumericWithUnit.DimensionAmbiguousValues;
    }
}
exports.ChineseDimensionExtractorConfiguration = ChineseDimensionExtractorConfiguration;
class ChineseDimensionParserConfiguration extends base_1.ChineseNumberWithUnitParserConfiguration {
    constructor(ci) {
        if (!ci) {
            ci = new recognizers_text_number_1.CultureInfo(recognizers_text_number_1.Culture.Chinese);
        }
        super(ci);
        this.BindDictionary(chineseNumericWithUnit_1.ChineseNumericWithUnit.DimensionSuffixList);
    }
}
exports.ChineseDimensionParserConfiguration = ChineseDimensionParserConfiguration;
//# sourceMappingURL=dimension.js.map