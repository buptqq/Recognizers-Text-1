"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const culture_1 = require("../../culture");
const spanishNumeric_1 = require("../../resources/spanishNumeric");
const recognizers_text_1 = require("recognizers-text");
class SpanishNumberParserConfiguration {
    constructor(ci) {
        if (!ci) {
            ci = new culture_1.CultureInfo(culture_1.Culture.Spanish);
        }
        this.cultureInfo = ci;
        this.langMarker = spanishNumeric_1.SpanishNumeric.LangMarker;
        this.decimalSeparatorChar = spanishNumeric_1.SpanishNumeric.DecimalSeparatorChar;
        this.fractionMarkerToken = spanishNumeric_1.SpanishNumeric.FractionMarkerToken;
        this.nonDecimalSeparatorChar = spanishNumeric_1.SpanishNumeric.NonDecimalSeparatorChar;
        this.halfADozenText = spanishNumeric_1.SpanishNumeric.HalfADozenText;
        this.wordSeparatorToken = spanishNumeric_1.SpanishNumeric.WordSeparatorToken;
        this.writtenDecimalSeparatorTexts = spanishNumeric_1.SpanishNumeric.WrittenDecimalSeparatorTexts;
        this.writtenGroupSeparatorTexts = spanishNumeric_1.SpanishNumeric.WrittenGroupSeparatorTexts;
        this.writtenIntegerSeparatorTexts = spanishNumeric_1.SpanishNumeric.WrittenIntegerSeparatorTexts;
        this.writtenFractionSeparatorTexts = spanishNumeric_1.SpanishNumeric.WrittenFractionSeparatorTexts;
        let ordinalNumberMap = new Map(spanishNumeric_1.SpanishNumeric.SimpleOrdinalNumberMap);
        spanishNumeric_1.SpanishNumeric.PrefixCardinalDictionary.forEach((prefixValue, prefixKey) => {
            spanishNumeric_1.SpanishNumeric.SufixOrdinalDictionary.forEach((suffixValue, suffixKey) => {
                if (!ordinalNumberMap.has(prefixKey + suffixKey)) {
                    ordinalNumberMap.set(prefixKey + suffixKey, prefixValue * suffixValue);
                }
            });
        });
        this.cardinalNumberMap = spanishNumeric_1.SpanishNumeric.CardinalNumberMap;
        this.ordinalNumberMap = ordinalNumberMap;
        this.roundNumberMap = spanishNumeric_1.SpanishNumeric.RoundNumberMap;
        this.halfADozenRegex = recognizers_text_1.RegExpUtility.getSafeRegExp(spanishNumeric_1.SpanishNumeric.HalfADozenRegex);
        this.digitalNumberRegex = recognizers_text_1.RegExpUtility.getSafeRegExp(spanishNumeric_1.SpanishNumeric.DigitalNumberRegex);
    }
    normalizeTokenSet(tokens, context) {
        let result = new Array();
        tokens.forEach((token) => {
            let tempWord = token.replace(/^s+/, '').replace(/s+$/, '');
            if (this.ordinalNumberMap.has(tempWord)) {
                result.push(tempWord);
                return;
            }
            if (tempWord.endsWith("avo") || tempWord.endsWith("ava")) {
                let origTempWord = tempWord;
                let newLength = origTempWord.length;
                tempWord = origTempWord.substring(0, newLength - 3);
                if (this.cardinalNumberMap.has(tempWord)) {
                    result.push(tempWord);
                    return;
                }
                else {
                    tempWord = origTempWord.substring(0, newLength - 2);
                    if (this.cardinalNumberMap.has(tempWord)) {
                        result.push(tempWord);
                        return;
                    }
                }
            }
            result.push(token);
        });
        return result;
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
exports.SpanishNumberParserConfiguration = SpanishNumberParserConfiguration;
//# sourceMappingURL=parserConfiguration.js.map