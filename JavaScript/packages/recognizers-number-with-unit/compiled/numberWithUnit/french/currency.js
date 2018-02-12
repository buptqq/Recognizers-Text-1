"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const recognizers_text_number_1 = require("recognizers-text-number");
const constants_1 = require("../constants");
const base_1 = require("./base");
const frenchNumericWithUnit_1 = require("../../resources/frenchNumericWithUnit");
class FrenchCurrencyExtractorConfiguration extends base_1.FrenchNumberWithUnitExtractorConfiguration {
    constructor(ci) {
        if (!ci) {
            ci = new recognizers_text_number_1.CultureInfo(recognizers_text_number_1.Culture.French);
        }
        super(ci);
        this.extractType = constants_1.Constants.SYS_UNIT_CURRENCY;
        // Reference Source: https:// en.wikipedia.org/wiki/List_of_circulating_currencies
        this.suffixList = frenchNumericWithUnit_1.FrenchNumericWithUnit.CurrencySuffixList;
        this.prefixList = frenchNumericWithUnit_1.FrenchNumericWithUnit.CurrencyPrefixList;
        this.ambiguousUnitList = frenchNumericWithUnit_1.FrenchNumericWithUnit.AmbiguousCurrencyUnitList;
    }
}
exports.FrenchCurrencyExtractorConfiguration = FrenchCurrencyExtractorConfiguration;
class FrenchCurrencyParserConfiguration extends base_1.FrenchNumberWithUnitParserConfiguration {
    constructor(ci) {
        if (!ci) {
            ci = new recognizers_text_number_1.CultureInfo(recognizers_text_number_1.Culture.French);
        }
        super(ci);
        this.BindDictionary(frenchNumericWithUnit_1.FrenchNumericWithUnit.CurrencySuffixList);
        this.BindDictionary(frenchNumericWithUnit_1.FrenchNumericWithUnit.CurrencyPrefixList);
    }
}
exports.FrenchCurrencyParserConfiguration = FrenchCurrencyParserConfiguration;
//# sourceMappingURL=currency.js.map