"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const recognizers_text_number_1 = require("recognizers-text-number");
const constants_1 = require("../constants");
const base_1 = require("./base");
const portugueseNumericWithUnit_1 = require("../../resources/portugueseNumericWithUnit");
class PortugueseTemperatureExtractorConfiguration extends base_1.PortugueseNumberWithUnitExtractorConfiguration {
    constructor(ci) {
        if (!ci) {
            ci = new recognizers_text_number_1.CultureInfo(recognizers_text_number_1.Culture.Portuguese);
        }
        super(ci);
        this.extractType = constants_1.Constants.SYS_UNIT_TEMPERATURE;
        this.suffixList = portugueseNumericWithUnit_1.PortugueseNumericWithUnit.TemperatureSuffixList;
        this.prefixList = new Map();
        this.ambiguousUnitList = new Array();
    }
}
exports.PortugueseTemperatureExtractorConfiguration = PortugueseTemperatureExtractorConfiguration;
class PortugueseTemperatureParserConfiguration extends base_1.PortugueseNumberWithUnitParserConfiguration {
    constructor(ci) {
        if (!ci) {
            ci = new recognizers_text_number_1.CultureInfo(recognizers_text_number_1.Culture.Portuguese);
        }
        super(ci);
        this.BindDictionary(portugueseNumericWithUnit_1.PortugueseNumericWithUnit.TemperatureSuffixList);
    }
}
exports.PortugueseTemperatureParserConfiguration = PortugueseTemperatureParserConfiguration;
//# sourceMappingURL=temperature.js.map