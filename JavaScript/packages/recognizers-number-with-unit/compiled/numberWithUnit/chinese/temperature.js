"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const recognizers_text_number_1 = require("recognizers-text-number");
const constants_1 = require("../constants");
const base_1 = require("./base");
const chineseNumericWithUnit_1 = require("../../resources/chineseNumericWithUnit");
class ChineseTemperatureExtractorConfiguration extends base_1.ChineseNumberWithUnitExtractorConfiguration {
    constructor(ci) {
        if (!ci) {
            ci = new recognizers_text_number_1.CultureInfo(recognizers_text_number_1.Culture.Chinese);
        }
        super(ci);
        this.extractType = constants_1.Constants.SYS_UNIT_TEMPERATURE;
        this.suffixList = chineseNumericWithUnit_1.ChineseNumericWithUnit.TemperatureSuffixList;
        this.prefixList = chineseNumericWithUnit_1.ChineseNumericWithUnit.TemperaturePrefixList;
        this.ambiguousUnitList = chineseNumericWithUnit_1.ChineseNumericWithUnit.TemperatureAmbiguousValues;
    }
}
exports.ChineseTemperatureExtractorConfiguration = ChineseTemperatureExtractorConfiguration;
class ChineseTemperatureParserConfiguration extends base_1.ChineseNumberWithUnitParserConfiguration {
    constructor(ci) {
        if (!ci) {
            ci = new recognizers_text_number_1.CultureInfo(recognizers_text_number_1.Culture.Chinese);
        }
        super(ci);
        this.BindDictionary(chineseNumericWithUnit_1.ChineseNumericWithUnit.TemperaturePrefixList);
        this.BindDictionary(chineseNumericWithUnit_1.ChineseNumericWithUnit.TemperatureSuffixList);
    }
}
exports.ChineseTemperatureParserConfiguration = ChineseTemperatureParserConfiguration;
//# sourceMappingURL=temperature.js.map