"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const constants_1 = require("./constants");
const baseNumbers_1 = require("../resources/baseNumbers");
const recognizers_text_1 = require("recognizers-text");
const escapeRegExp = require("lodash.escaperegexp");
class BaseNumberExtractor {
    constructor() {
        this.extractType = "";
    }
    extract(source) {
        if (!source || source.trim().length === 0) {
            return [];
        }
        let result = new Array();
        let matchSource = new Map();
        let matched = new Array(source.length);
        for (let i = 0; i < source.length; i++) {
            matched[i] = false;
        }
        let collections = this.regexes
            .map(o => ({ matches: recognizers_text_1.RegExpUtility.getMatches(o.regExp, source), value: o.value }))
            .filter(o => o.matches && o.matches.length);
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
                        result.push({
                            start: start,
                            length: length,
                            text: substr,
                            type: this.extractType,
                            data: matchSource.has(srcMatch) ? matchSource.get(srcMatch) : null
                        });
                    }
                }
            }
            else {
                last = i;
            }
        }
        return result;
    }
    generateLongFormatNumberRegexes(type, placeholder = baseNumbers_1.BaseNumbers.PlaceHolderDefault) {
        let thousandsMark = escapeRegExp(type.thousandsMark);
        let decimalsMark = escapeRegExp(type.decimalsMark);
        let regexDefinition = type.decimalsMark === '\0'
            ? baseNumbers_1.BaseNumbers.IntegerRegexDefinition(placeholder, thousandsMark)
            : baseNumbers_1.BaseNumbers.DoubleRegexDefinition(placeholder, thousandsMark, decimalsMark);
        return recognizers_text_1.RegExpUtility.getSafeRegExp(regexDefinition, "gis");
    }
}
exports.BaseNumberExtractor = BaseNumberExtractor;
class BasePercentageExtractor {
    constructor(numberExtractor) {
        this.extractType = constants_1.Constants.SYS_NUM_PERCENTAGE;
        this.numberExtractor = numberExtractor;
        this.regexes = this.initRegexes();
    }
    extract(source) {
        let originSource = source;
        let positionMap;
        let numExtResults;
        // preprocess the source sentence via extracting and replacing the numbers in it
        let preprocess = this.preprocessStrWithNumberExtracted(originSource);
        source = preprocess.source;
        positionMap = preprocess.positionMap;
        numExtResults = preprocess.numExtResults;
        let allMatches = this.regexes.map(rx => recognizers_text_1.RegExpUtility.getMatches(rx, source));
        let matched = new Array(source.length);
        for (let i = 0; i < source.length; i++) {
            matched[i] = false;
        }
        for (let i = 0; i < allMatches.length; i++) {
            allMatches[i].forEach(match => {
                for (let j = 0; j < match.length; j++) {
                    matched[j + match.index] = true;
                }
            });
        }
        let result = new Array();
        let last = -1;
        // get index of each matched results
        for (let i = 0; i < source.length; i++) {
            if (matched[i]) {
                if (i + 1 === source.length || matched[i + 1] === false) {
                    let start = last + 1;
                    let length = i - last;
                    let substr = source.substring(start, start + length);
                    let er = {
                        start: start,
                        length: length,
                        text: substr,
                        type: this.extractType
                    };
                    result.push(er);
                }
            }
            else {
                last = i;
            }
        }
        // post-processing, restoring the extracted numbers
        this.postProcessing(result, originSource, positionMap, numExtResults);
        return result;
    }
    // get the number extractor results and convert the extracted numbers to @sys.num, so that the regexes can work
    preprocessStrWithNumberExtracted(str) {
        let positionMap = new Map();
        let numExtResults = this.numberExtractor.extract(str);
        let replaceText = baseNumbers_1.BaseNumbers.NumberReplaceToken;
        let match = new Array(str.length);
        let strParts = new Array();
        let start;
        let end;
        for (let i = 0; i < str.length; i++) {
            match[i] = -1;
        }
        for (let i = 0; i < numExtResults.length; i++) {
            let extraction = numExtResults[i];
            let subtext = extraction.text;
            start = extraction.start;
            end = extraction.length + start;
            for (let j = start; j < end; j++) {
                if (match[j] === -1) {
                    match[j] = i;
                }
            }
        }
        start = 0;
        for (let i = 1; i < str.length; i++) {
            if (match[i] !== match[i - 1]) {
                strParts.push([start, i - 1]);
                start = i;
            }
        }
        strParts.push([start, str.length - 1]);
        let ret = "";
        let index = 0;
        strParts.forEach(strPart => {
            start = strPart[0];
            end = strPart[1];
            let type = match[start];
            if (type === -1) {
                ret += str.substring(start, end + 1);
                for (let i = start; i <= end; i++) {
                    positionMap.set(index++, i);
                }
            }
            else {
                let originalText = str.substring(start, end + 1);
                ret += replaceText;
                for (let i = 0; i < replaceText.length; i++) {
                    positionMap.set(index++, start);
                }
            }
        });
        positionMap.set(index++, str.length);
        return {
            numExtResults: numExtResults,
            source: ret,
            positionMap: positionMap
        };
    }
    // replace the @sys.num to the real patterns, directly modifies the ExtractResult
    postProcessing(results, originSource, positionMap, numExtResults) {
        let replaceText = baseNumbers_1.BaseNumbers.NumberReplaceToken;
        for (let i = 0; i < results.length; i++) {
            let start = results[i].start;
            let end = start + results[i].length;
            let str = results[i].text;
            if (positionMap.has(start) && positionMap.has(end)) {
                let originStart = positionMap.get(start);
                let originLenth = positionMap.get(end) - originStart;
                results[i].start = originStart;
                results[i].length = originLenth;
                results[i].text = originSource.substring(originStart, originStart + originLenth).trim();
                let numStart = str.indexOf(replaceText);
                if (numStart !== -1) {
                    let numOriginStart = start + numStart;
                    if (positionMap.has(numStart)) {
                        let dataKey = originSource.substring(positionMap.get(numOriginStart), positionMap.get(numOriginStart + replaceText.length));
                        for (let j = i; j < numExtResults.length; j++) {
                            if (results[i].start === numExtResults[j].start && results[i].text.includes(numExtResults[j].text)) {
                                results[i].data = [dataKey, numExtResults[j]];
                                break;
                            }
                        }
                    }
                }
            }
        }
    }
    // read the rules
    buildRegexes(regexStrs, ignoreCase = true) {
        return regexStrs.map(regexStr => {
            let options = "gs";
            if (ignoreCase) {
                options += "i";
            }
            return recognizers_text_1.RegExpUtility.getSafeRegExp(regexStr, options);
        });
    }
}
BasePercentageExtractor.numExtType = constants_1.Constants.SYS_NUM;
exports.BasePercentageExtractor = BasePercentageExtractor;
//# sourceMappingURL=extractors.js.map