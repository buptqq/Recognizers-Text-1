"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const extractors_1 = require("../extractors");
const constants_1 = require("../constants");
const models_1 = require("../models");
const spanishNumeric_1 = require("../../resources/spanishNumeric");
const recognizers_text_1 = require("recognizers-text");
class SpanishNumberExtractor extends extractors_1.BaseNumberExtractor {
    constructor(mode = models_1.NumberMode.Default) {
        super();
        this.extractType = constants_1.Constants.SYS_NUM;
        let regexes = new Array();
        // Add Cardinal
        let cardExtract = null;
        switch (mode) {
            case models_1.NumberMode.PureNumber:
                cardExtract = new SpanishCardinalExtractor(spanishNumeric_1.SpanishNumeric.PlaceHolderPureNumber);
                break;
            case models_1.NumberMode.Currency:
                regexes.push({ regExp: recognizers_text_1.RegExpUtility.getSafeRegExp(spanishNumeric_1.SpanishNumeric.CurrencyRegex, "gs"), value: "IntegerNum" });
                break;
            case models_1.NumberMode.Default:
                break;
        }
        if (cardExtract === null) {
            cardExtract = new SpanishCardinalExtractor();
        }
        cardExtract.regexes.forEach(r => regexes.push(r));
        // Add Fraction
        let fracExtract = new SpanishFractionExtractor();
        fracExtract.regexes.forEach(r => regexes.push(r));
        this.regexes = regexes;
    }
}
exports.SpanishNumberExtractor = SpanishNumberExtractor;
class SpanishCardinalExtractor extends extractors_1.BaseNumberExtractor {
    constructor(placeholder = spanishNumeric_1.SpanishNumeric.PlaceHolderDefault) {
        super();
        this.extractType = constants_1.Constants.SYS_NUM_CARDINAL;
        let regexes = new Array();
        // Add Integer Regexes
        let intExtract = new SpanishIntegerExtractor(placeholder);
        intExtract.regexes.forEach(r => regexes.push(r));
        // Add Double Regexes
        let doubleExtract = new SpanishDoubleExtractor(placeholder);
        doubleExtract.regexes.forEach(r => regexes.push(r));
        this.regexes = regexes;
    }
}
exports.SpanishCardinalExtractor = SpanishCardinalExtractor;
class SpanishIntegerExtractor extends extractors_1.BaseNumberExtractor {
    constructor(placeholder = spanishNumeric_1.SpanishNumeric.PlaceHolderDefault) {
        super();
        this.extractType = constants_1.Constants.SYS_NUM_INTEGER;
        let regexes = new Array({
            regExp: recognizers_text_1.RegExpUtility.getSafeRegExp(spanishNumeric_1.SpanishNumeric.NumbersWithPlaceHolder(placeholder), "gi"),
            value: "IntegerNum"
        }, {
            regExp: recognizers_text_1.RegExpUtility.getSafeRegExp(spanishNumeric_1.SpanishNumeric.NumbersWithSuffix, "gs"),
            value: "IntegerNum"
        }, {
            regExp: this.generateLongFormatNumberRegexes(models_1.LongFormatType.integerNumDot, placeholder),
            value: "IntegerNum"
        }, {
            regExp: recognizers_text_1.RegExpUtility.getSafeRegExp(spanishNumeric_1.SpanishNumeric.RoundNumberIntegerRegexWithLocks),
            value: "IntegerNum"
        }, {
            regExp: recognizers_text_1.RegExpUtility.getSafeRegExp(spanishNumeric_1.SpanishNumeric.NumbersWithDozenSuffix),
            value: "IntegerNum"
        }, {
            regExp: recognizers_text_1.RegExpUtility.getSafeRegExp(spanishNumeric_1.SpanishNumeric.AllIntRegexWithLocks),
            value: "IntegerSpa"
        }, {
            regExp: recognizers_text_1.RegExpUtility.getSafeRegExp(spanishNumeric_1.SpanishNumeric.AllIntRegexWithDozenSuffixLocks),
            value: "IntegerSpa"
        });
        this.regexes = regexes;
    }
}
exports.SpanishIntegerExtractor = SpanishIntegerExtractor;
class SpanishDoubleExtractor extends extractors_1.BaseNumberExtractor {
    constructor(placeholder = spanishNumeric_1.SpanishNumeric.PlaceHolderDefault) {
        super();
        this.extractType = constants_1.Constants.SYS_NUM_DOUBLE;
        let regexes = new Array({
            regExp: recognizers_text_1.RegExpUtility.getSafeRegExp(spanishNumeric_1.SpanishNumeric.DoubleDecimalPointRegex(placeholder)),
            value: "DoubleNum"
        }, {
            regExp: recognizers_text_1.RegExpUtility.getSafeRegExp(spanishNumeric_1.SpanishNumeric.DoubleWithoutIntegralRegex(placeholder)),
            value: "DoubleNum"
        }, {
            regExp: recognizers_text_1.RegExpUtility.getSafeRegExp(spanishNumeric_1.SpanishNumeric.DoubleWithMultiplierRegex, "gs"),
            value: "DoubleNum"
        }, {
            regExp: recognizers_text_1.RegExpUtility.getSafeRegExp(spanishNumeric_1.SpanishNumeric.DoubleWithRoundNumber),
            value: "DoubleNum"
        }, {
            regExp: recognizers_text_1.RegExpUtility.getSafeRegExp(spanishNumeric_1.SpanishNumeric.DoubleAllFloatRegex),
            value: "DoubleSpa"
        }, {
            regExp: recognizers_text_1.RegExpUtility.getSafeRegExp(spanishNumeric_1.SpanishNumeric.DoubleExponentialNotationRegex),
            value: "DoublePow"
        }, {
            regExp: recognizers_text_1.RegExpUtility.getSafeRegExp(spanishNumeric_1.SpanishNumeric.DoubleCaretExponentialNotationRegex),
            value: "DoublePow"
        }, {
            regExp: this.generateLongFormatNumberRegexes(models_1.LongFormatType.doubleNumDotComma, placeholder),
            value: "DoubleNum"
        });
        this.regexes = regexes;
    }
}
exports.SpanishDoubleExtractor = SpanishDoubleExtractor;
class SpanishFractionExtractor extends extractors_1.BaseNumberExtractor {
    constructor() {
        super();
        this.extractType = constants_1.Constants.SYS_NUM_FRACTION;
        let regexes = new Array({
            regExp: recognizers_text_1.RegExpUtility.getSafeRegExp(spanishNumeric_1.SpanishNumeric.FractionNotationRegex),
            value: "FracNum"
        }, {
            regExp: recognizers_text_1.RegExpUtility.getSafeRegExp(spanishNumeric_1.SpanishNumeric.FractionNotationWithSpacesRegex),
            value: "FracNum"
        }, {
            regExp: recognizers_text_1.RegExpUtility.getSafeRegExp(spanishNumeric_1.SpanishNumeric.FractionNounRegex),
            value: "FracSpa"
        }, {
            regExp: recognizers_text_1.RegExpUtility.getSafeRegExp(spanishNumeric_1.SpanishNumeric.FractionNounWithArticleRegex),
            value: "FracSpa"
        }, {
            regExp: recognizers_text_1.RegExpUtility.getSafeRegExp(spanishNumeric_1.SpanishNumeric.FractionPrepositionRegex),
            value: "FracSpa"
        });
        this.regexes = regexes;
    }
}
exports.SpanishFractionExtractor = SpanishFractionExtractor;
class SpanishOrdinalExtractor extends extractors_1.BaseNumberExtractor {
    constructor() {
        super();
        this.extractType = constants_1.Constants.SYS_NUM_ORDINAL;
        let regexes = new Array({
            regExp: recognizers_text_1.RegExpUtility.getSafeRegExp(spanishNumeric_1.SpanishNumeric.OrdinalSuffixRegex),
            value: "OrdinalNum"
        }, {
            regExp: recognizers_text_1.RegExpUtility.getSafeRegExp(spanishNumeric_1.SpanishNumeric.OrdinalNounRegex),
            value: "OrdSpa"
        });
        this.regexes = regexes;
    }
}
exports.SpanishOrdinalExtractor = SpanishOrdinalExtractor;
class SpanishPercentageExtractor extends extractors_1.BasePercentageExtractor {
    constructor() {
        super(new SpanishNumberExtractor());
    }
    initRegexes() {
        let regexStrs = [
            spanishNumeric_1.SpanishNumeric.NumberWithPrefixPercentage
        ];
        return this.buildRegexes(regexStrs);
    }
}
exports.SpanishPercentageExtractor = SpanishPercentageExtractor;
//# sourceMappingURL=extractors.js.map