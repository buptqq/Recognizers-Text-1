"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const recognizers_text_number_1 = require("recognizers-text-number");
const constants_1 = require("../constants");
const base_1 = require("./base");
const frenchNumericWithUnit_1 = require("../../resources/frenchNumericWithUnit");
class FrenchTemperatureExtractorConfiguration extends base_1.FrenchNumberWithUnitExtractorConfiguration {
    constructor(ci) {
        if (!ci) {
            ci = new recognizers_text_number_1.CultureInfo(recognizers_text_number_1.Culture.French);
        }
        super(ci);
        this.extractType = constants_1.Constants.SYS_UNIT_TEMPERATURE;
        this.suffixList = frenchNumericWithUnit_1.FrenchNumericWithUnit.TemperatureSuffixList;
        this.prefixList = new Map();
        this.ambiguousUnitList = new Array();
    }
}
exports.FrenchTemperatureExtractorConfiguration = FrenchTemperatureExtractorConfiguration;
class FrenchTemperatureParserConfiguration extends base_1.FrenchNumberWithUnitParserConfiguration {
    constructor(ci) {
        if (!ci) {
            ci = new recognizers_text_number_1.CultureInfo(recognizers_text_number_1.Culture.French);
        }
        super(ci);
        this.connectorToken = null;
        this.BindDictionary(frenchNumericWithUnit_1.FrenchNumericWithUnit.TemperatureSuffixList);
    }
}
exports.FrenchTemperatureParserConfiguration = FrenchTemperatureParserConfiguration;
//# sourceMappingURL=temperature.js.map