"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const recognizers_text_number_1 = require("recognizers-text-number");
const constants_1 = require("../constants");
const base_1 = require("./base");
const portugueseNumericWithUnit_1 = require("../../resources/portugueseNumericWithUnit");
const dimensionSuffixList = new Map([
    ...portugueseNumericWithUnit_1.PortugueseNumericWithUnit.InformationSuffixList,
    ...portugueseNumericWithUnit_1.PortugueseNumericWithUnit.AreaSuffixList,
    ...portugueseNumericWithUnit_1.PortugueseNumericWithUnit.LenghtSuffixList,
    ...portugueseNumericWithUnit_1.PortugueseNumericWithUnit.SpeedSuffixList,
    ...portugueseNumericWithUnit_1.PortugueseNumericWithUnit.VolumeSuffixList,
    ...portugueseNumericWithUnit_1.PortugueseNumericWithUnit.WeightSuffixList
]);
class PortugueseDimensionExtractorConfiguration extends base_1.PortugueseNumberWithUnitExtractorConfiguration {
    constructor(ci) {
        if (!ci) {
            ci = new recognizers_text_number_1.CultureInfo(recognizers_text_number_1.Culture.Portuguese);
        }
        super(ci);
        this.extractType = constants_1.Constants.SYS_UNIT_DIMENSION;
        this.suffixList = dimensionSuffixList;
        this.prefixList = new Map();
        this.ambiguousUnitList = portugueseNumericWithUnit_1.PortugueseNumericWithUnit.AmbiguousDimensionUnitList;
    }
}
exports.PortugueseDimensionExtractorConfiguration = PortugueseDimensionExtractorConfiguration;
class PortugueseDimensionParserConfiguration extends base_1.PortugueseNumberWithUnitParserConfiguration {
    constructor(ci) {
        if (!ci) {
            ci = new recognizers_text_number_1.CultureInfo(recognizers_text_number_1.Culture.Portuguese);
        }
        super(ci);
        this.BindDictionary(dimensionSuffixList);
    }
}
exports.PortugueseDimensionParserConfiguration = PortugueseDimensionParserConfiguration;
//# sourceMappingURL=dimension.js.map