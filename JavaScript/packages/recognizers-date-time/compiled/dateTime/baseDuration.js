"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const recognizers_text_1 = require("recognizers-text");
const constants_1 = require("./constants");
const parsers_1 = require("./parsers");
const utilities_1 = require("./utilities");
class BaseDurationExtractor {
    constructor(config) {
        this.extractorName = constants_1.Constants.SYS_DATETIME_DURATION;
        this.config = config;
    }
    extract(source, refDate) {
        if (!refDate)
            refDate = new Date();
        let referenceDate = refDate;
        let baseTokens = this.numberWithUnit(source);
        let tokens = new Array()
            .concat(baseTokens)
            .concat(this.numberWithUnitAndSuffix(source, baseTokens))
            .concat(this.implicitDuration(source));
        let result = utilities_1.Token.mergeAllTokens(tokens, source, this.extractorName);
        return result;
    }
    numberWithUnit(source) {
        return this.config.cardinalExtractor.extract(source)
            .map(o => {
            let afterString = source.substring(o.start + o.length);
            let match = recognizers_text_1.RegExpUtility.getMatches(this.config.followedUnit, afterString)[0];
            if (match && match.index === 0) {
                return new utilities_1.Token(o.start | 0, o.start + o.length + match.length);
            }
        }).filter(o => o !== undefined)
            .concat(this.getTokensFromRegex(this.config.numberCombinedWithUnit, source))
            .concat(this.getTokensFromRegex(this.config.anUnitRegex, source))
            .concat(this.getTokensFromRegex(this.config.inExactNumberUnitRegex, source));
    }
    numberWithUnitAndSuffix(source, ers) {
        return ers.map(o => {
            let afterString = source.substring(o.start + o.length);
            let match = recognizers_text_1.RegExpUtility.getMatches(this.config.suffixAndRegex, afterString)[0];
            if (match && match.index === 0) {
                return new utilities_1.Token(o.start | 0, o.start + o.length + match.length);
            }
        });
    }
    implicitDuration(source) {
        // handle "all day", "all year"
        return this.getTokensFromRegex(this.config.allRegex, source)
            .concat(this.getTokensFromRegex(this.config.halfRegex, source))
            .concat(this.getTokensFromRegex(this.config.relativeDurationUnitRegex, source));
    }
    getTokensFromRegex(regexp, source) {
        return recognizers_text_1.RegExpUtility.getMatches(regexp, source)
            .map(o => new utilities_1.Token(o.index, o.index + o.length));
    }
}
exports.BaseDurationExtractor = BaseDurationExtractor;
class BaseDurationParser {
    constructor(config) {
        this.parserName = constants_1.Constants.SYS_DATETIME_DURATION;
        this.config = config;
    }
    parse(extractorResult, referenceDate) {
        if (!referenceDate)
            referenceDate = new Date();
        let resultValue;
        if (extractorResult.type === this.parserName) {
            let source = extractorResult.text.toLowerCase();
            let innerResult = this.parseNumberWithUnit(source, referenceDate);
            if (!innerResult.success) {
                innerResult = this.parseImplicitDuration(source, referenceDate);
            }
            if (innerResult.success) {
                innerResult.futureResolution = {};
                innerResult.futureResolution[constants_1.TimeTypeConstants.DURATION] = innerResult.futureValue.toString();
                innerResult.pastResolution = {};
                innerResult.pastResolution[constants_1.TimeTypeConstants.DURATION] = innerResult.pastValue.toString();
                resultValue = innerResult;
            }
        }
        let result = new parsers_1.DateTimeParseResult(extractorResult);
        result.value = resultValue;
        result.timexStr = resultValue ? resultValue.timex : '';
        result.resolutionStr = '';
        return result;
    }
    parseNumberWithUnit(source, referenceDate) {
        let trimmedSource = source.trim();
        let result = this.parseNumberSpaceUnit(trimmedSource);
        if (!result.success) {
            result = this.parseNumberCombinedUnit(trimmedSource);
        }
        if (!result.success) {
            result = this.parseAnUnit(trimmedSource);
        }
        if (!result.success) {
            result = this.parseInExactNumberUnit(trimmedSource);
        }
        return result;
    }
    parseImplicitDuration(source, referenceDate) {
        let trimmedSource = source.trim();
        // handle "all day" "all year"
        let result = this.getResultFromRegex(this.config.allDateUnitRegex, trimmedSource, 1);
        // handle "half day", "half year"
        if (!result.success) {
            result = this.getResultFromRegex(this.config.halfDateUnitRegex, trimmedSource, 0.5);
        }
        // handle single duration unit, it is filtered in the extraction that there is a relative word in advance
        if (!result.success) {
            result = this.getResultFromRegex(this.config.followedUnit, trimmedSource, 1);
        }
        return result;
    }
    getResultFromRegex(regex, source, num) {
        let result = new utilities_1.DateTimeResolutionResult();
        let match = recognizers_text_1.RegExpUtility.getMatches(regex, source).pop();
        if (!match)
            return result;
        let sourceUnit = match.groups('unit').value;
        if (!this.config.unitMap.has(sourceUnit))
            return result;
        let unitStr = this.config.unitMap.get(sourceUnit);
        result.timex = `P${this.isLessThanDay(unitStr) ? 'T' : ''}${num}${unitStr[0]}`;
        result.futureValue = num * this.config.unitValueMap.get(sourceUnit);
        result.pastValue = result.futureValue;
        result.success = true;
        return result;
    }
    parseNumberSpaceUnit(source) {
        let result = new utilities_1.DateTimeResolutionResult();
        let suffixStr = source;
        let ers = this.config.cardinalExtractor.extract(source);
        if (ers && ers.length === 1) {
            let er = ers[0];
            let sourceUnit = '';
            let pr = this.config.numberParser.parse(er);
            let noNumStr = source.substr(er.start + er.length).trim().toLowerCase();
            let match = recognizers_text_1.RegExpUtility.getMatches(this.config.followedUnit, noNumStr).pop();
            if (match) {
                sourceUnit = match.groups('unit').value;
                suffixStr = match.groups('suffix').value;
            }
            if (this.config.unitMap.has(sourceUnit)) {
                let num = Number.parseFloat(pr.value) + this.parseNumberWithUnitAndSuffix(suffixStr);
                let unitStr = this.config.unitMap.get(sourceUnit);
                result.timex = `P${this.isLessThanDay(unitStr) ? 'T' : ''}${num}${unitStr[0]}`;
                result.futureValue = num * this.config.unitValueMap.get(sourceUnit);
                result.pastValue = result.futureValue;
                result.success = true;
                return result;
            }
        }
        return result;
    }
    parseNumberWithUnitAndSuffix(source) {
        let match = recognizers_text_1.RegExpUtility.getMatches(this.config.suffixAndRegex, source).pop();
        if (match) {
            let numStr = match.groups('suffix_num').value;
            if (this.config.doubleNumbers.has(numStr)) {
                return this.config.doubleNumbers.get(numStr);
            }
        }
        return 0;
    }
    parseNumberCombinedUnit(source) {
        let result = new utilities_1.DateTimeResolutionResult();
        let match = recognizers_text_1.RegExpUtility.getMatches(this.config.numberCombinedWithUnit, source).pop();
        if (!match)
            return result;
        let num = Number.parseFloat(match.groups('num').value) + this.parseNumberWithUnitAndSuffix(source);
        let sourceUnit = match.groups('unit').value;
        if (this.config.unitMap.has(sourceUnit)) {
            let unitStr = this.config.unitMap.get(sourceUnit);
            if (num > 1000 && (unitStr === 'Y' || unitStr === 'MON' || unitStr === 'W')) {
                return result;
            }
            result.timex = `P${this.isLessThanDay(unitStr) ? 'T' : ''}${num}${unitStr[0]}`;
            result.futureValue = num * this.config.unitValueMap.get(sourceUnit);
            result.pastValue = result.futureValue;
            result.success = true;
            return result;
        }
        return result;
    }
    parseAnUnit(source) {
        let result = new utilities_1.DateTimeResolutionResult();
        let match = recognizers_text_1.RegExpUtility.getMatches(this.config.anUnitRegex, source).pop();
        if (!match) {
            match = recognizers_text_1.RegExpUtility.getMatches(this.config.halfDateUnitRegex, source).pop();
        }
        if (!match)
            return result;
        let num = recognizers_text_1.StringUtility.isNullOrEmpty(match.groups('half').value) ? 1 : 0.5;
        num += this.parseNumberWithUnitAndSuffix(source);
        let numStr = num.toString();
        let sourceUnit = match.groups('unit').value;
        if (this.config.unitMap.has(sourceUnit)) {
            let unitStr = this.config.unitMap.get(sourceUnit);
            result.timex = `P${this.isLessThanDay(unitStr) ? 'T' : ''}${num}${unitStr[0]}`;
            result.futureValue = num * this.config.unitValueMap.get(sourceUnit);
            result.pastValue = result.futureValue;
            result.success = true;
            return result;
        }
        return result;
    }
    parseInExactNumberUnit(source) {
        let result = new utilities_1.DateTimeResolutionResult();
        let match = recognizers_text_1.RegExpUtility.getMatches(this.config.inExactNumberUnitRegex, source).pop();
        if (!match)
            return result;
        // set the inexact number "few", "some" to 3 for now
        let num = 3;
        let numStr = num.toString();
        let sourceUnit = match.groups('unit').value;
        if (this.config.unitMap.has(sourceUnit)) {
            let unitStr = this.config.unitMap.get(sourceUnit);
            if (num > 1000 && (unitStr === 'Y' || unitStr === 'MON' || unitStr === 'W')) {
                return result;
            }
            result.timex = `P${this.isLessThanDay(unitStr) ? 'T' : ''}${num}${unitStr[0]}`;
            result.futureValue = num * this.config.unitValueMap.get(sourceUnit);
            result.pastValue = result.futureValue;
            result.success = true;
            return result;
        }
        return result;
    }
    isLessThanDay(source) {
        return (source === 'S') || (source === 'M') || (source === 'H');
    }
}
exports.BaseDurationParser = BaseDurationParser;
//# sourceMappingURL=baseDuration.js.map