"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const culture_1 = require("../../culture");
const englishNumeric_1 = require("../../resources/englishNumeric");
const recognizers_text_1 = require("recognizers-text");
class EnglishNumberParserConfiguration {
    constructor(ci) {
        if (!ci) {
            ci = new culture_1.CultureInfo(culture_1.Culture.English);
        }
        this.cultureInfo = ci;
        this.langMarker = englishNumeric_1.EnglishNumeric.LangMarker;
        this.decimalSeparatorChar = englishNumeric_1.EnglishNumeric.DecimalSeparatorChar;
        this.fractionMarkerToken = englishNumeric_1.EnglishNumeric.FractionMarkerToken;
        this.nonDecimalSeparatorChar = englishNumeric_1.EnglishNumeric.NonDecimalSeparatorChar;
        this.halfADozenText = englishNumeric_1.EnglishNumeric.HalfADozenText;
        this.wordSeparatorToken = englishNumeric_1.EnglishNumeric.WordSeparatorToken;
        this.writtenDecimalSeparatorTexts = englishNumeric_1.EnglishNumeric.WrittenDecimalSeparatorTexts;
        this.writtenGroupSeparatorTexts = englishNumeric_1.EnglishNumeric.WrittenGroupSeparatorTexts;
        this.writtenIntegerSeparatorTexts = englishNumeric_1.EnglishNumeric.WrittenIntegerSeparatorTexts;
        this.writtenFractionSeparatorTexts = englishNumeric_1.EnglishNumeric.WrittenFractionSeparatorTexts;
        this.signMap = englishNumeric_1.EnglishNumeric.SignMap;
        this.cardinalNumberMap = englishNumeric_1.EnglishNumeric.CardinalNumberMap;
        this.ordinalNumberMap = englishNumeric_1.EnglishNumeric.OrdinalNumberMap;
        this.roundNumberMap = englishNumeric_1.EnglishNumeric.RoundNumberMap;
        this.halfADozenRegex = recognizers_text_1.RegExpUtility.getSafeRegExp(englishNumeric_1.EnglishNumeric.HalfADozenRegex, "gis");
        this.digitalNumberRegex = recognizers_text_1.RegExpUtility.getSafeRegExp(englishNumeric_1.EnglishNumeric.DigitalNumberRegex, "gis");
    }
    normalizeTokenSet(tokens, context) {
        let fracWords = new Array();
        let tokenList = Array.from(tokens);
        let tokenLen = tokenList.length;
        for (let i = 0; i < tokenLen; i++) {
            if ((i < tokenLen - 2) && tokenList[i + 1] === "-") {
                fracWords.push(tokenList[i] + tokenList[i + 1] + tokenList[i + 2]);
                i += 2;
            }
            else {
                fracWords.push(tokenList[i]);
            }
        }
        return fracWords;
    }
    resolveCompositeNumber(numberStr) {
        if (numberStr.includes("-")) {
            let numbers = numberStr.split('-');
            let ret = 0;
            numbers.forEach(num => {
                if (this.ordinalNumberMap.has(num)) {
                    ret += this.ordinalNumberMap.get(num);
                }
                else if (this.cardinalNumberMap.has(num)) {
                    ret += this.cardinalNumberMap.get(num);
                }
            });
            return ret;
        }
        if (this.ordinalNumberMap.has(numberStr)) {
            return this.ordinalNumberMap.get(numberStr);
        }
        if (this.cardinalNumberMap.has(numberStr)) {
            return this.cardinalNumberMap.get(numberStr);
        }
        return 0;
    }
}
exports.EnglishNumberParserConfiguration = EnglishNumberParserConfiguration;
//# sourceMappingURL=parserConfiguration.js.map