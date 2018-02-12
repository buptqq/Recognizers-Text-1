"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const recognizers_text_number_1 = require("recognizers-text-number");
const constants_1 = require("../constants");
const base_1 = require("./base");
const englishNumericWithUnit_1 = require("../../resources/englishNumericWithUnit");
class EnglishTemperatureExtractorConfiguration extends base_1.EnglishNumberWithUnitExtractorConfiguration {
    constructor(ci) {
        if (!ci) {
            ci = new recognizers_text_number_1.CultureInfo(recognizers_text_number_1.Culture.English);
        }
        super(ci);
        this.extractType = constants_1.Constants.SYS_UNIT_TEMPERATURE;
        this.suffixList = englishNumericWithUnit_1.EnglishNumericWithUnit.TemperatureSuffixList;
        this.prefixList = new Map();
        this.ambiguousUnitList = englishNumericWithUnit_1.EnglishNumericWithUnit.AmbiguousTemperatureUnitList;
    }
}
exports.EnglishTemperatureExtractorConfiguration = EnglishTemperatureExtractorConfiguration;
class EnglishTemperatureParserConfiguration extends base_1.EnglishNumberWithUnitParserConfiguration {
    constructor(ci) {
        if (!ci) {
            ci = new recognizers_text_number_1.CultureInfo(recognizers_text_number_1.Culture.English);
        }
        super(ci);
        this.BindDictionary(englishNumericWithUnit_1.EnglishNumericWithUnit.TemperatureSuffixList);
    }
}
exports.EnglishTemperatureParserConfiguration = EnglishTemperatureParserConfiguration;
//# sourceMappingURL=temperature.js.map