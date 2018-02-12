"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const recognizers_text_number_1 = require("recognizers-text-number");
const constants_1 = require("../constants");
const base_1 = require("./base");
const englishNumericWithUnit_1 = require("../../resources/englishNumericWithUnit");
class EnglishCurrencyExtractorConfiguration extends base_1.EnglishNumberWithUnitExtractorConfiguration {
    constructor(ci) {
        if (!ci) {
            ci = new recognizers_text_number_1.CultureInfo(recognizers_text_number_1.Culture.English);
        }
        super(ci);
        this.extractType = constants_1.Constants.SYS_UNIT_CURRENCY;
        // Reference Source: https:// en.wikipedia.org/wiki/List_of_circulating_currencies
        this.suffixList = englishNumericWithUnit_1.EnglishNumericWithUnit.CurrencySuffixList;
        this.prefixList = englishNumericWithUnit_1.EnglishNumericWithUnit.CurrencyPrefixList;
        this.ambiguousUnitList = englishNumericWithUnit_1.EnglishNumericWithUnit.AmbiguousCurrencyUnitList;
    }
}
exports.EnglishCurrencyExtractorConfiguration = EnglishCurrencyExtractorConfiguration;
class EnglishCurrencyParserConfiguration extends base_1.EnglishNumberWithUnitParserConfiguration {
    constructor(ci) {
        if (!ci) {
            ci = new recognizers_text_number_1.CultureInfo(recognizers_text_number_1.Culture.English);
        }
        super(ci);
        this.BindDictionary(englishNumericWithUnit_1.EnglishNumericWithUnit.CurrencySuffixList);
        this.BindDictionary(englishNumericWithUnit_1.EnglishNumericWithUnit.CurrencyPrefixList);
    }
}
exports.EnglishCurrencyParserConfiguration = EnglishCurrencyParserConfiguration;
//# sourceMappingURL=currency.js.map