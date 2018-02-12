"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const culture_1 = require("../../culture");
const chineseNumeric_1 = require("../../resources/chineseNumeric");
const recognizers_text_1 = require("recognizers-text");
class ChineseNumberParserConfiguration {
    constructor(ci) {
        if (!ci) {
            ci = new culture_1.CultureInfo(culture_1.Culture.Chinese);
        }
        this.cultureInfo = ci;
        this.langMarker = chineseNumeric_1.ChineseNumeric.LangMarker;
        this.decimalSeparatorChar = chineseNumeric_1.ChineseNumeric.DecimalSeparatorChar;
        this.fractionMarkerToken = chineseNumeric_1.ChineseNumeric.FractionMarkerToken;
        this.nonDecimalSeparatorChar = chineseNumeric_1.ChineseNumeric.NonDecimalSeparatorChar;
        this.halfADozenText = chineseNumeric_1.ChineseNumeric.HalfADozenText;
        this.wordSeparatorToken = chineseNumeric_1.ChineseNumeric.WordSeparatorToken;
        this.writtenDecimalSeparatorTexts = [];
        this.writtenGroupSeparatorTexts = [];
        this.writtenIntegerSeparatorTexts = [];
        this.writtenFractionSeparatorTexts = [];
        this.cardinalNumberMap = new Map();
        this.ordinalNumberMap = new Map();
        this.roundNumberMap = chineseNumeric_1.ChineseNumeric.RoundNumberMap;
        this.halfADozenRegex = null;
        this.digitalNumberRegex = recognizers_text_1.RegExpUtility.getSafeRegExp(chineseNumeric_1.ChineseNumeric.DigitalNumberRegex, "gis");
        this.zeroToNineMapChs = chineseNumeric_1.ChineseNumeric.ZeroToNineMapChs;
        this.roundNumberMapChs = chineseNumeric_1.ChineseNumeric.RoundNumberMapChs;
        this.fullToHalfMapChs = chineseNumeric_1.ChineseNumeric.FullToHalfMapChs;
        this.tratoSimMapChs = chineseNumeric_1.ChineseNumeric.TratoSimMapChs;
        this.unitMapChs = chineseNumeric_1.ChineseNumeric.UnitMapChs;
        this.roundDirectListChs = chineseNumeric_1.ChineseNumeric.RoundDirectListChs;
        this.digitNumRegex = recognizers_text_1.RegExpUtility.getSafeRegExp(chineseNumeric_1.ChineseNumeric.DigitNumRegex, "gis");
        this.dozenRegex = recognizers_text_1.RegExpUtility.getSafeRegExp(chineseNumeric_1.ChineseNumeric.DozenRegex, "gis");
        this.percentageRegex = recognizers_text_1.RegExpUtility.getSafeRegExp(chineseNumeric_1.ChineseNumeric.PercentageRegex, "gis");
        this.doubleAndRoundChsRegex = recognizers_text_1.RegExpUtility.getSafeRegExp(chineseNumeric_1.ChineseNumeric.DoubleAndRoundChsRegex, "gis");
        this.fracSplitRegex = recognizers_text_1.RegExpUtility.getSafeRegExp(chineseNumeric_1.ChineseNumeric.FracSplitRegex, "gis");
        this.symbolRegex = recognizers_text_1.RegExpUtility.getSafeRegExp(chineseNumeric_1.ChineseNumeric.SymbolRegex, "gis");
        this.pointRegexChs = recognizers_text_1.RegExpUtility.getSafeRegExp(chineseNumeric_1.ChineseNumeric.PointRegexChs, "gis");
        this.speGetNumberRegex = recognizers_text_1.RegExpUtility.getSafeRegExp(chineseNumeric_1.ChineseNumeric.SpeGetNumberRegex, "gis");
        this.pairRegex = recognizers_text_1.RegExpUtility.getSafeRegExp(chineseNumeric_1.ChineseNumeric.PairRegex, "gis");
    }
    normalizeTokenSet(tokens, context) {
        return tokens;
    }
    resolveCompositeNumber(numberStr) {
        return 0;
    }
}
exports.ChineseNumberParserConfiguration = ChineseNumberParserConfiguration;
//# sourceMappingURL=parserConfiguration.js.map