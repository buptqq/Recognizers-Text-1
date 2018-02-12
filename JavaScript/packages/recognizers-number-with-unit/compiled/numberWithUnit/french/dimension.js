"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const recognizers_text_number_1 = require("recognizers-text-number");
const constants_1 = require("../constants");
const base_1 = require("./base");
const frenchNumericWithUnit_1 = require("../../resources/frenchNumericWithUnit");
const dimensionSuffixList = new Map([
    ...frenchNumericWithUnit_1.FrenchNumericWithUnit.InformationSuffixList,
    ...frenchNumericWithUnit_1.FrenchNumericWithUnit.AreaSuffixList,
    ...frenchNumericWithUnit_1.FrenchNumericWithUnit.LengthSuffixList,
    ...frenchNumericWithUnit_1.FrenchNumericWithUnit.SpeedSuffixList,
    ...frenchNumericWithUnit_1.FrenchNumericWithUnit.VolumeSuffixList,
    ...frenchNumericWithUnit_1.FrenchNumericWithUnit.WeightSuffixList
]);
class FrenchDimensionExtractorConfiguration extends base_1.FrenchNumberWithUnitExtractorConfiguration {
    constructor(ci) {
        if (!ci) {
            ci = new recognizers_text_number_1.CultureInfo(recognizers_text_number_1.Culture.French);
        }
        super(ci);
        this.extractType = constants_1.Constants.SYS_UNIT_DIMENSION;
        this.suffixList = dimensionSuffixList;
        this.prefixList = new Map();
        this.ambiguousUnitList = frenchNumericWithUnit_1.FrenchNumericWithUnit.AmbiguousDimensionUnitList;
    }
}
exports.FrenchDimensionExtractorConfiguration = FrenchDimensionExtractorConfiguration;
class FrenchDimensionParserConfiguration extends base_1.FrenchNumberWithUnitParserConfiguration {
    constructor(ci) {
        if (!ci) {
            ci = new recognizers_text_number_1.CultureInfo(recognizers_text_number_1.Culture.French);
        }
        super(ci);
        this.BindDictionary(dimensionSuffixList);
    }
}
exports.FrenchDimensionParserConfiguration = FrenchDimensionParserConfiguration;
//# sourceMappingURL=dimension.js.map