"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const recognizers_text_number_1 = require("recognizers-text-number");
const constants_1 = require("../constants");
const base_1 = require("./base");
const spanishNumericWithUnit_1 = require("../../resources/spanishNumericWithUnit");
class SpanishCurrencyExtractorConfiguration extends base_1.SpanishNumberWithUnitExtractorConfiguration {
    constructor(ci) {
        if (!ci) {
            ci = new recognizers_text_number_1.CultureInfo(recognizers_text_number_1.Culture.Spanish);
        }
        super(ci);
        this.extractType = constants_1.Constants.SYS_UNIT_CURRENCY;
        // Reference Source: https:// en.wikipedia.org/wiki/List_of_circulating_currencies
        this.suffixList = spanishNumericWithUnit_1.SpanishNumericWithUnit.CurrencySuffixList;
        this.prefixList = spanishNumericWithUnit_1.SpanishNumericWithUnit.CurrencyPrefixList;
        this.ambiguousUnitList = spanishNumericWithUnit_1.SpanishNumericWithUnit.AmbiguousCurrencyUnitList;
    }
}
exports.SpanishCurrencyExtractorConfiguration = SpanishCurrencyExtractorConfiguration;
class SpanishCurrencyParserConfiguration extends base_1.SpanishNumberWithUnitParserConfiguration {
    constructor(ci) {
        if (!ci) {
            ci = new recognizers_text_number_1.CultureInfo(recognizers_text_number_1.Culture.Spanish);
        }
        super(ci);
        this.BindDictionary(spanishNumericWithUnit_1.SpanishNumericWithUnit.CurrencySuffixList);
        this.BindDictionary(spanishNumericWithUnit_1.SpanishNumericWithUnit.CurrencyPrefixList);
    }
}
exports.SpanishCurrencyParserConfiguration = SpanishCurrencyParserConfiguration;
//# sourceMappingURL=currency.js.map