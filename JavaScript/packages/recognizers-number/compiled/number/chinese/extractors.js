"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const extractors_1 = require("../extractors");
const constants_1 = require("../constants");
const chineseNumeric_1 = require("../../resources/chineseNumeric");
const recognizers_text_1 = require("recognizers-text");
var ChineseNumberMode;
(function (ChineseNumberMode) {
    // for number with white list
    ChineseNumberMode[ChineseNumberMode["Default"] = 0] = "Default";
    // for number without white list
    ChineseNumberMode[ChineseNumberMode["ExtractAll"] = 1] = "ExtractAll";
})(ChineseNumberMode = exports.ChineseNumberMode || (exports.ChineseNumberMode = {}));
class ChineseNumberExtractor extends extractors_1.BaseNumberExtractor {
    constructor(mode = ChineseNumberMode.Default) {
        super();
        this.extractType = constants_1.Constants.SYS_NUM;
        let regexes = new Array();
        // Add Cardinal
        let cardExtract = new ChineseCardinalExtractor(mode);
        cardExtract.regexes.forEach(r => regexes.push(r));
        // Add Fraction
        let fracExtract = new ChineseFractionExtractor();
        fracExtract.regexes.forEach(r => regexes.push(r));
        this.regexes = regexes;
    }
}
exports.ChineseNumberExtractor = ChineseNumberExtractor;
class ChineseCardinalExtractor extends extractors_1.BaseNumberExtractor {
    constructor(mode = ChineseNumberMode.Default) {
        super();
        this.extractType = constants_1.Constants.SYS_NUM_CARDINAL;
        let regexes = new Array();
        // Add Integer Regexes
        let intExtract = new ChineseIntegerExtractor(mode);
        intExtract.regexes.forEach(r => regexes.push(r));
        // Add Double Regexes
        let doubleExtract = new ChineseDoubleExtractor();
        doubleExtract.regexes.forEach(r => regexes.push(r));
        this.regexes = regexes;
    }
}
exports.ChineseCardinalExtractor = ChineseCardinalExtractor;
class ChineseIntegerExtractor extends extractors_1.BaseNumberExtractor {
    constructor(mode = ChineseNumberMode.Default) {
        super();
        this.extractType = constants_1.Constants.SYS_NUM_INTEGER;
        let regexes = new Array({
            regExp: recognizers_text_1.RegExpUtility.getSafeRegExp(chineseNumeric_1.ChineseNumeric.NumbersSpecialsChars, "gi"),
            value: "IntegerNum"
        }, {
            regExp: recognizers_text_1.RegExpUtility.getSafeRegExp(chineseNumeric_1.ChineseNumeric.NumbersSpecialsCharsWithSuffix, "gs"),
            value: "IntegerNum"
        }, {
            regExp: recognizers_text_1.RegExpUtility.getSafeRegExp(chineseNumeric_1.ChineseNumeric.DottedNumbersSpecialsChar, "gis"),
            value: "IntegerNum"
        }, {
            regExp: recognizers_text_1.RegExpUtility.getSafeRegExp(chineseNumeric_1.ChineseNumeric.NumbersWithHalfDozen, "gis"),
            value: "IntegerChs"
        }, {
            regExp: recognizers_text_1.RegExpUtility.getSafeRegExp(chineseNumeric_1.ChineseNumeric.NumbersWithDozen, "gis"),
            value: "IntegerChs"
        });
        switch (mode) {
            case ChineseNumberMode.Default:
                regexes.push({
                    regExp: recognizers_text_1.RegExpUtility.getSafeRegExp(chineseNumeric_1.ChineseNumeric.NumbersWithoutPercent, "gi"),
                    value: "IntegerChs"
                });
                break;
            case ChineseNumberMode.ExtractAll:
                regexes.push({
                    regExp: recognizers_text_1.RegExpUtility.getSafeRegExp(chineseNumeric_1.ChineseNumeric.NumbersWithPercent, "gi"),
                    value: "IntegerChs"
                });
                break;
        }
        this.regexes = regexes;
    }
}
exports.ChineseIntegerExtractor = ChineseIntegerExtractor;
class ChineseDoubleExtractor extends extractors_1.BaseNumberExtractor {
    constructor() {
        super();
        this.extractType = constants_1.Constants.SYS_NUM_DOUBLE;
        let regexes = new Array({
            regExp: recognizers_text_1.RegExpUtility.getSafeRegExp(chineseNumeric_1.ChineseNumeric.DoubleSpecialsChars, "gis"),
            value: "DoubleNum"
        }, {
            regExp: recognizers_text_1.RegExpUtility.getSafeRegExp(chineseNumeric_1.ChineseNumeric.DoubleSpecialsCharsWithNegatives, "gis"),
            value: "DoubleNum"
        }, {
            regExp: recognizers_text_1.RegExpUtility.getSafeRegExp(chineseNumeric_1.ChineseNumeric.SimpleDoubleSpecialsChars, "gis"),
            value: "DoubleNum"
        }, {
            regExp: recognizers_text_1.RegExpUtility.getSafeRegExp(chineseNumeric_1.ChineseNumeric.DoubleWithMultiplierRegex, "gi"),
            value: "DoubleNum"
        }, {
            regExp: recognizers_text_1.RegExpUtility.getSafeRegExp(chineseNumeric_1.ChineseNumeric.DoubleWithThousandsRegex, "gi"),
            value: "DoubleChs"
        }, {
            regExp: recognizers_text_1.RegExpUtility.getSafeRegExp(chineseNumeric_1.ChineseNumeric.DoubleAllFloatRegex, "gi"),
            value: "DoubleChs"
        }, {
            regExp: recognizers_text_1.RegExpUtility.getSafeRegExp(chineseNumeric_1.ChineseNumeric.DoubleExponentialNotationRegex, "gis"),
            value: "DoublePow"
        }, {
            regExp: recognizers_text_1.RegExpUtility.getSafeRegExp(chineseNumeric_1.ChineseNumeric.DoubleScientificNotationRegex, "gis"),
            value: "DoublePow"
        });
        this.regexes = regexes;
    }
}
exports.ChineseDoubleExtractor = ChineseDoubleExtractor;
class ChineseFractionExtractor extends extractors_1.BaseNumberExtractor {
    constructor() {
        super();
        this.extractType = constants_1.Constants.SYS_NUM_FRACTION;
        let regexes = new Array({
            regExp: recognizers_text_1.RegExpUtility.getSafeRegExp(chineseNumeric_1.ChineseNumeric.FractionNotationSpecialsCharsRegex, "gis"),
            value: "FracNum"
        }, {
            regExp: recognizers_text_1.RegExpUtility.getSafeRegExp(chineseNumeric_1.ChineseNumeric.FractionNotationRegex, "gis"),
            value: "FracNum"
        }, {
            regExp: recognizers_text_1.RegExpUtility.getSafeRegExp(chineseNumeric_1.ChineseNumeric.AllFractionNumber, "gi"),
            value: "FracChs"
        });
        this.regexes = regexes;
    }
}
exports.ChineseFractionExtractor = ChineseFractionExtractor;
class ChineseOrdinalExtractor extends extractors_1.BaseNumberExtractor {
    constructor() {
        super();
        this.extractType = constants_1.Constants.SYS_NUM_ORDINAL;
        let regexes = new Array({
            regExp: recognizers_text_1.RegExpUtility.getSafeRegExp(chineseNumeric_1.ChineseNumeric.OrdinalRegexChs, "gi"),
            value: "OrdinalChs"
        }, {
            regExp: recognizers_text_1.RegExpUtility.getSafeRegExp(chineseNumeric_1.ChineseNumeric.OrdinalNumbersRegex, "gi"),
            value: "OrdinalChs"
        });
        this.regexes = regexes;
    }
}
exports.ChineseOrdinalExtractor = ChineseOrdinalExtractor;
class ChinesePercentageExtractor extends extractors_1.BaseNumberExtractor {
    constructor() {
        super();
        this.extractType = constants_1.Constants.SYS_NUM_PERCENTAGE;
        let regexes = new Array({
            regExp: recognizers_text_1.RegExpUtility.getSafeRegExp(chineseNumeric_1.ChineseNumeric.PercentagePointRegex, "gi"),
            value: "PerChs"
        }, {
            regExp: recognizers_text_1.RegExpUtility.getSafeRegExp(chineseNumeric_1.ChineseNumeric.SimplePercentageRegex, "gi"),
            value: "PerChs"
        }, {
            regExp: recognizers_text_1.RegExpUtility.getSafeRegExp(chineseNumeric_1.ChineseNumeric.NumbersPercentagePointRegex, "gis"),
            value: "PerNum"
        }, {
            regExp: recognizers_text_1.RegExpUtility.getSafeRegExp(chineseNumeric_1.ChineseNumeric.NumbersPercentageWithSeparatorRegex, "gis"),
            value: "PerNum"
        }, {
            regExp: recognizers_text_1.RegExpUtility.getSafeRegExp(chineseNumeric_1.ChineseNumeric.NumbersPercentageWithMultiplierRegex, "gi"),
            value: "PerNum"
        }, {
            regExp: recognizers_text_1.RegExpUtility.getSafeRegExp(chineseNumeric_1.ChineseNumeric.FractionPercentagePointRegex, "gis"),
            value: "PerNum"
        }, {
            regExp: recognizers_text_1.RegExpUtility.getSafeRegExp(chineseNumeric_1.ChineseNumeric.FractionPercentageWithSeparatorRegex, "gis"),
            value: "PerNum"
        }, {
            regExp: recognizers_text_1.RegExpUtility.getSafeRegExp(chineseNumeric_1.ChineseNumeric.FractionPercentageWithMultiplierRegex, "gi"),
            value: "PerNum"
        }, {
            regExp: recognizers_text_1.RegExpUtility.getSafeRegExp(chineseNumeric_1.ChineseNumeric.SimpleNumbersPercentageRegex, "gis"),
            value: "PerNum"
        }, {
            regExp: recognizers_text_1.RegExpUtility.getSafeRegExp(chineseNumeric_1.ChineseNumeric.SimpleNumbersPercentageWithMultiplierRegex, "gi"),
            value: "PerNum"
        }, {
            regExp: recognizers_text_1.RegExpUtility.getSafeRegExp(chineseNumeric_1.ChineseNumeric.SimpleNumbersPercentagePointRegex, "gis"),
            value: "PerNum"
        }, {
            regExp: recognizers_text_1.RegExpUtility.getSafeRegExp(chineseNumeric_1.ChineseNumeric.IntegerPercentageRegex, "gis"),
            value: "PerNum"
        }, {
            regExp: recognizers_text_1.RegExpUtility.getSafeRegExp(chineseNumeric_1.ChineseNumeric.IntegerPercentageWithMultiplierRegex, "gi"),
            value: "PerNum"
        }, {
            regExp: recognizers_text_1.RegExpUtility.getSafeRegExp(chineseNumeric_1.ChineseNumeric.NumbersFractionPercentageRegex, "gis"),
            value: "PerNum"
        }, {
            regExp: recognizers_text_1.RegExpUtility.getSafeRegExp(chineseNumeric_1.ChineseNumeric.SimpleIntegerPercentageRegex, "gis"),
            value: "PerNum"
        }, {
            regExp: recognizers_text_1.RegExpUtility.getSafeRegExp(chineseNumeric_1.ChineseNumeric.NumbersFoldsPercentageRegex, "gis"),
            value: "PerSpe"
        }, {
            regExp: recognizers_text_1.RegExpUtility.getSafeRegExp(chineseNumeric_1.ChineseNumeric.FoldsPercentageRegex, "gis"),
            value: "PerSpe"
        }, {
            regExp: recognizers_text_1.RegExpUtility.getSafeRegExp(chineseNumeric_1.ChineseNumeric.SimpleFoldsPercentageRegex, "gis"),
            value: "PerSpe"
        }, {
            regExp: recognizers_text_1.RegExpUtility.getSafeRegExp(chineseNumeric_1.ChineseNumeric.SpecialsPercentageRegex, "gis"),
            value: "PerSpe"
        }, {
            regExp: recognizers_text_1.RegExpUtility.getSafeRegExp(chineseNumeric_1.ChineseNumeric.NumbersSpecialsPercentageRegex, "gis"),
            value: "PerSpe"
        }, {
            regExp: recognizers_text_1.RegExpUtility.getSafeRegExp(chineseNumeric_1.ChineseNumeric.SimpleSpecialsPercentageRegex, "gis"),
            value: "PerSpe"
        }, {
            regExp: recognizers_text_1.RegExpUtility.getSafeRegExp(chineseNumeric_1.ChineseNumeric.SpecialsFoldsPercentageRegex, "gis"),
            value: "PerSpe"
        });
        this.regexes = regexes;
    }
}
exports.ChinesePercentageExtractor = ChinesePercentageExtractor;
//# sourceMappingURL=extractors.js.map