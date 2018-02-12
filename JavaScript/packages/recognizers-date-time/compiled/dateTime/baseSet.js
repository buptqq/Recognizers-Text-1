"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const recognizers_text_1 = require("recognizers-text");
const constants_1 = require("./constants");
const parsers_1 = require("./parsers");
const utilities_1 = require("./utilities");
class BaseSetExtractor {
    constructor(config) {
        this.extractorName = constants_1.Constants.SYS_DATETIME_SET;
        this.config = config;
    }
    extract(source, refDate) {
        if (!refDate)
            refDate = new Date();
        let referenceDate = refDate;
        let tokens = new Array()
            .concat(this.matchEachUnit(source))
            .concat(this.matchPeriodic(source))
            .concat(this.matchEachDuration(source, referenceDate))
            .concat(this.timeEveryday(source, referenceDate))
            .concat(this.matchEach(this.config.dateExtractor, source, referenceDate))
            .concat(this.matchEach(this.config.timeExtractor, source, referenceDate))
            .concat(this.matchEach(this.config.dateTimeExtractor, source, referenceDate))
            .concat(this.matchEach(this.config.datePeriodExtractor, source, referenceDate))
            .concat(this.matchEach(this.config.timePeriodExtractor, source, referenceDate))
            .concat(this.matchEach(this.config.dateTimePeriodExtractor, source, referenceDate));
        let result = utilities_1.Token.mergeAllTokens(tokens, source, this.extractorName);
        return result;
    }
    matchEachUnit(source) {
        let ret = [];
        recognizers_text_1.RegExpUtility.getMatches(this.config.eachUnitRegex, source).forEach(match => {
            ret.push(new utilities_1.Token(match.index, match.index + match.length));
        });
        return ret;
    }
    matchPeriodic(source) {
        let ret = [];
        recognizers_text_1.RegExpUtility.getMatches(this.config.periodicRegex, source).forEach(match => {
            ret.push(new utilities_1.Token(match.index, match.index + match.length));
        });
        return ret;
    }
    matchEachDuration(source, refDate) {
        let ret = [];
        this.config.durationExtractor.extract(source, refDate).forEach(er => {
            if (recognizers_text_1.RegExpUtility.getMatches(this.config.lastRegex, er.text).length > 0)
                return;
            let beforeStr = source.substr(0, er.start);
            let matches = recognizers_text_1.RegExpUtility.getMatches(this.config.eachPrefixRegex, beforeStr);
            if (matches && matches.length > 0) {
                ret.push(new utilities_1.Token(matches[0].index, er.start + er.length));
            }
        });
        return ret;
    }
    timeEveryday(source, refDate) {
        let ret = [];
        this.config.timeExtractor.extract(source, refDate).forEach(er => {
            let afterStr = source.substr(er.start + er.length);
            if (recognizers_text_1.StringUtility.isNullOrWhitespace(afterStr) && this.config.beforeEachDayRegex) {
                let beforeStr = source.substr(0, er.start);
                let beforeMatches = recognizers_text_1.RegExpUtility.getMatches(this.config.beforeEachDayRegex, beforeStr);
                if (beforeMatches && beforeMatches.length > 0) {
                    ret.push(new utilities_1.Token(beforeMatches[0].index, er.start + er.length));
                }
            }
            else {
                let afterMatches = recognizers_text_1.RegExpUtility.getMatches(this.config.eachDayRegex, afterStr);
                if (afterMatches && afterMatches.length > 0) {
                    ret.push(new utilities_1.Token(er.start, er.start + er.length + afterMatches[0].length));
                }
            }
        });
        return ret;
    }
    matchEach(extractor, source, refDate) {
        let ret = [];
        recognizers_text_1.RegExpUtility.getMatches(this.config.setEachRegex, source).forEach(match => {
            let trimmedSource = source.substr(0, match.index) + source.substr(match.index + match.length);
            extractor.extract(trimmedSource, refDate).forEach(er => {
                if (er.start <= match.index && (er.start + er.length) > match.index) {
                    ret.push(new utilities_1.Token(er.start, er.start + match.length + er.length));
                }
            });
        });
        recognizers_text_1.RegExpUtility.getMatches(this.config.setWeekDayRegex, source).forEach(match => {
            let trimmedSource = source.substr(0, match.index) + match.groups('weekday').value + source.substr(match.index + match.length);
            extractor.extract(trimmedSource, refDate).forEach(er => {
                if (er.start <= match.index) {
                    let length = er.length + 1;
                    if (!recognizers_text_1.StringUtility.isNullOrEmpty(match.groups('prefix').value)) {
                        length += match.groups('prefix').value.length;
                    }
                    ret.push(new utilities_1.Token(er.start, er.start + length));
                }
            });
        });
        return ret;
    }
}
exports.BaseSetExtractor = BaseSetExtractor;
class BaseSetParser {
    constructor(configuration) {
        this.config = configuration;
    }
    parse(er, referenceDate) {
        if (!referenceDate)
            referenceDate = new Date();
        let value = null;
        if (er.type === BaseSetParser.ParserName) {
            let innerResult = this.parseEachUnit(er.text);
            if (!innerResult.success) {
                innerResult = this.parseEachDuration(er.text, referenceDate);
            }
            if (!innerResult.success) {
                innerResult = this.parserTimeEveryday(er.text, referenceDate);
            }
            // NOTE: Please do not change the order of following function
            // datetimeperiod>dateperiod>timeperiod>datetime>date>time
            if (!innerResult.success) {
                innerResult = this.parseEach(this.config.dateTimePeriodExtractor, this.config.dateTimePeriodParser, er.text, referenceDate);
            }
            if (!innerResult.success) {
                innerResult = this.parseEach(this.config.datePeriodExtractor, this.config.datePeriodParser, er.text, referenceDate);
            }
            if (!innerResult.success) {
                innerResult = this.parseEach(this.config.timePeriodExtractor, this.config.timePeriodParser, er.text, referenceDate);
            }
            if (!innerResult.success) {
                innerResult = this.parseEach(this.config.dateTimeExtractor, this.config.dateTimeParser, er.text, referenceDate);
            }
            if (!innerResult.success) {
                innerResult = this.parseEach(this.config.dateExtractor, this.config.dateParser, er.text, referenceDate);
            }
            if (!innerResult.success) {
                innerResult = this.parseEach(this.config.timeExtractor, this.config.timeParser, er.text, referenceDate);
            }
            if (innerResult.success) {
                innerResult.futureResolution = {};
                innerResult.futureResolution[constants_1.TimeTypeConstants.SET] = innerResult.futureValue;
                innerResult.pastResolution = {};
                innerResult.pastResolution[constants_1.TimeTypeConstants.SET] = innerResult.pastValue;
                value = innerResult;
            }
        }
        let ret = new parsers_1.DateTimeParseResult(er);
        ret.value = value,
            ret.timexStr = value === null ? "" : value.timex,
            ret.resolutionStr = "";
        return ret;
    }
    parseEachDuration(text, refDate) {
        let ret = new utilities_1.DateTimeResolutionResult();
        let ers = this.config.durationExtractor.extract(text, refDate);
        if (ers.length !== 1 || text.substring(ers[0].start + ers[0].length || 0)) {
            return ret;
        }
        let beforeStr = text.substring(0, ers[0].start || 0);
        let matches = recognizers_text_1.RegExpUtility.getMatches(this.config.eachPrefixRegex, beforeStr);
        if (matches.length) {
            let pr = this.config.durationParser.parse(ers[0], new Date());
            ret.timex = pr.timexStr;
            ret.futureValue = ret.pastValue = "Set: " + pr.timexStr;
            ret.success = true;
            return ret;
        }
        return ret;
    }
    parseEachUnit(text) {
        let ret = new utilities_1.DateTimeResolutionResult();
        // handle "daily", "weekly"
        let matches = recognizers_text_1.RegExpUtility.getMatches(this.config.periodicRegex, text);
        if (matches.length) {
            let getMatchedDailyTimex = this.config.getMatchedDailyTimex(text);
            if (!getMatchedDailyTimex.matched) {
                return ret;
            }
            ret.timex = getMatchedDailyTimex.timex;
            ret.futureValue = ret.pastValue = "Set: " + ret.timex;
            ret.success = true;
            return ret;
        }
        // handle "each month"
        matches = recognizers_text_1.RegExpUtility.getMatches(this.config.eachUnitRegex, text);
        if (matches.length && matches[0].length === text.length) {
            let sourceUnit = matches[0].groups("unit").value;
            if (sourceUnit && this.config.unitMap.has(sourceUnit)) {
                let getMatchedUnitTimex = this.config.getMatchedUnitTimex(sourceUnit);
                if (!getMatchedUnitTimex.matched) {
                    return ret;
                }
                if (!recognizers_text_1.StringUtility.isNullOrEmpty(matches[0].groups('other').value)) {
                    getMatchedUnitTimex.timex = getMatchedUnitTimex.timex.replace('1', '2');
                }
                ret.timex = getMatchedUnitTimex.timex;
                ret.futureValue = ret.pastValue = "Set: " + ret.timex;
                ret.success = true;
                return ret;
            }
        }
        return ret;
    }
    parserTimeEveryday(text, refDate) {
        let ret = new utilities_1.DateTimeResolutionResult();
        let ers = this.config.timeExtractor.extract(text, refDate);
        if (ers.length !== 1) {
            return ret;
        }
        let afterStr = text.replace(ers[0].text, "");
        let matches = recognizers_text_1.RegExpUtility.getMatches(this.config.eachDayRegex, afterStr);
        if (matches.length) {
            let pr = this.config.timeParser.parse(ers[0], new Date());
            ret.timex = pr.timexStr;
            ret.futureValue = ret.pastValue = "Set: " + ret.timex;
            ret.success = true;
            return ret;
        }
        return ret;
    }
    parseEach(extractor, parser, text, refDate) {
        let ret = new utilities_1.DateTimeResolutionResult();
        let success = false;
        let er;
        let match = recognizers_text_1.RegExpUtility.getMatches(this.config.setEachRegex, text).pop();
        if (match) {
            let trimmedText = text.substr(0, match.index) + text.substr(match.index + match.length);
            er = extractor.extract(trimmedText, refDate);
            if (er.length === 1 && er[0].length === trimmedText.length) {
                success = true;
            }
        }
        match = recognizers_text_1.RegExpUtility.getMatches(this.config.setWeekDayRegex, text).pop();
        if (match) {
            let trimmedText = text.substr(0, match.index) + match.groups('weekday').value + text.substr(match.index + match.length);
            er = extractor.extract(trimmedText, refDate);
            if (er.length === 1 && er[0].length === trimmedText.length) {
                success = true;
            }
        }
        if (success) {
            let pr = parser.parse(er[0]);
            ret.timex = pr.timexStr;
            ret.futureValue = `Set: ${pr.timexStr}`;
            ret.pastValue = `Set: ${pr.timexStr}`;
            ret.success = true;
            return ret;
        }
        return ret;
    }
}
BaseSetParser.ParserName = constants_1.Constants.SYS_DATETIME_SET;
exports.BaseSetParser = BaseSetParser;
//# sourceMappingURL=baseSet.js.map