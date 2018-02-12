"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const recognizers_text_number_1 = require("recognizers-text-number");
const constants_1 = require("../constants");
const base_1 = require("./base");
const englishNumericWithUnit_1 = require("../../resources/englishNumericWithUnit");
const dimensionSuffixList = new Map([
    ...englishNumericWithUnit_1.EnglishNumericWithUnit.InformationSuffixList,
    ...englishNumericWithUnit_1.EnglishNumericWithUnit.AreaSuffixList,
    ...englishNumericWithUnit_1.EnglishNumericWithUnit.LenghtSuffixList,
    ...englishNumericWithUnit_1.EnglishNumericWithUnit.SpeedSuffixList,
    ...englishNumericWithUnit_1.EnglishNumericWithUnit.VolumeSuffixList,
    ...englishNumericWithUnit_1.EnglishNumericWithUnit.WeightSuffixList
]);
class EnglishDimensionExtractorConfiguration extends base_1.EnglishNumberWithUnitExtractorConfiguration {
    constructor(ci) {
        if (!ci) {
            ci = new recognizers_text_number_1.CultureInfo(recognizers_text_number_1.Culture.English);
        }
        super(ci);
        this.extractType = constants_1.Constants.SYS_UNIT_DIMENSION;
        this.suffixList = dimensionSuffixList;
        this.prefixList = new Map();
        this.ambiguousUnitList = englishNumericWithUnit_1.EnglishNumericWithUnit.AmbiguousDimensionUnitList;
    }
}
exports.EnglishDimensionExtractorConfiguration = EnglishDimensionExtractorConfiguration;
class EnglishDimensionParserConfiguration extends base_1.EnglishNumberWithUnitParserConfiguration {
    constructor(ci) {
        if (!ci) {
            ci = new recognizers_text_number_1.CultureInfo(recognizers_text_number_1.Culture.English);
        }
        super(ci);
        this.BindDictionary(dimensionSuffixList);
    }
}
exports.EnglishDimensionParserConfiguration = EnglishDimensionParserConfiguration;
//# sourceMappingURL=dimension.js.map