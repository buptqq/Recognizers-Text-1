"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const extractors_1 = require("../extractors");
const constants_1 = require("../constants");
const models_1 = require("../models");
const portugueseNumeric_1 = require("../../resources/portugueseNumeric");
const recognizers_text_1 = require("recognizers-text");
class PortugueseNumberExtractor extends extractors_1.BaseNumberExtractor {
    constructor(mode = models_1.NumberMode.Default) {
        super();
        this.extractType = constants_1.Constants.SYS_NUM;
        let regexes = new Array();
        // Add Cardinal
        let cardExtract = null;
        switch (mode) {
            case models_1.NumberMode.PureNumber:
                cardExtract = new PortugueseCardinalExtractor(portugueseNumeric_1.PortugueseNumeric.PlaceHolderPureNumber);
                break;
            case models_1.NumberMode.Currency:
                regexes.push({ regExp: recognizers_text_1.RegExpUtility.getSafeRegExp(portugueseNumeric_1.PortugueseNumeric.CurrencyRegex, "gs"), value: "IntegerNum" });
                break;
            case models_1.NumberMode.Default:
                break;
        }
        if (cardExtract === null) {
            cardExtract = new PortugueseCardinalExtractor();
        }
        cardExtract.regexes.forEach(r => regexes.push(r));
        // Add Fraction
        let fracExtract = new PortugueseFractionExtractor();
        fracExtract.regexes.forEach(r => regexes.push(r));
        this.regexes = regexes;
    }
}
exports.PortugueseNumberExtractor = PortugueseNumberExtractor;
class PortugueseCardinalExtractor extends extractors_1.BaseNumberExtractor {
    constructor(placeholder = portugueseNumeric_1.PortugueseNumeric.PlaceHolderDefault) {
        super();
        this.extractType = constants_1.Constants.SYS_NUM_CARDINAL;
        let regexes = new Array();
        // Add Integer Regexes
        let intExtract = new PortugueseIntegerExtractor(placeholder);
        intExtract.regexes.forEach(r => regexes.push(r));
        // Add Double Regexes
        let doubleExtract = new PortugueseDoubleExtractor(placeholder);
        doubleExtract.regexes.forEach(r => regexes.push(r));
        this.regexes = regexes;
    }
}
exports.PortugueseCardinalExtractor = PortugueseCardinalExtractor;
class PortugueseIntegerExtractor extends extractors_1.BaseNumberExtractor {
    constructor(placeholder = portugueseNumeric_1.PortugueseNumeric.PlaceHolderDefault) {
        super();
        this.extractType = constants_1.Constants.SYS_NUM_INTEGER;
        let regexes = new Array({
            regExp: recognizers_text_1.RegExpUtility.getSafeRegExp(portugueseNumeric_1.PortugueseNumeric.NumbersWithPlaceHolder(placeholder), "gi"),
            value: "IntegerNum"
        }, {
            regExp: recognizers_text_1.RegExpUtility.getSafeRegExp(portugueseNumeric_1.PortugueseNumeric.NumbersWithSuffix, "gs"),
            value: "IntegerNum"
        }, {
            regExp: this.generateLongFormatNumberRegexes(models_1.LongFormatType.integerNumDot, placeholder),
            value: "IntegerNum"
        }, {
            regExp: recognizers_text_1.RegExpUtility.getSafeRegExp(portugueseNumeric_1.PortugueseNumeric.RoundNumberIntegerRegexWithLocks),
            value: "IntegerNum"
        }, {
            regExp: recognizers_text_1.RegExpUtility.getSafeRegExp(portugueseNumeric_1.PortugueseNumeric.NumbersWithDozen2Suffix),
            value: "IntegerNum"
        }, {
            regExp: recognizers_text_1.RegExpUtility.getSafeRegExp(portugueseNumeric_1.PortugueseNumeric.NumbersWithDozenSuffix),
            value: "IntegerNum"
        }, {
            regExp: recognizers_text_1.RegExpUtility.getSafeRegExp(portugueseNumeric_1.PortugueseNumeric.AllIntRegexWithLocks),
            value: "IntegerPor"
        }, {
            regExp: recognizers_text_1.RegExpUtility.getSafeRegExp(portugueseNumeric_1.PortugueseNumeric.AllIntRegexWithDozenSuffixLocks),
            value: "IntegerPor"
        });
        this.regexes = regexes;
    }
}
exports.PortugueseIntegerExtractor = PortugueseIntegerExtractor;
class PortugueseDoubleExtractor extends extractors_1.BaseNumberExtractor {
    constructor(placeholder = portugueseNumeric_1.PortugueseNumeric.PlaceHolderDefault) {
        super();
        this.extractType = constants_1.Constants.SYS_NUM_DOUBLE;
        let regexes = new Array({
            regExp: recognizers_text_1.RegExpUtility.getSafeRegExp(portugueseNumeric_1.PortugueseNumeric.DoubleDecimalPointRegex(placeholder)),
            value: "DoubleNum"
        }, {
            regExp: recognizers_text_1.RegExpUtility.getSafeRegExp(portugueseNumeric_1.PortugueseNumeric.DoubleWithoutIntegralRegex(placeholder)),
            value: "DoubleNum"
        }, {
            regExp: recognizers_text_1.RegExpUtility.getSafeRegExp(portugueseNumeric_1.PortugueseNumeric.DoubleWithMultiplierRegex, "gs"),
            value: "DoubleNum"
        }, {
            regExp: recognizers_text_1.RegExpUtility.getSafeRegExp(portugueseNumeric_1.PortugueseNumeric.DoubleWithRoundNumber),
            value: "DoubleNum"
        }, {
            regExp: recognizers_text_1.RegExpUtility.getSafeRegExp(portugueseNumeric_1.PortugueseNumeric.DoubleAllFloatRegex),
            value: "DoublePor"
        }, {
            regExp: recognizers_text_1.RegExpUtility.getSafeRegExp(portugueseNumeric_1.PortugueseNumeric.DoubleExponentialNotationRegex),
            value: "DoublePow"
        }, {
            regExp: recognizers_text_1.RegExpUtility.getSafeRegExp(portugueseNumeric_1.PortugueseNumeric.DoubleCaretExponentialNotationRegex),
            value: "DoublePow"
        }, {
            regExp: this.generateLongFormatNumberRegexes(models_1.LongFormatType.doubleNumDotComma, placeholder),
            value: "DoubleNum"
        });
        this.regexes = regexes;
    }
}
exports.PortugueseDoubleExtractor = PortugueseDoubleExtractor;
class PortugueseFractionExtractor extends extractors_1.BaseNumberExtractor {
    constructor() {
        super();
        this.extractType = constants_1.Constants.SYS_NUM_FRACTION;
        let regexes = new Array({
            regExp: recognizers_text_1.RegExpUtility.getSafeRegExp(portugueseNumeric_1.PortugueseNumeric.FractionNotationRegex),
            value: "FracNum"
        }, {
            regExp: recognizers_text_1.RegExpUtility.getSafeRegExp(portugueseNumeric_1.PortugueseNumeric.FractionNotationWithSpacesRegex),
            value: "FracNum"
        }, {
            regExp: recognizers_text_1.RegExpUtility.getSafeRegExp(portugueseNumeric_1.PortugueseNumeric.FractionNounRegex),
            value: "FracPor"
        }, {
            regExp: recognizers_text_1.RegExpUtility.getSafeRegExp(portugueseNumeric_1.PortugueseNumeric.FractionNounWithArticleRegex),
            value: "FracPor"
        }, {
            regExp: recognizers_text_1.RegExpUtility.getSafeRegExp(portugueseNumeric_1.PortugueseNumeric.FractionPrepositionRegex),
            value: "FracPor"
        });
        this.regexes = regexes;
    }
}
exports.PortugueseFractionExtractor = PortugueseFractionExtractor;
class PortugueseOrdinalExtractor extends extractors_1.BaseNumberExtractor {
    constructor() {
        super();
        this.extractType = constants_1.Constants.SYS_NUM_ORDINAL;
        let regexes = new Array({
            regExp: recognizers_text_1.RegExpUtility.getSafeRegExp(portugueseNumeric_1.PortugueseNumeric.OrdinalSuffixRegex),
            value: "OrdinalNum"
        }, {
            regExp: recognizers_text_1.RegExpUtility.getSafeRegExp(portugueseNumeric_1.PortugueseNumeric.OrdinalEnglishRegex),
            value: "OrdinalPor"
        });
        this.regexes = regexes;
    }
}
exports.PortugueseOrdinalExtractor = PortugueseOrdinalExtractor;
class PortuguesePercentageExtractor extends extractors_1.BasePercentageExtractor {
    constructor() {
        super(new PortugueseNumberExtractor());
    }
    initRegexes() {
        let regexStrs = [
            portugueseNumeric_1.PortugueseNumeric.NumberWithSuffixPercentage
        ];
        return this.buildRegexes(regexStrs);
    }
}
exports.PortuguesePercentageExtractor = PortuguesePercentageExtractor;
//# sourceMappingURL=extractors.js.map