"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const culture_1 = require("../../culture");
const portugueseNumeric_1 = require("../../resources/portugueseNumeric");
const recognizers_text_1 = require("recognizers-text");
class PortugueseNumberParserConfiguration {
    constructor(ci) {
        if (!ci) {
            ci = new culture_1.CultureInfo(culture_1.Culture.Portuguese);
        }
        this.cultureInfo = ci;
        this.langMarker = portugueseNumeric_1.PortugueseNumeric.LangMarker;
        this.decimalSeparatorChar = portugueseNumeric_1.PortugueseNumeric.DecimalSeparatorChar;
        this.fractionMarkerToken = portugueseNumeric_1.PortugueseNumeric.FractionMarkerToken;
        this.nonDecimalSeparatorChar = portugueseNumeric_1.PortugueseNumeric.NonDecimalSeparatorChar;
        this.halfADozenText = portugueseNumeric_1.PortugueseNumeric.HalfADozenText;
        this.wordSeparatorToken = portugueseNumeric_1.PortugueseNumeric.WordSeparatorToken;
        this.writtenDecimalSeparatorTexts = portugueseNumeric_1.PortugueseNumeric.WrittenDecimalSeparatorTexts;
        this.writtenGroupSeparatorTexts = portugueseNumeric_1.PortugueseNumeric.WrittenGroupSeparatorTexts;
        this.writtenIntegerSeparatorTexts = portugueseNumeric_1.PortugueseNumeric.WrittenIntegerSeparatorTexts;
        this.writtenFractionSeparatorTexts = portugueseNumeric_1.PortugueseNumeric.WrittenFractionSeparatorTexts;
        let ordinalNumberMap = new Map(portugueseNumeric_1.PortugueseNumeric.OrdinalNumberMap);
        portugueseNumeric_1.PortugueseNumeric.PrefixCardinalMap.forEach((prefixValue, prefixKey) => {
            portugueseNumeric_1.PortugueseNumeric.SuffixOrdinalMap.forEach((suffixValue, suffixKey) => {
                if (!ordinalNumberMap.has(prefixKey + suffixKey)) {
                    ordinalNumberMap.set(prefixKey + suffixKey, prefixValue * suffixValue);
                }
            });
        });
        this.cardinalNumberMap = portugueseNumeric_1.PortugueseNumeric.CardinalNumberMap;
        this.ordinalNumberMap = ordinalNumberMap;
        this.roundNumberMap = portugueseNumeric_1.PortugueseNumeric.RoundNumberMap;
        this.halfADozenRegex = recognizers_text_1.RegExpUtility.getSafeRegExp(portugueseNumeric_1.PortugueseNumeric.HalfADozenRegex);
        this.digitalNumberRegex = recognizers_text_1.RegExpUtility.getSafeRegExp(portugueseNumeric_1.PortugueseNumeric.DigitalNumberRegex);
    }
    normalizeTokenSet(tokens, context) {
        let result = new Array();
        tokens.forEach((token) => {
            let tempWord = token.replace(/^s+/, '').replace(/s+$/, '');
            if (this.ordinalNumberMap.has(tempWord)) {
                result.push(tempWord);
                return;
            }
            // ends with 'avo' or 'ava'
            if (portugueseNumeric_1.PortugueseNumeric.WrittenFractionSuffix.some(suffix => tempWord.endsWith(suffix))) {
                let origTempWord = tempWord;
                let newLength = origTempWord.length;
                tempWord = origTempWord.substring(0, newLength - 3);
                if (!tempWord) {
                    return;
                }
                else if (this.cardinalNumberMap.has(tempWord)) {
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
exports.PortugueseNumberParserConfiguration = PortugueseNumberParserConfiguration;
//# sourceMappingURL=parserConfiguration.js.map