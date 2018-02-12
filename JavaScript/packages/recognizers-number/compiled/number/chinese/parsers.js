"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const recognizers_text_1 = require("recognizers-text");
const parsers_1 = require("../parsers");
const recognizers_text_2 = require("recognizers-text");
class ChineseNumberParser extends parsers_1.BaseNumberParser {
    constructor(config) {
        super(config);
        this.config = config;
    }
    toString(value) {
        return this.config.cultureInfo
            ? this.config.cultureInfo.format(value)
            : value.toString();
    }
    parse(extResult) {
        let extra = '';
        let result;
        extra = extResult.data;
        let simplifiedExtResult = {
            start: extResult.start,
            length: extResult.length,
            data: extResult.data,
            text: this.replaceTraditionalWithSimplified(extResult.text),
            type: extResult.type
        };
        if (!extra) {
            return result;
        }
        if (extra.includes("Per")) {
            result = this.perParseChs(simplifiedExtResult);
        }
        else if (extra.includes("Num")) {
            simplifiedExtResult.text = this.replaceFullWithHalf(simplifiedExtResult.text);
            result = this.digitNumberParse(simplifiedExtResult);
            result.resolutionStr = this.toString(result.value);
        }
        else if (extra.includes("Pow")) {
            simplifiedExtResult.text = this.replaceFullWithHalf(simplifiedExtResult.text);
            result = this.powerNumberParse(simplifiedExtResult);
            result.resolutionStr = this.toString(result.value);
        }
        else if (extra.includes("Frac")) {
            result = this.fracParseChs(simplifiedExtResult);
        }
        else if (extra.includes("Dou")) {
            result = this.douParseChs(simplifiedExtResult);
        }
        else if (extra.includes("Integer")) {
            result = this.intParseChs(simplifiedExtResult);
        }
        else if (extra.includes("Ordinal")) {
            result = this.ordParseChs(simplifiedExtResult);
        }
        if (result) {
            result.text = extResult.text;
        }
        return result;
    }
    replaceTraditionalWithSimplified(value) {
        if (recognizers_text_2.StringUtility.isNullOrWhitespace(value)) {
            return value;
        }
        let result = '';
        for (let index = 0; index < value.length; index++) {
            result = result.concat(this.config.tratoSimMapChs.get(value.charAt(index)) || value.charAt(index));
        }
        return result;
    }
    replaceFullWithHalf(value) {
        if (recognizers_text_2.StringUtility.isNullOrWhitespace(value)) {
            return value;
        }
        let result = '';
        for (let index = 0; index < value.length; index++) {
            result = result.concat(this.config.fullToHalfMapChs.get(value.charAt(index)) || value.charAt(index));
        }
        return result;
    }
    replaceUnit(value) {
        if (recognizers_text_2.StringUtility.isNullOrEmpty(value))
            return value;
        let result = value;
        this.config.unitMapChs.forEach((value, key) => {
            result = result.replace(new RegExp(key, 'g'), value);
        });
        return result;
    }
    perParseChs(extResult) {
        let result = new recognizers_text_1.ParseResult(extResult);
        let resultText = extResult.text;
        let power = 1;
        if (extResult.data.includes("Spe")) {
            resultText = this.replaceFullWithHalf(resultText);
            resultText = this.replaceUnit(resultText);
            if (resultText === "半折") {
                result.value = 50;
            }
            else if (resultText === "10成") {
                result.value = 100;
            }
            else {
                let matches = recognizers_text_2.RegExpUtility.getMatches(this.config.speGetNumberRegex, resultText);
                let intNumber;
                if (matches.length === 2) {
                    let intNumberChar = matches[0].value.charAt(0);
                    if (intNumberChar === "对") {
                        intNumber = 5;
                    }
                    else if (intNumberChar === "十" || intNumberChar === "拾") {
                        intNumber = 10;
                    }
                    else {
                        intNumber = this.config.zeroToNineMapChs.get(intNumberChar);
                    }
                    let pointNumberChar = matches[1].value.charAt(0);
                    let pointNumber;
                    if (pointNumberChar === "半") {
                        pointNumber = 0.5;
                    }
                    else {
                        pointNumber = this.config.zeroToNineMapChs.get(pointNumberChar) * 0.1;
                    }
                    result.value = (intNumber + pointNumber) * 10;
                }
                else {
                    let intNumberChar = matches[0].value.charAt(0);
                    if (intNumberChar === "对") {
                        intNumber = 5;
                    }
                    else if (intNumberChar === "十" || intNumberChar === "拾") {
                        intNumber = 10;
                    }
                    else {
                        intNumber = this.config.zeroToNineMapChs.get(intNumberChar);
                    }
                    result.value = intNumber * 10;
                }
            }
        }
        else if (extResult.data.includes("Num")) {
            let doubleMatch = recognizers_text_2.RegExpUtility.getMatches(this.config.percentageRegex, resultText).pop();
            let doubleText = doubleMatch.value;
            if (doubleText.includes("k") || doubleText.includes("K") || doubleText.includes("ｋ") || doubleText.includes("Ｋ")) {
                power = 1000;
            }
            if (doubleText.includes("M") || doubleText.includes("Ｍ")) {
                power = 1000000;
            }
            if (doubleText.includes("G") || doubleText.includes("Ｇ")) {
                power = 1000000000;
            }
            if (doubleText.includes("T") || doubleText.includes("Ｔ")) {
                power = 1000000000000;
            }
            result.value = this.getDigitValueChs(resultText, power);
        }
        else {
            let doubleMatch = recognizers_text_2.RegExpUtility.getMatches(this.config.percentageRegex, resultText).pop();
            let doubleText = this.replaceUnit(doubleMatch.value);
            let splitResult = recognizers_text_2.RegExpUtility.split(this.config.pointRegexChs, doubleText);
            if (splitResult[0] === "") {
                splitResult[0] = "零";
            }
            let doubleValue = this.getIntValueChs(splitResult[0]);
            if (splitResult.length === 2) {
                if (recognizers_text_2.RegExpUtility.isMatch(this.config.symbolRegex, splitResult[0])) {
                    doubleValue -= this.getPointValueChs(splitResult[1]);
                }
                else {
                    doubleValue += this.getPointValueChs(splitResult[1]);
                }
            }
            result.value = doubleValue;
        }
        result.resolutionStr = this.toString(result.value) + "%";
        return result;
    }
    fracParseChs(extResult) {
        let result = new recognizers_text_1.ParseResult(extResult);
        let resultText = extResult.text;
        let splitResult = recognizers_text_2.RegExpUtility.split(this.config.fracSplitRegex, resultText);
        let intPart = "";
        let demoPart = "";
        let numPart = "";
        if (splitResult.length === 3) {
            intPart = splitResult[0] || "";
            demoPart = splitResult[1] || "";
            numPart = splitResult[2] || "";
        }
        else {
            intPart = "零";
            demoPart = splitResult[0] || "";
            numPart = splitResult[1] || "";
        }
        let intValue = this.isDigitChs(intPart)
            ? this.getDigitValueChs(intPart, 1.0)
            : this.getIntValueChs(intPart);
        let numValue = this.isDigitChs(numPart)
            ? this.getDigitValueChs(numPart, 1.0)
            : this.getIntValueChs(numPart);
        let demoValue = this.isDigitChs(demoPart)
            ? this.getDigitValueChs(demoPart, 1.0)
            : this.getIntValueChs(demoPart);
        if (recognizers_text_2.RegExpUtility.isMatch(this.config.symbolRegex, intPart)) {
            result.value = intValue - numValue / demoValue;
        }
        else {
            result.value = intValue + numValue / demoValue;
        }
        result.resolutionStr = this.toString(result.value);
        return result;
    }
    douParseChs(extResult) {
        let result = new recognizers_text_1.ParseResult(extResult);
        let resultText = extResult.text;
        if (recognizers_text_2.RegExpUtility.isMatch(this.config.doubleAndRoundChsRegex, resultText)) {
            resultText = this.replaceUnit(resultText);
            let power = this.config.roundNumberMapChs.get(resultText.charAt(resultText.length - 1));
            result.value = this.getDigitValueChs(resultText.substr(0, resultText.length - 1), power);
        }
        else {
            resultText = this.replaceUnit(resultText);
            let splitResult = recognizers_text_2.RegExpUtility.split(this.config.pointRegexChs, resultText);
            if (splitResult[0] === "") {
                splitResult[0] = "零";
            }
            if (recognizers_text_2.RegExpUtility.isMatch(this.config.symbolRegex, splitResult[0])) {
                result.value = this.getIntValueChs(splitResult[0]) - this.getPointValueChs(splitResult[1]);
            }
            else {
                result.value = this.getIntValueChs(splitResult[0]) + this.getPointValueChs(splitResult[1]);
            }
        }
        result.resolutionStr = this.toString(result.value);
        return result;
    }
    intParseChs(extResult) {
        let result = new recognizers_text_1.ParseResult(extResult);
        result.value = this.getIntValueChs(extResult.text);
        result.resolutionStr = this.toString(result.value);
        return result;
    }
    ordParseChs(extResult) {
        let result = new recognizers_text_1.ParseResult(extResult);
        let resultText = extResult.text.substr(1);
        if (recognizers_text_2.RegExpUtility.isMatch(this.config.digitNumRegex, resultText)) {
            result.value = this.getDigitValueChs(resultText, 1);
        }
        else {
            result.value = this.getIntValueChs(resultText);
        }
        result.resolutionStr = this.toString(result.value);
        return result;
    }
    getDigitValueChs(value, power) {
        let isLessZero = false;
        let resultStr = value;
        if (recognizers_text_2.RegExpUtility.isMatch(this.config.symbolRegex, resultStr)) {
            isLessZero = true;
            resultStr = resultStr.substr(1);
        }
        resultStr = this.replaceFullWithHalf(resultStr);
        let result = this.getDigitalValue(resultStr, power);
        if (isLessZero) {
            result = -result;
        }
        return result;
    }
    getIntValueChs(value) {
        let resultStr = value;
        let isDozen = false;
        let isPair = false;
        if (recognizers_text_2.RegExpUtility.isMatch(this.config.dozenRegex, resultStr)) {
            isDozen = true;
            resultStr = resultStr.substr(0, resultStr.length - 1);
        }
        else if (recognizers_text_2.RegExpUtility.isMatch(this.config.pairRegex, resultStr)) {
            isPair = true;
            resultStr = resultStr.substr(0, resultStr.length - 1);
        }
        resultStr = this.replaceUnit(resultStr);
        let intValue = 0;
        let partValue = 0;
        let beforeValue = 1;
        let isRoundBefore = false;
        let roundBefore = -1;
        let roundDefault = 1;
        let isLessZero = false;
        if (recognizers_text_2.RegExpUtility.isMatch(this.config.symbolRegex, resultStr)) {
            isLessZero = true;
            resultStr = resultStr.substr(1);
        }
        for (let index = 0; index < resultStr.length; index++) {
            let resultChar = resultStr.charAt(index);
            if (this.config.roundNumberMapChs.has(resultChar)) {
                let roundRecent = this.config.roundNumberMapChs.get(resultChar);
                if (roundBefore !== -1 && roundRecent > roundBefore) {
                    if (isRoundBefore) {
                        intValue += partValue * roundRecent;
                        isRoundBefore = false;
                    }
                    else {
                        partValue += beforeValue * roundDefault;
                        intValue += partValue * roundRecent;
                    }
                    roundBefore = -1;
                    partValue = 0;
                }
                else {
                    isRoundBefore = true;
                    partValue += beforeValue * roundRecent;
                    roundBefore = roundRecent;
                    if ((index === resultStr.length - 1) || this.config.roundDirectListChs.some(o => o === resultChar)) {
                        intValue += partValue;
                        partValue = 0;
                    }
                }
                roundDefault = roundRecent / 10;
            }
            else if (this.config.zeroToNineMapChs.has(resultChar)) {
                if (index !== resultStr.length - 1) {
                    if ((resultChar === "零") && !this.config.roundNumberMapChs.has(resultStr.charAt(index + 1))) {
                        beforeValue = 1;
                        roundDefault = 1;
                    }
                    else {
                        beforeValue = this.config.zeroToNineMapChs.get(resultChar);
                        isRoundBefore = false;
                    }
                }
                else {
                    partValue += this.config.zeroToNineMapChs.get(resultChar) * roundDefault;
                    intValue += partValue;
                    partValue = 0;
                }
            }
        }
        if (isLessZero) {
            intValue = -intValue;
        }
        if (isDozen) {
            intValue = intValue * 12;
        }
        if (isPair) {
            intValue = intValue * 2;
        }
        return intValue;
    }
    getPointValueChs(value) {
        let result = 0;
        let scale = 0.1;
        for (let index = 0; index < value.length; index++) {
            result += scale * this.config.zeroToNineMapChs.get(value.charAt(index));
            scale *= 0.1;
        }
        return result;
    }
    isDigitChs(value) {
        return !recognizers_text_2.StringUtility.isNullOrEmpty(value)
            && recognizers_text_2.RegExpUtility.isMatch(this.config.digitNumRegex, value);
    }
}
exports.ChineseNumberParser = ChineseNumberParser;
//# sourceMappingURL=parsers.js.map