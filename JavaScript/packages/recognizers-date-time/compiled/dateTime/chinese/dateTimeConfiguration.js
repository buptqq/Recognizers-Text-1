"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const recognizers_text_1 = require("recognizers-text");
const constants_1 = require("../constants");
const baseDateTime_1 = require("../baseDateTime");
const timeConfiguration_1 = require("./timeConfiguration");
const dateConfiguration_1 = require("./dateConfiguration");
const utilities_1 = require("../utilities");
const chineseDateTime_1 = require("../../resources/chineseDateTime");
const parsers_1 = require("../parsers");
class ChineseDateTimeExtractorConfiguration {
    constructor() {
        this.datePointExtractor = new dateConfiguration_1.ChineseDateExtractor();
        this.timePointExtractor = new timeConfiguration_1.ChineseTimeExtractor();
        this.prepositionRegex = recognizers_text_1.RegExpUtility.getSafeRegExp(chineseDateTime_1.ChineseDateTime.PrepositionRegex);
        this.nowRegex = recognizers_text_1.RegExpUtility.getSafeRegExp(chineseDateTime_1.ChineseDateTime.NowRegex);
        this.nightRegex = recognizers_text_1.RegExpUtility.getSafeRegExp(chineseDateTime_1.ChineseDateTime.NightRegex);
        this.timeOfTodayBeforeRegex = recognizers_text_1.RegExpUtility.getSafeRegExp(chineseDateTime_1.ChineseDateTime.TimeOfTodayRegex);
    }
    isConnectorToken(source) {
        return recognizers_text_1.StringUtility.isNullOrEmpty(source)
            || source === ','
            || recognizers_text_1.RegExpUtility.isMatch(this.prepositionRegex, source);
    }
}
class ChineseDateTimeExtractor extends baseDateTime_1.BaseDateTimeExtractor {
    constructor() {
        super(new ChineseDateTimeExtractorConfiguration());
    }
    extract(source, refDate) {
        if (!refDate)
            refDate = new Date();
        let referenceDate = refDate;
        let tokens = new Array()
            .concat(this.mergeDateAndTime(source, referenceDate))
            .concat(this.basicRegexMatch(source))
            .concat(this.timeOfToday(source, referenceDate));
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
            if (ers[i].type === constants_1.Constants.SYS_DATETIME_DATE && ers[j].type === constants_1.Constants.SYS_DATETIME_TIME) {
                let middleBegin = ers[i].start + ers[i].length;
                let middleEnd = ers[j].start;
                if (middleBegin > middleEnd) {
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
        return tokens;
    }
    timeOfToday(source, refDate) {
        let tokens = new Array();
        this.config.timePointExtractor.extract(source, refDate).forEach(er => {
            let beforeStr = source.substr(0, er.start);
            let innerMatch = recognizers_text_1.RegExpUtility.getMatches(this.config.nightRegex, er.text).pop();
            if (innerMatch && innerMatch.index === 0) {
                beforeStr = source.substr(0, er.start + innerMatch.length);
            }
            if (recognizers_text_1.StringUtility.isNullOrWhitespace(beforeStr))
                return;
            let match = recognizers_text_1.RegExpUtility.getMatches(this.config.timeOfTodayBeforeRegex, beforeStr).pop();
            if (match && recognizers_text_1.StringUtility.isNullOrWhitespace(beforeStr.substr(match.index + match.length))) {
                let begin = match.index;
                let end = er.start + er.length;
                tokens.push(new utilities_1.Token(begin, end));
            }
        });
        return tokens;
    }
}
exports.ChineseDateTimeExtractor = ChineseDateTimeExtractor;
class ChineseDateTimeParserConfiguration {
    constructor() {
        this.dateExtractor = new dateConfiguration_1.ChineseDateExtractor();
        this.timeExtractor = new timeConfiguration_1.ChineseTimeExtractor();
        this.dateParser = new dateConfiguration_1.ChineseDateParser();
        this.timeParser = new timeConfiguration_1.ChineseTimeParser();
        this.pmTimeRegex = recognizers_text_1.RegExpUtility.getSafeRegExp(chineseDateTime_1.ChineseDateTime.DateTimeSimplePmRegex);
        this.amTimeRegex = recognizers_text_1.RegExpUtility.getSafeRegExp(chineseDateTime_1.ChineseDateTime.DateTimeSimpleAmRegex);
        this.specificTimeOfDayRegex = recognizers_text_1.RegExpUtility.getSafeRegExp(chineseDateTime_1.ChineseDateTime.TimeOfTodayRegex);
        this.nowRegex = recognizers_text_1.RegExpUtility.getSafeRegExp(chineseDateTime_1.ChineseDateTime.NowRegex);
    }
    haveAmbiguousToken(text, matchedText) {
        return null;
    }
    getMatchedNowTimex(text) {
        let trimmedText = text.trim().toLowerCase();
        if (trimmedText.endsWith('现在')) {
            return { matched: true, timex: 'PRESENT_REF' };
        }
        else if (trimmedText === '刚刚才' || trimmedText === '刚刚' || trimmedText === '刚才') {
            return { matched: true, timex: 'PAST_REF' };
        }
        else if (trimmedText === '立刻' || trimmedText === '马上') {
            return { matched: true, timex: 'FUTURE_REF' };
        }
        return { matched: false, timex: null };
    }
    getSwiftDay(text) {
        let swift = 0;
        if (text === '明晚' || text === '明早' || text === '明晨') {
            swift = 1;
        }
        else if (text === '昨晚') {
            swift = -1;
        }
        return swift;
    }
    getHour(text, hour) {
        let result = hour;
        if (hour < 12 && ['今晚', '明晚', '昨晚'].some(o => o === text)) {
            result += 12;
        }
        else if (hour >= 12 && ['今早', '今晨', '明早', '明晨'].some(o => o === text)) {
            result -= 12;
        }
        return result;
    }
}
class ChineseDateTimeParser extends baseDateTime_1.BaseDateTimeParser {
    constructor() {
        let config = new ChineseDateTimeParserConfiguration();
        super(config);
    }
    parse(er, refTime) {
        if (!refTime)
            refTime = new Date();
        let referenceTime = refTime;
        let value = null;
        if (er.type === baseDateTime_1.BaseDateTimeParser.ParserName) {
            let innerResult = this.mergeDateAndTime(er.text, referenceTime);
            if (!innerResult.success) {
                innerResult = this.parseBasicRegex(er.text, referenceTime);
            }
            if (!innerResult.success) {
                innerResult = this.parseTimeOfToday(er.text, referenceTime);
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
    // merge a Date entity and a Time entity
    mergeDateAndTime(text, referenceTime) {
        let ret = new utilities_1.DateTimeResolutionResult();
        let er1 = this.config.dateExtractor.extract(text, referenceTime);
        if (er1.length === 0) {
            return ret;
        }
        let er2 = this.config.timeExtractor.extract(text, referenceTime);
        if (er2.length === 0) {
            return ret;
        }
        let pr1 = this.config.dateParser.parse(er1[0], new Date(referenceTime.toDateString()));
        let pr2 = this.config.timeParser.parse(er2[0], referenceTime);
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
        return ret;
    }
    parseTimeOfToday(text, referenceTime) {
        let ret = new utilities_1.DateTimeResolutionResult();
        let ers = this.config.timeExtractor.extract(text, referenceTime);
        if (ers.length !== 1) {
            return ret;
        }
        let pr = this.config.timeParser.parse(ers[0], referenceTime);
        if (pr.value === null) {
            return ret;
        }
        let time = pr.value.futureValue;
        let hour = time.getHours();
        let min = time.getMinutes();
        let sec = time.getSeconds();
        let timeStr = pr.timexStr;
        let match = recognizers_text_1.RegExpUtility.getMatches(this.config.specificTimeOfDayRegex, text).pop();
        if (match) {
            let matchStr = match.value.toLowerCase();
            // handle "last", "next"
            let swift = this.config.getSwiftDay(matchStr);
            let date = utilities_1.DateUtils.addDays(referenceTime, swift);
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
}
exports.ChineseDateTimeParser = ChineseDateTimeParser;
//# sourceMappingURL=dateTimeConfiguration.js.map