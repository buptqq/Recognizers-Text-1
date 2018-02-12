"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const recognizers_text_1 = require("recognizers-text");
const constants_1 = require("./constants");
const parsers_1 = require("./parsers");
const utilities_1 = require("./utilities");
class BaseDateTimeExtractor {
    constructor(config) {
        this.extractorName = constants_1.Constants.SYS_DATETIME_DATETIME;
        this.config = config;
    }
    extract(source, refDate) {
        if (!refDate)
            refDate = new Date();
        let referenceDate = refDate;
        let tokens = new Array();
        tokens = tokens.concat(this.mergeDateAndTime(source, referenceDate));
        tokens = tokens.concat(this.basicRegexMatch(source));
        tokens = tokens.concat(this.timeOfTodayBefore(source, referenceDate));
        tokens = tokens.concat(this.timeOfTodayAfter(source, referenceDate));
        tokens = tokens.concat(this.specialTimeOfDate(source, referenceDate));
        tokens = tokens.concat(this.durationWithBeforeAndAfter(source, referenceDate));
        let result = utilities_1.Token.mergeAllTokens(tokens, source, this.extractorName);
        return result;
    }
    mergeDateAndTime(source, refDate) {
        let tokens = new Array();
        let ers = this.config.datePointExtractor.extract(source, refDate);
        if (ers.length < 1)
            return tokens;
        ers = ers.concat(this.config.timePointExtractor.extract(source, refDate));
        if (ers.length < 2)
            return tokens;
        ers = ers.sort((erA, erB) => erA.start < erB.start ? -1 : erA.start === erB.start ? 0 : 1);
        let i = 0;
        while (i < ers.length - 1) {
            let j = i + 1;
            while (j < ers.length && recognizers_text_1.ExtractResult.isOverlap(ers[i], ers[j])) {
                j++;
            }
            if (j >= ers.length)
                break;
            if ((ers[i].type === constants_1.Constants.SYS_DATETIME_DATE && ers[j].type === constants_1.Constants.SYS_DATETIME_TIME) ||
                (ers[i].type === constants_1.Constants.SYS_DATETIME_TIME && ers[j].type === constants_1.Constants.SYS_DATETIME_DATE)) {
                let middleBegin = ers[i].start + ers[i].length;
                let middleEnd = ers[j].start;
                if (middleBegin > middleEnd) {
                    i = j + 1;
                    continue;
                }
                let middleStr = source.substr(middleBegin, middleEnd - middleBegin).trim().toLowerCase();
                if (this.config.isConnectorToken(middleStr)) {
                    let begin = ers[i].start;
                    let end = ers[j].start + ers[j].length;
                    tokens.push(new utilities_1.Token(begin, end));
                }
                i = j + 1;
                continue;
            }
            i = j;
        }
        tokens.forEach((token, index) => {
            let afterStr = source.substr(token.end);
            let match = recognizers_text_1.RegExpUtility.getMatches(this.config.suffixRegex, afterStr);
            if (match && match.length > 0) {
                // TODO: verify element
                token.end += match[0].length;
            }
        });
        return tokens;
    }
    basicRegexMatch(source) {
        let tokens = new Array();
        recognizers_text_1.RegExpUtility.getMatches(this.config.nowRegex, source)
            .forEach(match => {
            tokens.push(new utilities_1.Token(match.index, match.index + match.length));
        });
        return tokens;
    }
    timeOfTodayBefore(source, refDate) {
        let tokens = new Array();
        let ers = this.config.timePointExtractor.extract(source, refDate);
        ers.forEach(er => {
            let beforeStr = source.substr(0, er.start);
            let innerMatches = recognizers_text_1.RegExpUtility.getMatches(this.config.nightRegex, er.text);
            if (innerMatches && innerMatches.length > 0 && innerMatches[0].index === 0) {
                beforeStr = source.substr(0, er.start + innerMatches[0].length);
            }
            if (recognizers_text_1.StringUtility.isNullOrWhitespace(beforeStr))
                return;
            let matches = recognizers_text_1.RegExpUtility.getMatches(this.config.timeOfTodayBeforeRegex, beforeStr);
            if (matches && matches.length > 0) {
                let begin = matches[0].index;
                let end = er.start + er.length;
                tokens.push(new utilities_1.Token(begin, end));
            }
        });
        recognizers_text_1.RegExpUtility.getMatches(this.config.simpleTimeOfTodayBeforeRegex, source)
            .forEach(match => {
            tokens.push(new utilities_1.Token(match.index, match.index + match.length));
        });
        return tokens;
    }
    timeOfTodayAfter(source, refDate) {
        let tokens = new Array();
        let ers = this.config.timePointExtractor.extract(source, refDate);
        ers.forEach(er => {
            let afterStr = source.substr(er.start + er.length);
            if (recognizers_text_1.StringUtility.isNullOrWhitespace(afterStr))
                return;
            let matches = recognizers_text_1.RegExpUtility.getMatches(this.config.timeOfTodayAfterRegex, afterStr);
            if (matches && matches.length > 0) {
                let begin = er.start;
                let end = er.start + er.length + matches[0].length;
                tokens.push(new utilities_1.Token(begin, end));
            }
        });
        recognizers_text_1.RegExpUtility.getMatches(this.config.simpleTimeOfTodayAfterRegex, source)
            .forEach(match => {
            tokens.push(new utilities_1.Token(match.index, match.index + match.length));
        });
        return tokens;
    }
    specialTimeOfDate(source, refDate) {
        let tokens = new Array();
        let ers = this.config.datePointExtractor.extract(source, refDate);
        ers.forEach(er => {
            let beforeStr = source.substr(0, er.start);
            let beforeMatches = recognizers_text_1.RegExpUtility.getMatches(this.config.theEndOfRegex, beforeStr);
            if (beforeMatches && beforeMatches.length > 0) {
                tokens.push(new utilities_1.Token(beforeMatches[0].index, er.start + er.length));
            }
            else {
                let afterStr = source.substr(er.start + er.length);
                let afterMatches = recognizers_text_1.RegExpUtility.getMatches(this.config.theEndOfRegex, afterStr);
                if (afterMatches && afterMatches.length > 0) {
                    tokens.push(new utilities_1.Token(er.start, er.start + er.length + afterMatches[0].index + afterMatches[0].length));
                }
            }
        });
        return tokens;
    }
    durationWithBeforeAndAfter(source, refDate) {
        let tokens = new Array();
        this.config.durationExtractor.extract(source, refDate).forEach(er => {
            let matches = recognizers_text_1.RegExpUtility.getMatches(this.config.unitRegex, er.text);
            if (matches && matches.length > 0) {
                tokens = utilities_1.AgoLaterUtil.extractorDurationWithBeforeAndAfter(source, er, tokens, this.config.utilityConfiguration);
            }
        });
        return tokens;
    }
}
exports.BaseDateTimeExtractor = BaseDateTimeExtractor;
class BaseDateTimeParser {
    constructor(configuration) {
        this.config = configuration;
    }
    parse(er, refTime) {
        if (!refTime)
            refTime = new Date();
        let referenceTime = refTime;
        let value = null;
        if (er.type === BaseDateTimeParser.ParserName) {
            let innerResult = this.mergeDateAndTime(er.text, referenceTime);
            if (!innerResult.success) {
                innerResult = this.parseBasicRegex(er.text, referenceTime);
            }
            if (!innerResult.success) {
                innerResult = this.parseTimeOfToday(er.text, referenceTime);
            }
            if (!innerResult.success) {
                innerResult = this.parseSpecialTimeOfDate(er.text, referenceTime);
            }
            if (!innerResult.success) {
                innerResult = this.parserDurationWithAgoAndLater(er.text, referenceTime);
            }
            if (innerResult.success) {
                innerResult.futureResolution = {};
                innerResult.futureResolution[constants_1.TimeTypeConstants.DATETIME] = utilities_1.FormatUtil.formatDateTime(innerResult.futureValue);
                innerResult.pastResolution = {};
                innerResult.pastResolution[constants_1.TimeTypeConstants.DATETIME] = utilities_1.FormatUtil.formatDateTime(innerResult.pastValue);
                value = innerResult;
            }
        }
        let ret = new parsers_1.DateTimeParseResult(er);
        {
            ret.value = value,
                ret.timexStr = value === null ? "" : value.timex,
                ret.resolutionStr = "";
        }
        ;
        return ret;
    }
    parseBasicRegex(text, referenceTime) {
        let ret = new utilities_1.DateTimeResolutionResult();
        let trimmedText = text.trim().toLowerCase();
        // handle "now"
        let matches = recognizers_text_1.RegExpUtility.getMatches(this.config.nowRegex, trimmedText);
        if (matches.length && matches[0].index === 0 && matches[0].length === trimmedText.length) {
            let getMatchedNowTimex = this.config.getMatchedNowTimex(trimmedText);
            ret.timex = getMatchedNowTimex.timex;
            ret.futureValue = ret.pastValue = referenceTime;
            ret.success = true;
            return ret;
        }
        return ret;
    }
    // merge a Date entity and a Time entity
    mergeDateAndTime(text, referenceTime) {
        let ret = new utilities_1.DateTimeResolutionResult();
        let er1 = this.config.dateExtractor.extract(text, referenceTime);
        if (er1.length === 0) {
            er1 = this.config.dateExtractor.extract(this.config.tokenBeforeDate + text, referenceTime);
            if (er1.length === 1) {
                er1[0].start -= this.config.tokenBeforeDate.length;
            }
            else {
                return ret;
            }
        }
        else {
            // this is to understand if there is an ambiguous token in the text. For some languages (e.g. spanish)
            // the same word could mean different things (e.g a time in the day or an specific day).
            if (this.config.haveAmbiguousToken(text, er1[0].text)) {
                return ret;
            }
        }
        let er2 = this.config.timeExtractor.extract(text, referenceTime);
        if (er2.length === 0) {
            // here we filter out "morning, afternoon, night..." time entities
            er2 = this.config.timeExtractor.extract(this.config.tokenBeforeTime + text, referenceTime);
            if (er2.length === 1) {
                er2[0].start -= this.config.tokenBeforeTime.length;
            }
            else {
                return ret;
            }
        }
        // handle case "Oct. 5 in the afternoon at 7:00"
        // in this case "5 in the afternoon" will be extract as a Time entity
        let correctTimeIdx = 0;
        while (correctTimeIdx < er2.length && recognizers_text_1.ExtractResult.isOverlap(er2[correctTimeIdx], er1[0])) {
            correctTimeIdx++;
        }
        if (correctTimeIdx >= er2.length) {
            return ret;
        }
        let pr1 = this.config.dateParser.parse(er1[0], new Date(referenceTime.toDateString()));
        let pr2 = this.config.timeParser.parse(er2[correctTimeIdx], referenceTime);
        if (pr1.value === null || pr2.value === null) {
            return ret;
        }
        let futureDate = pr1.value.futureValue;
        let pastDate = pr1.value.pastValue;
        let time = pr2.value.futureValue;
        let hour = time.getHours();
        let min = time.getMinutes();
        let sec = time.getSeconds();
        // handle morning, afternoon
        if (recognizers_text_1.RegExpUtility.getMatches(this.config.pmTimeRegex, text).length && hour < 12) {
            hour += 12;
        }
        else if (recognizers_text_1.RegExpUtility.getMatches(this.config.amTimeRegex, text).length && hour >= 12) {
            hour -= 12;
        }
        let timeStr = pr2.timexStr;
        if (timeStr.endsWith("ampm")) {
            timeStr = timeStr.substring(0, timeStr.length - 4);
        }
        timeStr = "T" + utilities_1.FormatUtil.toString(hour, 2) + timeStr.substring(3);
        ret.timex = pr1.timexStr + timeStr;
        let val = pr2.value;
        if (hour <= 12 && !recognizers_text_1.RegExpUtility.getMatches(this.config.pmTimeRegex, text).length
            && !recognizers_text_1.RegExpUtility.getMatches(this.config.amTimeRegex, text).length && val.comment) {
            ret.comment = "ampm";
        }
        ret.futureValue = new Date(futureDate.getFullYear(), futureDate.getMonth(), futureDate.getDate(), hour, min, sec);
        ret.pastValue = new Date(pastDate.getFullYear(), pastDate.getMonth(), pastDate.getDate(), hour, min, sec);
        ret.success = true;
        // change the value of time object
        pr2.timexStr = timeStr;
        if (!recognizers_text_1.StringUtility.isNullOrEmpty(ret.comment)) {
            pr2.value.comment = ret.comment === "ampm" ? "ampm" : "";
        }
        // add the date and time object in case we want to split them
        ret.subDateTimeEntities = [pr1, pr2];
        return ret;
    }
    parseTimeOfToday(text, referenceTime) {
        let ret = new utilities_1.DateTimeResolutionResult();
        let trimmedText = text.toLowerCase().trim();
        let hour = 0;
        let min = 0;
        let sec = 0;
        let timeStr;
        let wholeMatches = recognizers_text_1.RegExpUtility.getMatches(this.config.simpleTimeOfTodayAfterRegex, trimmedText);
        if (!(wholeMatches.length && wholeMatches[0].length === trimmedText.length)) {
            wholeMatches = recognizers_text_1.RegExpUtility.getMatches(this.config.simpleTimeOfTodayBeforeRegex, trimmedText);
        }
        if (wholeMatches.length && wholeMatches[0].length === trimmedText.length) {
            let hourStr = wholeMatches[0].groups("hour").value;
            if (!hourStr) {
                hourStr = wholeMatches[0].groups("hournum").value.toLowerCase();
                hour = this.config.numbers.get(hourStr);
            }
            else {
                hour = parseInt(hourStr, 10);
            }
            timeStr = "T" + utilities_1.FormatUtil.toString(hour, 2);
        }
        else {
            let ers = this.config.timeExtractor.extract(trimmedText, referenceTime);
            if (ers.length !== 1) {
                ers = this.config.timeExtractor.extract(this.config.tokenBeforeTime + trimmedText, referenceTime);
                if (ers.length === 1) {
                    ers[0].start -= this.config.tokenBeforeTime.length;
                }
                else {
                    return ret;
                }
            }
            let pr = this.config.timeParser.parse(ers[0], referenceTime);
            if (pr.value === null) {
                return ret;
            }
            let time = pr.value.futureValue;
            hour = time.getHours();
            min = time.getMinutes();
            sec = time.getSeconds();
            timeStr = pr.timexStr;
        }
        let matches = recognizers_text_1.RegExpUtility.getMatches(this.config.specificTimeOfDayRegex, trimmedText);
        if (matches.length) {
            let matchStr = matches[0].value.toLowerCase();
            // handle "last", "next"
            let swift = this.config.getSwiftDay(matchStr);
            let date = new Date(referenceTime);
            date.setDate(date.getDate() + swift);
            // handle "morning", "afternoon"
            hour = this.config.getHour(matchStr, hour);
            // in this situation, luisStr cannot end up with "ampm", because we always have a "morning" or "night"
            if (timeStr.endsWith("ampm")) {
                timeStr = timeStr.substring(0, timeStr.length - 4);
            }
            timeStr = "T" + utilities_1.FormatUtil.toString(hour, 2) + timeStr.substring(3);
            ret.timex = utilities_1.FormatUtil.formatDate(date) + timeStr;
            ret.futureValue = ret.pastValue = new Date(date.getFullYear(), date.getMonth(), date.getDate(), hour, min, sec);
            ret.success = true;
            return ret;
        }
        return ret;
    }
    parseSpecialTimeOfDate(text, refDateTime) {
        let ret = new utilities_1.DateTimeResolutionResult();
        let ers = this.config.dateExtractor.extract(text, refDateTime);
        if (ers.length !== 1) {
            return ret;
        }
        let beforeStr = text.substring(0, ers[0].start || 0);
        if (recognizers_text_1.RegExpUtility.getMatches(this.config.theEndOfRegex, beforeStr).length) {
            let pr = this.config.dateParser.parse(ers[0], refDateTime);
            let futureDate = new Date(pr.value.futureValue);
            let pastDate = new Date(pr.value.pastValue);
            ret.timex = pr.timexStr + "T23:59";
            futureDate.setDate(futureDate.getDate() + 1);
            futureDate.setMinutes(futureDate.getMinutes() - 1);
            ret.futureValue = futureDate;
            pastDate.setDate(pastDate.getDate() + 1);
            pastDate.setMinutes(pastDate.getMinutes() - 1);
            ret.pastValue = pastDate;
            ret.success = true;
            return ret;
        }
        return ret;
    }
    // handle like "two hours ago"
    parserDurationWithAgoAndLater(text, referenceTime) {
        return utilities_1.AgoLaterUtil.parseDurationWithAgoAndLater(text, referenceTime, this.config.durationExtractor, this.config.durationParser, this.config.unitMap, this.config.unitRegex, this.config.utilityConfiguration, utilities_1.AgoLaterMode.DateTime);
    }
}
BaseDateTimeParser.ParserName = constants_1.Constants.SYS_DATETIME_DATETIME; // "DateTime";
exports.BaseDateTimeParser = BaseDateTimeParser;
//# sourceMappingURL=baseDateTime.js.map