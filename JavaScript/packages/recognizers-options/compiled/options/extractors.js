"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const recognizers_text_1 = require("recognizers-text");
const constants_1 = require("./constants");
class OptionsExtractor {
    constructor(config) {
        this.config = config;
    }
    extract(source) {
        let results = new Array();
        let trimmedSource = source.toLowerCase();
        if (recognizers_text_1.StringUtility.isNullOrWhitespace(source)) {
            return results;
        }
        let allMatches = new Array();
        let partialResults = new Array();
        let sourceTokens = this.tokenize(trimmedSource);
        this.config.regexesMap.forEach((typeExtracted, regex) => {
            recognizers_text_1.RegExpUtility.getMatches(regex, trimmedSource).forEach(match => {
                let matchTokens = this.tokenize(match.value);
                let topScore = sourceTokens
                    .map((sToken, index) => this.matchValue(sourceTokens, matchTokens, index))
                    .reduce((top, value) => top = Math.max(top, value), 0.0);
                if (topScore > 0.0) {
                    let start = match.index;
                    let length = match.length;
                    let text = source.substr(start, length).trim();
                    partialResults.push({
                        start: start,
                        length: length,
                        text: text,
                        type: typeExtracted,
                        data: {
                            source: source,
                            score: topScore
                        }
                    });
                }
            });
        });
        partialResults = partialResults.sort((a, b) => a.start - b.start);
        if (this.config.onlyTopMatch) {
            let topResult = partialResults.reduce((top, value) => top = top.data.score < value.data.score ? value : top, partialResults[0]);
            topResult.data.otherMatches = partialResults.filter(r => r !== topResult);
            results.push(topResult);
        }
        else {
            results = partialResults;
        }
        return results;
    }
    matchValue(source, match, startPos) {
        let matched = 0;
        let totalDeviation = 0;
        match.forEach(matchToken => {
            let pos = source.indexOf(matchToken, startPos);
            if (pos >= 0) {
                let distance = matched > 0 ? pos - startPos : 0;
                if (distance <= this.config.maxDistance) {
                    matched++;
                    totalDeviation += distance;
                    startPos = pos + 1;
                }
            }
        });
        let score = 0.0;
        if (matched > 0 && (matched === match.length || this.config.allowPartialMatch)) {
            let completeness = matched / match.length;
            let accuracy = completeness * (matched / (matched + totalDeviation));
            let initialScore = accuracy * (matched / source.length);
            score = 0.4 + (0.6 * initialScore);
        }
        return score;
    }
    tokenize(source) {
        return recognizers_text_1.RegExpUtility.split(this.config.tokenRegex, source).filter(s => !recognizers_text_1.StringUtility.isNullOrWhitespace(s));
    }
}
exports.OptionsExtractor = OptionsExtractor;
class BooleanExtractor extends OptionsExtractor {
    constructor(config) {
        let regexesMap = new Map()
            .set(config.regexTrue, constants_1.Constants.SYS_BOOLEAN_TRUE)
            .set(config.regexFalse, constants_1.Constants.SYS_BOOLEAN_FALSE);
        let optionsConfig = {
            regexesMap: regexesMap,
            tokenRegex: config.tokenRegex,
            allowPartialMatch: false,
            maxDistance: 2,
            onlyTopMatch: config.onlyTopMatch
        };
        super(optionsConfig);
        this.extractType = constants_1.Constants.SYS_BOOLEAN;
    }
}
BooleanExtractor.booleanTrue = constants_1.Constants.SYS_BOOLEAN_TRUE;
BooleanExtractor.booleanFalse = constants_1.Constants.SYS_BOOLEAN_FALSE;
exports.BooleanExtractor = BooleanExtractor;
//# sourceMappingURL=extractors.js.map