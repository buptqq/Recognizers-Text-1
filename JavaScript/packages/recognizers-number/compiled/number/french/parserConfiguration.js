"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const culture_1 = require("../../culture");
const frenchNumeric_1 = require("../../resources/frenchNumeric");
const recognizers_text_1 = require("recognizers-text");
class FrenchNumberParserConfiguration {
    constructor(ci) {
        if (!ci) {
            ci = new culture_1.CultureInfo(culture_1.Culture.French);
        }
        this.cultureInfo = ci;
        this.langMarker = frenchNumeric_1.FrenchNumeric.LangMarker;
        this.decimalSeparatorChar = frenchNumeric_1.FrenchNumeric.DecimalSeparatorChar;
        this.fractionMarkerToken = frenchNumeric_1.FrenchNumeric.FractionMarkerToken;
        this.nonDecimalSeparatorChar = frenchNumeric_1.FrenchNumeric.NonDecimalSeparatorChar;
        this.halfADozenText = frenchNumeric_1.FrenchNumeric.HalfADozenText;
        this.wordSeparatorToken = frenchNumeric_1.FrenchNumeric.WordSeparatorToken;
        this.writtenDecimalSeparatorTexts = frenchNumeric_1.FrenchNumeric.WrittenDecimalSeparatorTexts;
        this.writtenGroupSeparatorTexts = frenchNumeric_1.FrenchNumeric.WrittenGroupSeparatorTexts;
        this.writtenIntegerSeparatorTexts = frenchNumeric_1.FrenchNumeric.WrittenIntegerSeparatorTexts;
        this.writtenFractionSeparatorTexts = frenchNumeric_1.FrenchNumeric.WrittenFractionSeparatorTexts;
        this.cardinalNumberMap = frenchNumeric_1.FrenchNumeric.CardinalNumberMap;
        this.ordinalNumberMap = frenchNumeric_1.FrenchNumeric.OrdinalNumberMap;
        this.roundNumberMap = frenchNumeric_1.FrenchNumeric.RoundNumberMap;
        this.halfADozenRegex = recognizers_text_1.RegExpUtility.getSafeRegExp(frenchNumeric_1.FrenchNumeric.HalfADozenRegex);
        this.digitalNumberRegex = recognizers_text_1.RegExpUtility.getSafeRegExp(frenchNumeric_1.FrenchNumeric.DigitalNumberRegex);
    }
    normalizeTokenSet(tokens, context) {
        return tokens;
    }
    resolveCompositeNumber(numberStr) {
        if (this.ordinalNumberMap.has(numberStr)) {
            return this.ordinalNumberMap.get(numberStr);
        }
        if (this.cardinalNumberMap.has(numberStr)) {
            return this.cardinalNumberMap.get(numberStr);
        }
        let value = 0;
        let finalValue = 0;
        let strBuilder = "";
        let lastGoodChar = 0;
        for (let i = 0; i < numberStr.length; i++) {
            strBuilder = strBuilder.concat(numberStr[i]);
            if (this.cardinalNumberMap.has(strBuilder) && this.cardinalNumberMap.get(strBuilder) > value) {
                lastGoodChar = i;
                value = this.cardinalNumberMap.get(strBuilder);
            }
            if ((i + 1) === numberStr.length) {
                finalValue += value;
                strBuilder = "";
                i = lastGoodChar++;
                value = 0;
            }
        }
        return finalValue;
    }
}
exports.FrenchNumberParserConfiguration = FrenchNumberParserConfiguration;
//# sourceMappingURL=parserConfiguration.js.map