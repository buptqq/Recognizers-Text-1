"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const recognizers_text_number_1 = require("recognizers-text-number");
const constants_1 = require("../constants");
const base_1 = require("./base");
const portugueseNumericWithUnit_1 = require("../../resources/portugueseNumericWithUnit");
class PortugueseCurrencyExtractorConfiguration extends base_1.PortugueseNumberWithUnitExtractorConfiguration {
    constructor(ci) {
        if (!ci) {
            ci = new recognizers_text_number_1.CultureInfo(recognizers_text_number_1.Culture.Portuguese);
        }
        super(ci);
        this.extractType = constants_1.Constants.SYS_UNIT_CURRENCY;
        // Reference Source: https:// en.wikipedia.org/wiki/List_of_circulating_currencies
        this.suffixList = portugueseNumericWithUnit_1.PortugueseNumericWithUnit.CurrencySuffixList;
        this.prefixList = portugueseNumericWithUnit_1.PortugueseNumericWithUnit.CurrencyPrefixList;
        this.ambiguousUnitList = portugueseNumericWithUnit_1.PortugueseNumericWithUnit.AmbiguousCurrencyUnitList;
    }
}
exports.PortugueseCurrencyExtractorConfiguration = PortugueseCurrencyExtractorConfiguration;
class PortugueseCurrencyParserConfiguration extends base_1.PortugueseNumberWithUnitParserConfiguration {
    constructor(ci) {
        if (!ci) {
            ci = new recognizers_text_number_1.CultureInfo(recognizers_text_number_1.Culture.Portuguese);
        }
        super(ci);
        this.BindDictionary(portugueseNumericWithUnit_1.PortugueseNumericWithUnit.CurrencySuffixList);
        this.BindDictionary(portugueseNumericWithUnit_1.PortugueseNumericWithUnit.CurrencyPrefixList);
    }
}
exports.PortugueseCurrencyParserConfiguration = PortugueseCurrencyParserConfiguration;
//# sourceMappingURL=currency.js.map