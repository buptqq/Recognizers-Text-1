"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const constants_1 = require("./constants");
const recognizers_text_number_1 = require("recognizers-text-number");
const utilities_1 = require("./utilities");
const parsers_1 = require("./parsers");
class BaseTimeExtractor {
    constructor(config) {
        this.extractorName = constants_1.Constants.SYS_DATETIME_TIME; // "Time";
        this.config = config;
    }
    extract(text, refDate) {
        if (!refDate)
            refDate = new Date();
        let referenceDate = refDate;
        let tokens = new Array()
            .concat(this.basicRegexMatch(text))
            .concat(this.atRegexMatch(text))
            .concat(this.specialsRegexMatch(text, referenceDate));
        let result = utilities_1.Token.mergeAllTokens(tokens, text, this.extractorName);
        return result;
    }
    basicRegexMatch(text) {
        let ret = [];
        this.config.timeRegexList.forEach(regexp => {
            let matches = recognizers_text_number_1.RegExpUtility.getMatches(regexp, text);
            matches.forEach(match => {
                ret.push(new utilities_1.Token(match.index, match.index + match.length));
            });
        });
        return ret;
    }
    atRegexMatch(text) {
        let ret = [];
        // handle "at 5", "at seven"
        let matches = recognizers_text_number_1.RegExpUtility.getMatches(this.config.atRegex, text);
        matches.forEach(match => {
            if (match.index + match.length < text.length &&
                text.charAt(match.index + match.length) === '%') {
                return;
            }
            ret.push(new utilities_1.Token(match.index, match.index + match.length));
        });
        return ret;
    }
    specialsRegexMatch(text, refDate) {
        let ret = [];
        // handle "ish"
        if (this.config.ishRegex !== null) {
            let matches = recognizers_text_number_1.RegExpUtility.getMatches(this.config.ishRegex, text);
            matches.forEach(match => {
                ret.push(new utilities_1.Token(match.index, match.index + match.length));
            });
        }
        return ret;
    }
}
exports.BaseTimeExtractor = BaseTimeExtractor;
class BaseTimeParser {
    constructor(configuration) {
        this.ParserName = constants_1.Constants.SYS_DATETIME_TIME; // "Time";
        this.config = configuration;
    }
    parse(er, referenceTime) {
        if (!referenceTime)
            referenceTime = new Date();
        let value = null;
        if (er.type === this.ParserName) {
            let innerResult = this.internalParse(er.text, referenceTime);
            if (innerResult.success) {
                innerResult.futureResolution = {};
                innerResult.futureResolution[constants_1.TimeTypeConstants.TIME] = utilities_1.FormatUtil.formatTime(innerResult.futureValue);
                innerResult.pastResolution = {};
                innerResult.pastResolution[constants_1.TimeTypeConstants.TIME] = utilities_1.FormatUtil.formatTime(innerResult.pastValue);
                value = innerResult;
            }
        }
        let ret = new parsers_1.DateTimeParseResult(er);
        ret.value = value,
            ret.timexStr = value === null ? "" : value.timex,
            ret.resolutionStr = "";
        return ret;
    }
    internalParse(text, referenceTime) {
        let innerResult = this.parseBasicRegexMatch(text, referenceTime);
        return innerResult;
    }
    // parse basic patterns in TimeRegexList
    parseBasicRegexMatch(text, referenceTime) {
        let trimmedText = text.trim().toLowerCase();
        let offset = 0;
        let matches = recognizers_text_number_1.RegExpUtility.getMatches(this.config.atRegex, trimmedText);
        if (matches.length === 0) {
            matches = recognizers_text_number_1.RegExpUtility.getMatches(this.config.atRegex, this.config.timeTokenPrefix + trimmedText);
            offset = this.config.timeTokenPrefix.length;
        }
        if (matches.length > 0 && matches[0].index === offset && matches[0].length === trimmedText.length) {
            return this.match2Time(matches[0], referenceTime);
        }
        // parse hour pattern, like "twenty one", "16"
        // create a extract result which content the pass-in text
        let hour = this.config.numbers.get(text) || Number(text);
        if (hour) {
            if (hour >= 0 && hour <= 24) {
                let ret = new utilities_1.DateTimeResolutionResult();
                if (hour === 24) {
                    hour = 0;
                }
                if (hour <= 12 && hour !== 0) {
                    ret.comment = "ampm";
                }
                ret.timex = "T" + utilities_1.FormatUtil.toString(hour, 2);
                ret.futureValue = ret.pastValue =
                    utilities_1.DateUtils.safeCreateFromMinValue(referenceTime.getFullYear(), referenceTime.getMonth(), referenceTime.getDate(), hour, 0, 0);
                ret.success = true;
                return ret;
            }
        }
        for (let regex of this.config.timeRegexes) {
            offset = 0;
            matches = recognizers_text_number_1.RegExpUtility.getMatches(regex, trimmedText);
            if (matches.length && matches[0].index === offset && matches[0].length === trimmedText.length) {
                return this.match2Time(matches[0], referenceTime);
            }
        }
        return new utilities_1.DateTimeResolutionResult();
    }
    match2Time(match, referenceTime) {
        let ret = new utilities_1.DateTimeResolutionResult();
        let hour = 0;
        let min = 0;
        let second = 0;
        let day = referenceTime.getDate();
        let month = referenceTime.getMonth();
        let year = referenceTime.getFullYear();
        let hasMin = false;
        let hasSec = false;
        let hasAm = false;
        let hasPm = false;
        let hasMid = false;
        let engTimeStr = match.groups('engtime').value;
        if (!recognizers_text_number_1.StringUtility.isNullOrWhitespace(engTimeStr)) {
            // get hour
            let hourStr = match.groups('hournum').value.toLowerCase();
            hour = this.config.numbers.get(hourStr);
            // get minute
            let minStr = match.groups('minnum').value;
            let tensStr = match.groups('tens').value;
            if (!recognizers_text_number_1.StringUtility.isNullOrWhitespace(minStr)) {
                min = this.config.numbers.get(minStr);
                if (tensStr) {
                    min += this.config.numbers.get(tensStr);
                }
                hasMin = true;
            }
        }
        else if (!recognizers_text_number_1.StringUtility.isNullOrWhitespace(match.groups('mid').value)) {
            hasMid = true;
            if (!recognizers_text_number_1.StringUtility.isNullOrWhitespace(match.groups('midnight').value)) {
                hour = 0;
                min = 0;
                second = 0;
            }
            else if (!recognizers_text_number_1.StringUtility.isNullOrWhitespace(match.groups('midmorning').value)) {
                hour = 10;
                min = 0;
                second = 0;
            }
            else if (!recognizers_text_number_1.StringUtility.isNullOrWhitespace(match.groups('midafternoon').value)) {
                hour = 14;
                min = 0;
                second = 0;
            }
            else if (!recognizers_text_number_1.StringUtility.isNullOrWhitespace(match.groups('midday').value)) {
                hour = 12;
                min = 0;
                second = 0;
            }
        }
        else {
            // get hour
            let hourStr = match.groups('hour').value;
            if (recognizers_text_number_1.StringUtility.isNullOrWhitespace(hourStr)) {
                hourStr = match.groups('hournum').value.toLowerCase();
                hour = this.config.numbers.get(hourStr);
                if (!hour) {
                    return ret;
                }
            }
            else {
                hour = Number.parseInt(hourStr, 10);
                if (!hour) {
                    hour = this.config.numbers.get(hourStr);
                    if (!hour) {
                        return ret;
                    }
                }
            }
            // get minute
            let minStr = match.groups('min').value.toLowerCase();
            if (recognizers_text_number_1.StringUtility.isNullOrWhitespace(minStr)) {
                minStr = match.groups('minnum').value;
                if (!recognizers_text_number_1.StringUtility.isNullOrWhitespace(minStr)) {
                    min = this.config.numbers.get(minStr);
                    hasMin = true;
                }
                let tensStr = match.groups('tens').value;
                if (!recognizers_text_number_1.StringUtility.isNullOrWhitespace(tensStr)) {
                    min += this.config.numbers.get(tensStr);
                    hasMin = true;
                }
            }
            else {
                min = Number.parseInt(minStr, 10);
                hasMin = true;
            }
            // get second
            let secStr = match.groups('sec').value.toLowerCase();
            if (!recognizers_text_number_1.StringUtility.isNullOrWhitespace(secStr)) {
                second = Number.parseInt(secStr, 10);
                hasSec = true;
            }
        }
        // adjust by desc string
        let descStr = match.groups('desc').value.toLowerCase();
        if (!recognizers_text_number_1.StringUtility.isNullOrWhitespace(descStr)) {
            if (recognizers_text_number_1.RegExpUtility.getMatches(this.config.utilityConfiguration.amDescRegex, descStr).length > 0
                || recognizers_text_number_1.RegExpUtility.getMatches(this.config.utilityConfiguration.amPmDescRegex, descStr).length > 0) {
                if (hour >= 12) {
                    hour -= 12;
                }
                if (recognizers_text_number_1.RegExpUtility.getMatches(this.config.utilityConfiguration.amPmDescRegex, descStr).length === 0) {
                    hasAm = true;
                }
            }
            else if (recognizers_text_number_1.RegExpUtility.getMatches(this.config.utilityConfiguration.pmDescRegex, descStr).length > 0) {
                if (hour < 12) {
                    hour += 12;
                }
                hasPm = true;
            }
        }
        // adjust min by prefix
        let timePrefix = match.groups('prefix').value.toLowerCase();
        if (!recognizers_text_number_1.StringUtility.isNullOrWhitespace(timePrefix)) {
            let adjust = { hour: hour, min: min, hasMin: hasMin };
            this.config.adjustByPrefix(timePrefix, adjust);
            hour = adjust.hour;
            min = adjust.min;
            hasMin = adjust.hasMin;
        }
        // adjust hour by suffix
        let timeSuffix = match.groups('suffix').value.toLowerCase();
        if (!recognizers_text_number_1.StringUtility.isNullOrWhitespace(timeSuffix)) {
            let adjust = { hour: hour, min: min, hasMin: hasMin, hasAm: hasAm, hasPm: hasPm };
            this.config.adjustBySuffix(timeSuffix, adjust);
            hour = adjust.hour;
            min = adjust.min;
            hasMin = adjust.hasMin;
            hasAm = adjust.hasAm;
            hasPm = adjust.hasPm;
        }
        if (hour === 24) {
            hour = 0;
        }
        ret.timex = "T" + utilities_1.FormatUtil.toString(hour, 2);
        if (hasMin) {
            ret.timex += ":" + utilities_1.FormatUtil.toString(min, 2);
        }
        if (hasSec) {
            ret.timex += ":" + utilities_1.FormatUtil.toString(second, 2);
        }
        if (hour <= 12 && !hasPm && !hasAm && !hasMid) {
            ret.comment = "ampm";
        }
        ret.futureValue = ret.pastValue = new Date(year, month, day, hour, min, second);
        ret.success = true;
        return ret;
    }
}
exports.BaseTimeParser = BaseTimeParser;
//# sourceMappingURL=baseTime.js.map