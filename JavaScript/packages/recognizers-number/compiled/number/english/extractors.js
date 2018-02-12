"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const extractors_1 = require("../extractors");
const constants_1 = require("../constants");
const models_1 = require("../models");
const englishNumeric_1 = require("../../resources/englishNumeric");
const recognizers_text_1 = require("recognizers-text");
class EnglishNumberExtractor extends extractors_1.BaseNumberExtractor {
    constructor(mode = models_1.NumberMode.Default) {
        super();
        this.extractType = constants_1.Constants.SYS_NUM;
        let regexes = new Array();
        // Add Cardinal
        let cardExtract = null;
        switch (mode) {
            case models_1.NumberMode.PureNumber:
                cardExtract = new EnglishCardinalExtractor(englishNumeric_1.EnglishNumeric.PlaceHolderPureNumber);
                break;
            case models_1.NumberMode.Currency:
                regexes.push({ regExp: recognizers_text_1.RegExpUtility.getSafeRegExp(englishNumeric_1.EnglishNumeric.CurrencyRegex, "gs"), value: "IntegerNum" });
                break;
            case models_1.NumberMode.Default:
                break;
        }
        if (cardExtract === null) {
            cardExtract = new EnglishCardinalExtractor();
        }
        cardExtract.regexes.forEach(r => regexes.push(r));
        // Add Fraction
        let fracExtract = new EnglishFractionExtractor();
        fracExtract.regexes.forEach(r => regexes.push(r));
        this.regexes = regexes;
    }
}
exports.EnglishNumberExtractor = EnglishNumberExtractor;
class EnglishCardinalExtractor extends extractors_1.BaseNumberExtractor {
    constructor(placeholder = englishNumeric_1.EnglishNumeric.PlaceHolderDefault) {
        super();
        this.extractType = constants_1.Constants.SYS_NUM_CARDINAL;
        let regexes = new Array();
        // Add Integer Regexes
        let intExtract = new EnglishIntegerExtractor(placeholder);
        intExtract.regexes.forEach(r => regexes.push(r));
        // Add Double Regexes
        let doubleExtract = new EnglishDoubleExtractor(placeholder);
        doubleExtract.regexes.forEach(r => regexes.push(r));
        this.regexes = regexes;
    }
}
exports.EnglishCardinalExtractor = EnglishCardinalExtractor;
class EnglishIntegerExtractor extends extractors_1.BaseNumberExtractor {
    constructor(placeholder = englishNumeric_1.EnglishNumeric.PlaceHolderDefault) {
        super();
        this.extractType = constants_1.Constants.SYS_NUM_INTEGER;
        let regexes = new Array({
            regExp: recognizers_text_1.RegExpUtility.getSafeRegExp(englishNumeric_1.EnglishNumeric.NumbersWithPlaceHolder(placeholder), "gi"),
            value: "IntegerNum"
        }, {
            regExp: recognizers_text_1.RegExpUtility.getSafeRegExp(englishNumeric_1.EnglishNumeric.NumbersWithSuffix, "gs"),
            value: "IntegerNum"
        }, {
            regExp: this.generateLongFormatNumberRegexes(models_1.LongFormatType.integerNumComma, placeholder),
            value: "IntegerNum"
        }, {
            regExp: recognizers_text_1.RegExpUtility.getSafeRegExp(englishNumeric_1.EnglishNumeric.RoundNumberIntegerRegexWithLocks, "gis"),
            value: "IntegerNum"
        }, {
            regExp: recognizers_text_1.RegExpUtility.getSafeRegExp(englishNumeric_1.EnglishNumeric.NumbersWithDozenSuffix, "gis"),
            value: "IntegerNum"
        }, {
            regExp: recognizers_text_1.RegExpUtility.getSafeRegExp(englishNumeric_1.EnglishNumeric.AllIntRegexWithLocks, "gis"),
            value: "IntegerEng"
        }, {
            regExp: recognizers_text_1.RegExpUtility.getSafeRegExp(englishNumeric_1.EnglishNumeric.AllIntRegexWithDozenSuffixLocks, "gis"),
            value: "IntegerEng"
        }, {
            regExp: recognizers_text_1.RegExpUtility.getSafeRegExp(englishNumeric_1.EnglishNumeric.SignSymbolRegexEng, "gis"),
            value: "IntegerEng"
        });
        this.regexes = regexes;
    }
}
exports.EnglishIntegerExtractor = EnglishIntegerExtractor;
class EnglishDoubleExtractor extends extractors_1.BaseNumberExtractor {
    constructor(placeholder = englishNumeric_1.EnglishNumeric.PlaceHolderDefault) {
        super();
        this.extractType = constants_1.Constants.SYS_NUM_DOUBLE;
        let regexes = new Array({
            regExp: recognizers_text_1.RegExpUtility.getSafeRegExp(englishNumeric_1.EnglishNumeric.DoubleDecimalPointRegex(placeholder), "gis"),
            value: "DoubleNum"
        }, {
            regExp: recognizers_text_1.RegExpUtility.getSafeRegExp(englishNumeric_1.EnglishNumeric.DoubleWithoutIntegralRegex(placeholder), "gis"),
            value: "DoubleNum"
        }, {
            regExp: this.generateLongFormatNumberRegexes(models_1.LongFormatType.doubleNumCommaDot, placeholder),
            value: "DoubleNum"
        }, {
            regExp: recognizers_text_1.RegExpUtility.getSafeRegExp(englishNumeric_1.EnglishNumeric.DoubleWithMultiplierRegex, "gs"),
            value: "DoubleNum"
        }, {
            regExp: recognizers_text_1.RegExpUtility.getSafeRegExp(englishNumeric_1.EnglishNumeric.DoubleWithRoundNumber, "gis"),
            value: "DoubleNum"
        }, {
            regExp: recognizers_text_1.RegExpUtility.getSafeRegExp(englishNumeric_1.EnglishNumeric.DoubleAllFloatRegex, "gis"),
            value: "DoubleEng"
        }, {
            regExp: recognizers_text_1.RegExpUtility.getSafeRegExp(englishNumeric_1.EnglishNumeric.DoubleExponentialNotationRegex, "gis"),
            value: "DoublePow"
        }, {
            regExp: recognizers_text_1.RegExpUtility.getSafeRegExp(englishNumeric_1.EnglishNumeric.DoubleCaretExponentialNotationRegex, "gis"),
            value: "DoublePow"
        });
        this.regexes = regexes;
    }
}
exports.EnglishDoubleExtractor = EnglishDoubleExtractor;
class EnglishFractionExtractor extends extractors_1.BaseNumberExtractor {
    constructor() {
        super();
        this.extractType = constants_1.Constants.SYS_NUM_FRACTION;
        let regexes = new Array({
            regExp: recognizers_text_1.RegExpUtility.getSafeRegExp(englishNumeric_1.EnglishNumeric.FractionNotationWithSpacesRegex, "gis"),
            value: "FracNum"
        }, {
            regExp: recognizers_text_1.RegExpUtility.getSafeRegExp(englishNumeric_1.EnglishNumeric.FractionNotationRegex, "gis"),
            value: "FracNum"
        }, {
            regExp: recognizers_text_1.RegExpUtility.getSafeRegExp(englishNumeric_1.EnglishNumeric.FractionNounRegex, "gis"),
            value: "FracEng"
        }, {
            regExp: recognizers_text_1.RegExpUtility.getSafeRegExp(englishNumeric_1.EnglishNumeric.FractionNounWithArticleRegex, "gis"),
            value: "FracEng"
        }, {
            regExp: recognizers_text_1.RegExpUtility.getSafeRegExp(englishNumeric_1.EnglishNumeric.FractionPrepositionRegex, "gis"),
            value: "FracEng"
        });
        this.regexes = regexes;
    }
}
exports.EnglishFractionExtractor = EnglishFractionExtractor;
class EnglishOrdinalExtractor extends extractors_1.BaseNumberExtractor {
    constructor() {
        super();
        this.extractType = constants_1.Constants.SYS_NUM_ORDINAL;
        let regexes = new Array({
            regExp: recognizers_text_1.RegExpUtility.getSafeRegExp(englishNumeric_1.EnglishNumeric.OrdinalSuffixRegex, "gis"),
            value: "OrdinalNum"
        }, {
            regExp: recognizers_text_1.RegExpUtility.getSafeRegExp(englishNumeric_1.EnglishNumeric.OrdinalNumericRegex, "gis"),
            value: "OrdinalNum"
        }, {
            regExp: recognizers_text_1.RegExpUtility.getSafeRegExp(englishNumeric_1.EnglishNumeric.OrdinalEnglishRegex, "gis"),
            value: "OrdEng"
        }, {
            regExp: recognizers_text_1.RegExpUtility.getSafeRegExp(englishNumeric_1.EnglishNumeric.OrdinalRoundNumberRegex, "gis"),
            value: "OrdEng"
        });
        this.regexes = regexes;
    }
}
exports.EnglishOrdinalExtractor = EnglishOrdinalExtractor;
class EnglishPercentageExtractor extends extractors_1.BasePercentageExtractor {
    constructor() {
        super(new EnglishNumberExtractor());
    }
    initRegexes() {
        let regexStrs = [
            englishNumeric_1.EnglishNumeric.NumberWithSuffixPercentage,
            englishNumeric_1.EnglishNumeric.NumberWithPrefixPercentage
        ];
        return this.buildRegexes(regexStrs);
    }
}
exports.EnglishPercentageExtractor = EnglishPercentageExtractor;
//# sourceMappingURL=extractors.js.map