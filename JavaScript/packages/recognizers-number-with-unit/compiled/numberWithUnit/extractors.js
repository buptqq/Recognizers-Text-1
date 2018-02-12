"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const recognizers_text_1 = require("recognizers-text");
const max = require("lodash.max");
const escapeRegExp = require("lodash.escaperegexp");
class NumberWithUnitExtractor {
    constructor(config) {
        this.config = config;
        if (this.config.suffixList && this.config.suffixList.size > 0) {
            this.suffixRegexes = this.buildRegexFromSet(Array.from(this.config.suffixList.values()));
        }
        else {
            this.suffixRegexes = new Set(); // empty
        }
        if (this.config.prefixList && this.config.prefixList.size > 0) {
            let maxLength = 0;
            this.config.prefixList.forEach(preMatch => {
                let len = max(preMatch.split('|').filter(s => s && s.length).map(s => s.length));
                maxLength = maxLength >= len ? maxLength : len;
            });
            // 2 is the maxium length of spaces.
            this.maxPrefixMatchLen = maxLength + 2;
            this.prefixRegexes = this.buildRegexFromSet(Array.from(this.config.prefixList.values()));
        }
        else {
            this.prefixRegexes = new Set(); // empty
        }
        this.separateRegex = this.buildSeparateRegexFromSet();
    }
    extract(source) {
        if (!this.preCheckStr(source)) {
            return new Array();
        }
        let mappingPrefix = new Map();
        let matched = new Array(source.length);
        let numbers = this.config.unitNumExtractor.extract(source);
        let result = new Array();
        let sourceLen = source.length;
        /* Mix prefix and numbers, make up a prefix-number combination */
        if (this.maxPrefixMatchLen !== 0) {
            numbers.forEach(num => {
                if (num.start === undefined || num.length === undefined) {
                    return;
                }
                let maxFindPref = Math.min(this.maxPrefixMatchLen, num.start);
                if (maxFindPref === 0) {
                    return;
                }
                /* Scan from left to right , find the longest match */
                let leftStr = source.substring(num.start - maxFindPref, num.start - maxFindPref + maxFindPref);
                ;
                let lastIndex = leftStr.length;
                let bestMatch = null;
                this.prefixRegexes.forEach(regex => {
                    let collection = recognizers_text_1.RegExpUtility.getMatches(regex, leftStr).filter(m => m.length);
                    if (collection.length === 0) {
                        return;
                    }
                    collection.forEach(match => {
                        if (leftStr.substring(match.index, lastIndex).trim() === match.value) {
                            if (bestMatch === null || bestMatch.index >= match.index) {
                                bestMatch = match;
                            }
                        }
                    });
                });
                if (bestMatch !== null) {
                    let offSet = lastIndex - bestMatch.index;
                    let unitStr = leftStr.substring(bestMatch.index, lastIndex);
                    mappingPrefix.set(num.start, {
                        offset: lastIndex - bestMatch.index,
                        unitString: unitStr
                    });
                }
            });
        }
        for (let num of numbers) {
            if (num.start === undefined || num.length === undefined) {
                continue;
            }
            let start = num.start;
            let length = num.length;
            let maxFindLen = sourceLen - start - length;
            let prefixUnit = mappingPrefix.has(start) ? mappingPrefix.get(start) : null;
            if (maxFindLen > 0) {
                let rightSub = source.substring(start + length, start + length + maxFindLen);
                let unitMatch = Array.from(this.suffixRegexes.values()).map(r => recognizers_text_1.RegExpUtility.getMatches(r, rightSub))
                    .filter(m => m.length > 0);
                let maxlen = 0;
                for (let i = 0; i < unitMatch.length; i++) {
                    for (let m of unitMatch[i]) {
                        if (m.length > 0) {
                            let endpos = m.index + m.length;
                            if (m.index >= 0) {
                                let midStr = rightSub.substring(0, Math.min(m.index, rightSub.length));
                                if (maxlen < endpos && (recognizers_text_1.StringUtility.isNullOrWhitespace(midStr) || midStr.trim() === this.config.connectorToken)) {
                                    maxlen = endpos;
                                }
                            }
                        }
                    }
                }
                if (maxlen !== 0) {
                    for (let i = 0; i < length + maxlen; i++) {
                        matched[i + start] = true;
                    }
                    let substr = source.substring(start, start + length + maxlen);
                    let er = {
                        start: start,
                        length: length + maxlen,
                        text: substr,
                        type: this.config.extractType
                    };
                    if (prefixUnit !== null) {
                        er.start -= prefixUnit.offset;
                        er.length += prefixUnit.offset;
                        er.text = prefixUnit.unitString + er.text;
                    }
                    /* Relative position will be used in Parser */
                    num.start = start - er.start;
                    er.data = num;
                    result.push(er);
                    continue;
                }
            }
            if (prefixUnit !== null) {
                let er = {
                    start: num.start - prefixUnit.offset,
                    length: num.length + prefixUnit.offset,
                    text: prefixUnit.unitString + num.text,
                    type: this.config.extractType
                };
                /* Relative position will be used in Parser */
                num.start = start - er.start;
                er.data = num;
                result.push(er);
            }
        }
        // extract Separate unit
        if (this.separateRegex !== null) {
            this.extractSeparateUnits(source, result);
        }
        return result;
    }
    validateUnit(source) {
        return source.substring(0, 1) !== '-';
    }
    preCheckStr(str) {
        return str && str.length;
    }
    extractSeparateUnits(source, numDependResults) {
        // Default is false
        let matchResult = new Array(source.length);
        numDependResults.forEach(numDependResult => {
            let start = numDependResult.start;
            let i = 0;
            do {
                matchResult[start + i++] = true;
            } while (i < numDependResult.length);
        });
        // Extract all SeparateUnits, then merge it with numDependResults
        let matchCollection = recognizers_text_1.RegExpUtility.getMatches(this.separateRegex, source);
        if (matchCollection.length > 0) {
            matchCollection.forEach(match => {
                let i = 0;
                while (i < match.length && !matchResult[match.index + i]) {
                    i++;
                }
                if (i === match.length) {
                    // Mark as extracted
                    for (let j = 0; j < i; j++) {
                        matchResult[j] = true;
                    }
                    numDependResults.push({
                        start: match.index,
                        length: match.length,
                        text: match.value,
                        type: this.config.extractType,
                        data: null
                    });
                }
            });
        }
    }
    buildRegexFromSet(collection, ignoreCase = true) {
        return new Set(collection.map(regexString => {
            let regexTokens = regexString.split('|').map(escapeRegExp);
            let pattern = `${this.config.buildPrefix}(${regexTokens.join('|')})${this.config.buildSuffix}`;
            let options = "gs";
            if (ignoreCase)
                options += "i";
            return recognizers_text_1.RegExpUtility.getSafeRegExp(pattern, options);
        }));
    }
    buildSeparateRegexFromSet(ignoreCase = true) {
        let separateWords = new Set();
        if (this.config.prefixList && this.config.prefixList.size) {
            for (let addWord of this.config.prefixList.values()) {
                addWord.split('|').filter(s => s && s.length)
                    .filter(this.validateUnit)
                    .forEach(word => separateWords.add(word));
            }
        }
        if (this.config.suffixList && this.config.suffixList.size) {
            for (let addWord of this.config.suffixList.values()) {
                addWord.split('|').filter(s => s && s.length)
                    .filter(this.validateUnit)
                    .forEach(word => separateWords.add(word));
            }
        }
        if (this.config.ambiguousUnitList && this.config.ambiguousUnitList.length) {
            for (let abandonWord of this.config.ambiguousUnitList) {
                if (separateWords.has(abandonWord)) {
                    separateWords.delete(abandonWord);
                }
            }
        }
        let regexTokens = Array.from(separateWords.values()).map(escapeRegExp);
        if (regexTokens.length === 0) {
            return null;
        }
        // Sort SeparateWords using descending length.
        regexTokens = regexTokens.sort(this.dinoComparer);
        let pattern = `${this.config.buildPrefix}(${regexTokens.join('|')})${this.config.buildSuffix}`;
        let options = "gs";
        if (ignoreCase)
            options += "i";
        return recognizers_text_1.RegExpUtility.getSafeRegExp(pattern, options);
    }
    dinoComparer(x, y) {
        if (x === null) {
            if (y === null) {
                // If x is null and y is null, they're
                // equal.
                return 0;
            }
            else {
                // If x is null and y is not null, y
                // is greater.
                return 1;
            }
        }
        else {
            // If x is not null...
            //
            if (y === null) 
            // ...and y is null, x is greater.
            {
                return -1;
            }
            else {
                // ...and y is not null, compare the
                // lengths of the two strings.
                //
                let retval = y.length - x.length;
                if (retval !== 0) {
                    // If the strings are not of equal length,
                    // the longer string is greater.
                    //
                    return retval;
                }
                else {
                    // If the strings are of equal length,
                    // sort them with ordinary string comparison.
                    //
                    let xl = x.toLowerCase();
                    let yl = y.toLowerCase();
                    if (xl < yl) {
                        return -1;
                    }
                    if (xl > yl) {
                        return 1;
                    }
                    return 0;
                }
            }
        }
    }
}
exports.NumberWithUnitExtractor = NumberWithUnitExtractor;
class PrefixUnitResult {
}
exports.PrefixUnitResult = PrefixUnitResult;
//# sourceMappingURL=extractors.js.map