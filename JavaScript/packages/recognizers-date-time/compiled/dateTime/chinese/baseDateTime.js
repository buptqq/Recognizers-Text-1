"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const recognizers_text_number_1 = require("recognizers-text-number");
class TimeResult {
    constructor(hour, minute, second, lowBound) {
        this.hour = hour;
        this.minute = minute;
        this.second = second;
        this.lowBound = lowBound ? lowBound : -1;
    }
}
exports.TimeResult = TimeResult;
class BaseDateTimeExtractor {
    constructor(regexesDictionary) {
        this.regexesDictionary = regexesDictionary;
    }
    extract(source, refDate) {
        if (!refDate)
            refDate = new Date();
        let referenceDate = refDate;
        let results = new Array();
        if (recognizers_text_number_1.StringUtility.isNullOrEmpty(source)) {
            return results;
        }
        let matchSource = new Map();
        let matched = new Array(source.length);
        for (let i = 0; i < source.length; i++) {
            matched[i] = false;
        }
        let collections = [];
        this.regexesDictionary.forEach((value, regex) => {
            let matches = recognizers_text_number_1.RegExpUtility.getMatches(regex, source);
            if (matches.length > 0) {
                collections.push({ matches: matches, value: value });
            }
        });
        collections.forEach(collection => {
            collection.matches.forEach(m => {
                for (let j = 0; j < m.length; j++) {
                    matched[m.index + j] = true;
                }
                // Keep Source Data for extra information
                matchSource.set(m, collection.value);
            });
        });
        let last = -1;
        for (let i = 0; i < source.length; i++) {
            if (matched[i]) {
                if (i + 1 === source.length || !matched[i + 1]) {
                    let start = last + 1;
                    let length = i - last;
                    let substr = source.substring(start, start + length).trim();
                    let srcMatch = Array.from(matchSource.keys()).find(m => m.index === start && m.length === length);
                    if (srcMatch) {
                        results.push({
                            start: start,
                            length: length,
                            text: substr,
                            type: this.extractorName,
                            data: matchSource.has(srcMatch)
                                ? { dataType: matchSource.get(srcMatch), namedEntity: (key) => srcMatch.groups(key) }
                                : null
                        });
                    }
                }
            }
            else {
                last = i;
            }
        }
        return results;
    }
}
exports.BaseDateTimeExtractor = BaseDateTimeExtractor;
class TimeResolutionUtils {
    static addDescription(lowBoundMap, timeResult, description) {
        if (lowBoundMap.has(description) && timeResult.hour < lowBoundMap.get(description)) {
            timeResult.hour += 12;
            timeResult.lowBound = lowBoundMap.get(description);
        }
        else {
            timeResult.lowBound = 0;
        }
    }
    static matchToValue(onlyDigitMatch, numbersMap, source) {
        if (recognizers_text_number_1.StringUtility.isNullOrEmpty(source)) {
            return -1;
        }
        if (recognizers_text_number_1.RegExpUtility.isMatch(onlyDigitMatch, source)) {
            return Number.parseInt(source);
        }
        if (source.length === 1) {
            return numbersMap.get(source);
        }
        let value = 1;
        for (let index = 0; index < source.length; index++) {
            let char = source.charAt(index);
            if (char === '十') {
                value *= 10;
            }
            else if (index === 0) {
                value *= numbersMap.get(char);
            }
            else {
                value += numbersMap.get(char);
            }
        }
        return value;
    }
}
exports.TimeResolutionUtils = TimeResolutionUtils;
//# sourceMappingURL=baseDateTime.js.map