"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const extractors_1 = require("../extractors");
const constants_1 = require("../constants");
const models_1 = require("../models");
const frenchNumeric_1 = require("../../resources/frenchNumeric");
const recognizers_text_1 = require("recognizers-text");
class FrenchNumberExtractor extends extractors_1.BaseNumberExtractor {
    constructor(mode = models_1.NumberMode.Default) {
        super();
        this.extractType = constants_1.Constants.SYS_NUM;
        let regexes = new Array();
        // Add Cardinal
        let cardExtract = null;
        switch (mode) {
            case models_1.NumberMode.PureNumber:
                cardExtract = new FrenchCardinalExtractor(frenchNumeric_1.FrenchNumeric.PlaceHolderPureNumber);
                break;
            case models_1.NumberMode.Currency:
                regexes.push({ regExp: recognizers_text_1.RegExpUtility.getSafeRegExp(frenchNumeric_1.FrenchNumeric.CurrencyRegex, "gs"), value: "IntegerNum" });
                break;
            case models_1.NumberMode.Default:
                break;
        }
        if (cardExtract === null) {
            cardExtract = new FrenchCardinalExtractor();
        }
        cardExtract.regexes.forEach(r => regexes.push(r));
        // Add Fraction
        let fracExtract = new FrenchFractionExtractor();
        fracExtract.regexes.forEach(r => regexes.push(r));
        this.regexes = regexes;
    }
}
exports.FrenchNumberExtractor = FrenchNumberExtractor;
class FrenchCardinalExtractor extends extractors_1.BaseNumberExtractor {
    constructor(placeholder = frenchNumeric_1.FrenchNumeric.PlaceHolderDefault) {
        super();
        this.extractType = constants_1.Constants.SYS_NUM_CARDINAL;
        let regexes = new Array();
        // Add Integer Regexes
        let intExtract = new FrenchIntegerExtractor(placeholder);
        intExtract.regexes.forEach(r => regexes.push(r));
        // Add Double Regexes
        let doubleExtract = new FrenchDoubleExtractor(placeholder);
        doubleExtract.regexes.forEach(r => regexes.push(r));
        this.regexes = regexes;
    }
}
exports.FrenchCardinalExtractor = FrenchCardinalExtractor;
class FrenchIntegerExtractor extends extractors_1.BaseNumberExtractor {
    constructor(placeholder = frenchNumeric_1.FrenchNumeric.PlaceHolderDefault) {
        super();
        this.extractType = constants_1.Constants.SYS_NUM_INTEGER;
        let regexes = new Array({
            regExp: recognizers_text_1.RegExpUtility.getSafeRegExp(frenchNumeric_1.FrenchNumeric.NumbersWithPlaceHolder(placeholder), "gi"),
            value: "IntegerNum"
        }, {
            regExp: recognizers_text_1.RegExpUtility.getSafeRegExp(frenchNumeric_1.FrenchNumeric.NumbersWithSuffix, "gs"),
            value: "IntegerNum"
        }, {
            regExp: this.generateLongFormatNumberRegexes(models_1.LongFormatType.integerNumDot, placeholder),
            value: "IntegerNum"
        }, {
            regExp: recognizers_text_1.RegExpUtility.getSafeRegExp(frenchNumeric_1.FrenchNumeric.RoundNumberIntegerRegexWithLocks),
            value: "IntegerNum"
        }, {
            regExp: recognizers_text_1.RegExpUtility.getSafeRegExp(frenchNumeric_1.FrenchNumeric.NumbersWithDozenSuffix),
            value: "IntegerNum"
        }, {
            regExp: recognizers_text_1.RegExpUtility.getSafeRegExp(frenchNumeric_1.FrenchNumeric.AllIntRegexWithLocks),
            value: "IntegerFr"
        }, {
            regExp: recognizers_text_1.RegExpUtility.getSafeRegExp(frenchNumeric_1.FrenchNumeric.AllIntRegexWithDozenSuffixLocks),
            value: "IntegerFr"
        });
        this.regexes = regexes;
    }
}
exports.FrenchIntegerExtractor = FrenchIntegerExtractor;
class FrenchDoubleExtractor extends extractors_1.BaseNumberExtractor {
    constructor(placeholder = frenchNumeric_1.FrenchNumeric.PlaceHolderDefault) {
        super();
        this.extractType = constants_1.Constants.SYS_NUM_DOUBLE;
        let regexes = new Array({
            regExp: recognizers_text_1.RegExpUtility.getSafeRegExp(frenchNumeric_1.FrenchNumeric.DoubleDecimalPointRegex(placeholder)),
            value: "DoubleNum"
        }, {
            regExp: recognizers_text_1.RegExpUtility.getSafeRegExp(frenchNumeric_1.FrenchNumeric.DoubleWithoutIntegralRegex(placeholder)),
            value: "DoubleNum"
        }, {
            regExp: recognizers_text_1.RegExpUtility.getSafeRegExp(frenchNumeric_1.FrenchNumeric.DoubleWithMultiplierRegex, "gs"),
            value: "DoubleNum"
        }, {
            regExp: recognizers_text_1.RegExpUtility.getSafeRegExp(frenchNumeric_1.FrenchNumeric.DoubleWithRoundNumber),
            value: "DoubleNum"
        }, {
            regExp: recognizers_text_1.RegExpUtility.getSafeRegExp(frenchNumeric_1.FrenchNumeric.DoubleAllFloatRegex),
            value: "DoubleFr"
        }, {
            regExp: recognizers_text_1.RegExpUtility.getSafeRegExp(frenchNumeric_1.FrenchNumeric.DoubleExponentialNotationRegex),
            value: "DoublePow"
        }, {
            regExp: recognizers_text_1.RegExpUtility.getSafeRegExp(frenchNumeric_1.FrenchNumeric.DoubleCaretExponentialNotationRegex),
            value: "DoublePow"
        }, {
            regExp: this.generateLongFormatNumberRegexes(models_1.LongFormatType.doubleNumDotComma, placeholder),
            value: "DoubleNum"
        });
        this.regexes = regexes;
    }
}
exports.FrenchDoubleExtractor = FrenchDoubleExtractor;
class FrenchFractionExtractor extends extractors_1.BaseNumberExtractor {
    constructor() {
        super();
        this.extractType = constants_1.Constants.SYS_NUM_FRACTION;
        let regexes = new Array({
            regExp: recognizers_text_1.RegExpUtility.getSafeRegExp(frenchNumeric_1.FrenchNumeric.FractionNotationRegex),
            value: "FracNum"
        }, {
            regExp: recognizers_text_1.RegExpUtility.getSafeRegExp(frenchNumeric_1.FrenchNumeric.FractionNotationWithSpacesRegex),
            value: "FracNum"
        }, {
            regExp: recognizers_text_1.RegExpUtility.getSafeRegExp(frenchNumeric_1.FrenchNumeric.FractionNounRegex),
            value: "FracFr"
        }, {
            regExp: recognizers_text_1.RegExpUtility.getSafeRegExp(frenchNumeric_1.FrenchNumeric.FractionNounWithArticleRegex),
            value: "FracFr"
        }, {
            regExp: recognizers_text_1.RegExpUtility.getSafeRegExp(frenchNumeric_1.FrenchNumeric.FractionPrepositionRegex),
            value: "FracFr"
        });
        this.regexes = regexes;
    }
}
exports.FrenchFractionExtractor = FrenchFractionExtractor;
class FrenchOrdinalExtractor extends extractors_1.BaseNumberExtractor {
    constructor() {
        super();
        this.extractType = constants_1.Constants.SYS_NUM_ORDINAL;
        let regexes = new Array({
            regExp: recognizers_text_1.RegExpUtility.getSafeRegExp(frenchNumeric_1.FrenchNumeric.OrdinalSuffixRegex),
            value: "OrdinalNum"
        }, {
            regExp: recognizers_text_1.RegExpUtility.getSafeRegExp(frenchNumeric_1.FrenchNumeric.OrdinalFrenchRegex),
            value: "OrdFr"
        });
        this.regexes = regexes;
    }
}
exports.FrenchOrdinalExtractor = FrenchOrdinalExtractor;
class FrenchPercentageExtractor extends extractors_1.BasePercentageExtractor {
    constructor() {
        super(new FrenchNumberExtractor());
    }
    initRegexes() {
        let regexStrs = [
            frenchNumeric_1.FrenchNumeric.NumberWithSuffixPercentage,
            frenchNumeric_1.FrenchNumeric.NumberWithPrefixPercentage
        ];
        return this.buildRegexes(regexStrs);
    }
}
exports.FrenchPercentageExtractor = FrenchPercentageExtractor;
//# sourceMappingURL=extractors.js.map