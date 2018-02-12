"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const recognizers_text_number_1 = require("recognizers-text-number");
const constants_1 = require("../constants");
const base_1 = require("./base");
const chineseNumericWithUnit_1 = require("../../resources/chineseNumericWithUnit");
class ChineseCurrencyExtractorConfiguration extends base_1.ChineseNumberWithUnitExtractorConfiguration {
    constructor(ci) {
        if (!ci) {
            ci = new recognizers_text_number_1.CultureInfo(recognizers_text_number_1.Culture.Chinese);
        }
        super(ci);
        this.extractType = constants_1.Constants.SYS_UNIT_CURRENCY;
        // Reference Source: https:// en.wikipedia.org/wiki/List_of_circulating_currencies
        this.suffixList = chineseNumericWithUnit_1.ChineseNumericWithUnit.CurrencySuffixList;
        this.prefixList = chineseNumericWithUnit_1.ChineseNumericWithUnit.CurrencyPrefixList;
        this.ambiguousUnitList = chineseNumericWithUnit_1.ChineseNumericWithUnit.CurrencyAmbiguousValues;
        ;
    }
}
exports.ChineseCurrencyExtractorConfiguration = ChineseCurrencyExtractorConfiguration;
class ChineseCurrencyParserConfiguration extends base_1.ChineseNumberWithUnitParserConfiguration {
    constructor(ci) {
        if (!ci) {
            ci = new recognizers_text_number_1.CultureInfo(recognizers_text_number_1.Culture.Chinese);
        }
        super(ci);
        this.BindDictionary(chineseNumericWithUnit_1.ChineseNumericWithUnit.CurrencySuffixList);
        this.BindDictionary(chineseNumericWithUnit_1.ChineseNumericWithUnit.CurrencyPrefixList);
    }
}
exports.ChineseCurrencyParserConfiguration = ChineseCurrencyParserConfiguration;
//# sourceMappingURL=currency.js.map