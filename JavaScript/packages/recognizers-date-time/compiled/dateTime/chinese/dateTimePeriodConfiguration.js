"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const recognizers_text_1 = require("recognizers-text");
const recognizers_text_number_1 = require("recognizers-text-number");
const constants_1 = require("../constants");
const baseDateTimePeriod_1 = require("../baseDateTimePeriod");
const timeConfiguration_1 = require("./timeConfiguration");
const timePeriodConfiguration_1 = require("./timePeriodConfiguration");
const dateConfiguration_1 = require("./dateConfiguration");
const dateTimeConfiguration_1 = require("./dateTimeConfiguration");
const utilities_1 = require("../utilities");
const parsers_1 = require("../parsers");
const chineseDateTime_1 = require("../../resources/chineseDateTime");
class ChineseDateTimePeriodExtractorConfiguration {
    getFromTokenIndex(source) {
        let result = { matched: false, index: -1 };
        if (source.endsWith("从")) {
            result.index = source.lastIndexOf("从");
            result.matched = true;
        }
        return result;
    }
    ;
    getBetweenTokenIndex(source) {
        return { matched: false, index: -1 };
    }
    ;
    hasConnectorToken(source) {
        return (source === '和' || source === ' 与' || source === '到');
    }
    ;
    constructor() {
        this.singleDateExtractor = new dateConfiguration_1.ChineseDateExtractor();
        this.singleTimeExtractor = new timeConfiguration_1.ChineseTimeExtractor();
        this.singleDateTimeExtractor = new dateTimeConfiguration_1.ChineseDateTimeExtractor();
        this.prepositionRegex = recognizers_text_1.RegExpUtility.getSafeRegExp(chineseDateTime_1.ChineseDateTime.DateTimePeriodPrepositionRegex);
        this.tillRegex = recognizers_text_1.RegExpUtility.getSafeRegExp(chineseDateTime_1.ChineseDateTime.DateTimePeriodTillRegex);
        this.cardinalExtractor = new recognizers_text_number_1.ChineseCardinalExtractor();
        this.followedUnit = recognizers_text_1.RegExpUtility.getSafeRegExp(chineseDateTime_1.ChineseDateTime.DateTimePeriodFollowedUnit);
        this.timeUnitRegex = recognizers_text_1.RegExpUtility.getSafeRegExp(chineseDateTime_1.ChineseDateTime.DateTimePeriodUnitRegex);
        this.specificTimeOfDayRegex = recognizers_text_1.RegExpUtility.getSafeRegExp(chineseDateTime_1.ChineseDateTime.SpecificTimeOfDayRegex);
        this.timeOfDayRegex = recognizers_text_1.RegExpUtility.getSafeRegExp(chineseDateTime_1.ChineseDateTime.TimeOfDayRegex);
    }
}
class ChineseDateTimePeriodExtractor extends baseDateTimePeriod_1.BaseDateTimePeriodExtractor {
    constructor() {
        super(new ChineseDateTimePeriodExtractorConfiguration());
        this.zhijianRegex = recognizers_text_1.RegExpUtility.getSafeRegExp(chineseDateTime_1.ChineseDateTime.ZhijianRegex);
        this.pastRegex = recognizers_text_1.RegExpUtility.getSafeRegExp(chineseDateTime_1.ChineseDateTime.PastRegex);
        this.futureRegex = recognizers_text_1.RegExpUtility.getSafeRegExp(chineseDateTime_1.ChineseDateTime.FutureRegex);
    }
    extract(source, refDate) {
        if (!refDate)
            refDate = new Date();
        let referenceDate = refDate;
        let tokens = new Array()
            .concat(this.mergeDateAndTimePeriod(source, referenceDate))
            .concat(this.mergeTwoTimePoints(source, referenceDate))
            .concat(this.matchNubmerWithUnit(source))
            .concat(this.matchNight(source, referenceDate));
        let result = utilities_1.Token.mergeAllTokens(tokens, source, this.extractorName);
        return result;
    }
    mergeDateAndTimePeriod(source, refDate) {
        let tokens = new Array();
        let ersDate = this.config.singleDateExtractor.extract(source, refDate);
        let ersTime = this.config.singleTimeExtractor.extract(source, refDate);
        let timeResults = new Array();
        let j = 0;
        for (let i = 0; i < ersDate.length; i++) {
            timeResults.push(ersDate[i]);
            while (j < ersTime.length && ersTime[j].start + ersTime[j].length <= ersDate[i].start) {
                timeResults.push(ersTime[j]);
                j++;
            }
            while (j < ersTime.length && recognizers_text_1.ExtractResult.isOverlap(ersTime[j], ersDate[i])) {
                j++;
            }
        }
        for (j; j < ersTime.length; j++) {
            timeResults.push(ersTime[j]);
        }
        timeResults = timeResults.sort((a, b) => a.start > b.start ? 1 : a.start < b.start ? -1 : 0);
        let idx = 0;
        while (idx < timeResults.length - 1) {
            let current = timeResults[idx];
            let next = timeResults[idx + 1];
            if (current.type === constants_1.Constants.SYS_DATETIME_DATE && next.type === constants_1.Constants.SYS_DATETIME_TIMEPERIOD) {
                let middleBegin = current.start + current.length;
                let middleEnd = next.start;
                let middleStr = source.substring(middleBegin, middleEnd).trim();
                if (recognizers_text_1.StringUtility.isNullOrWhitespace(middleStr) || recognizers_text_1.RegExpUtility.isMatch(this.config.prepositionRegex, middleStr)) {
                    let periodBegin = current.start;
                    let periodEnd = next.start + next.length;
                    tokens.push(new utilities_1.Token(periodBegin, periodEnd));
                }
                idx++;
            }
            idx++;
        }
        return tokens;
    }
    mergeTwoTimePoints(source, refDate) {
        let tokens = new Array();
        let ersDateTime = this.config.singleDateTimeExtractor.extract(source, refDate);
        let ersTime = this.config.singleTimeExtractor.extract(source, refDate);
        let innerMarks = [];
        let j = 0;
        ersDateTime.forEach((erDateTime, index) => {
            innerMarks.push(erDateTime);
            while (j < ersTime.length && ersTime[j].start + ersTime[j].length < erDateTime.start) {
                innerMarks.push(ersTime[j++]);
            }
            while (j < ersTime.length && recognizers_text_1.ExtractResult.isOverlap(ersTime[j], erDateTime)) {
                j++;
            }
        });
        while (j < ersTime.length) {
            innerMarks.push(ersTime[j++]);
        }
        innerMarks = innerMarks.sort((erA, erB) => erA.start < erB.start ? -1 : erA.start === erB.start ? 0 : 1);
        let idx = 0;
        while (idx < innerMarks.length - 1) {
            let currentMark = innerMarks[idx];
            let nextMark = innerMarks[idx + 1];
            if (currentMark.type === constants_1.Constants.SYS_DATETIME_TIME && nextMark.type === constants_1.Constants.SYS_DATETIME_TIME) {
                idx++;
                continue;
            }
            let middleBegin = currentMark.start + currentMark.length;
            let middleEnd = nextMark.start;
            let middleStr = source.substr(middleBegin, middleEnd - middleBegin).trim().toLowerCase();
            let matches = recognizers_text_1.RegExpUtility.getMatches(this.config.tillRegex, middleStr);
            if (matches && matches.length > 0 && matches[0].index === 0 && matches[0].length === middleStr.length) {
                let periodBegin = currentMark.start;
                let periodEnd = nextMark.start + nextMark.length;
                let beforeStr = source.substr(0, periodBegin).trim().toLowerCase();
                let fromTokenIndex = this.config.getFromTokenIndex(beforeStr);
                if (fromTokenIndex.matched) {
                    periodBegin = fromTokenIndex.index;
                }
                tokens.push(new utilities_1.Token(periodBegin, periodEnd));
                idx += 2;
                continue;
            }
            if (this.config.hasConnectorToken(middleStr)) {
                let periodBegin = currentMark.start;
                let periodEnd = nextMark.start + nextMark.length;
                let afterStr = source.substr(periodEnd).trim().toLowerCase();
                let match = recognizers_text_1.RegExpUtility.getMatches(this.zhijianRegex, afterStr).pop();
                if (match) {
                    tokens.push(new utilities_1.Token(periodBegin, periodEnd + match.length));
                    idx += 2;
                    continue;
                }
            }
            idx++;
        }
        ;
        return tokens;
    }
    matchNubmerWithUnit(source) {
        let tokens = new Array();
        let durations = new Array();
        this.config.cardinalExtractor.extract(source).forEach(er => {
            let afterStr = source.substr(er.start + er.length);
            let followedUnitMatch = recognizers_text_1.RegExpUtility.getMatches(this.config.followedUnit, afterStr).pop();
            if (followedUnitMatch && followedUnitMatch.index === 0) {
                durations.push(new utilities_1.Token(er.start, er.start + er.length + followedUnitMatch.length));
            }
        });
        recognizers_text_1.RegExpUtility.getMatches(this.config.timeUnitRegex, source).forEach(match => {
            durations.push(new utilities_1.Token(match.index, match.index + match.length));
        });
        durations.forEach(duration => {
            let beforeStr = source.substr(0, duration.start).toLowerCase();
            if (recognizers_text_1.StringUtility.isNullOrWhitespace(beforeStr)) {
                return;
            }
            let match = recognizers_text_1.RegExpUtility.getMatches(this.pastRegex, beforeStr).pop();
            if (match && recognizers_text_1.StringUtility.isNullOrWhitespace(beforeStr.substr(match.index + match.length))) {
                tokens.push(new utilities_1.Token(match.index, duration.end));
                return;
            }
            match = recognizers_text_1.RegExpUtility.getMatches(this.futureRegex, beforeStr).pop();
            if (match && recognizers_text_1.StringUtility.isNullOrWhitespace(beforeStr.substr(match.index + match.length))) {
                tokens.push(new utilities_1.Token(match.index, duration.end));
                return;
            }
        });
        return tokens;
    }
    matchNight(source, refDate) {
        let tokens = new Array();
        recognizers_text_1.RegExpUtility.getMatches(this.config.specificTimeOfDayRegex, source).forEach(match => {
            tokens.push(new utilities_1.Token(match.index, match.index + match.length));
        });
        this.config.singleDateExtractor.extract(source, refDate).forEach(er => {
            let afterStr = source.substr(er.start + er.length);
            let match = recognizers_text_1.RegExpUtility.getMatches(this.config.timeOfDayRegex, afterStr).pop();
            if (match) {
                let middleStr = source.substr(0, match.index);
                if (recognizers_text_1.StringUtility.isNullOrWhitespace(middleStr) || recognizers_text_1.RegExpUtility.isMatch(this.config.prepositionRegex, middleStr)) {
                    tokens.push(new utilities_1.Token(er.start, er.start + er.length + match.index + match.length));
                }
            }
        });
        return tokens;
    }
}
exports.ChineseDateTimePeriodExtractor = ChineseDateTimePeriodExtractor;
class ChineseDateTimePeriodParserConfiguration {
    constructor() {
        this.dateExtractor = new dateConfiguration_1.ChineseDateExtractor();
        this.timeExtractor = new timeConfiguration_1.ChineseTimeExtractor();
        this.dateTimeExtractor = new dateTimeConfiguration_1.ChineseDateTimeExtractor();
        this.timePeriodExtractor = new timePeriodConfiguration_1.ChineseTimePeriodExtractor();
        this.dateParser = new dateConfiguration_1.ChineseDateParser();
        this.timeParser = new timeConfiguration_1.ChineseTimeParser();
        this.dateTimeParser = new dateTimeConfiguration_1.ChineseDateTimeParser();
        this.timePeriodParser = new timePeriodConfiguration_1.ChineseTimePeriodParser();
        this.specificTimeOfDayRegex = recognizers_text_1.RegExpUtility.getSafeRegExp(chineseDateTime_1.ChineseDateTime.SpecificTimeOfDayRegex);
        this.relativeTimeUnitRegex = recognizers_text_1.RegExpUtility.getSafeRegExp(chineseDateTime_1.ChineseDateTime.TimeOfDayRegex);
        this.pastRegex = recognizers_text_1.RegExpUtility.getSafeRegExp(chineseDateTime_1.ChineseDateTime.PastRegex);
        this.futureRegex = recognizers_text_1.RegExpUtility.getSafeRegExp(chineseDateTime_1.ChineseDateTime.FutureRegex);
        this.unitMap = chineseDateTime_1.ChineseDateTime.ParserConfigurationUnitMap;
    }
    getMatchedTimeRange(source) {
        let swift = 0;
        let beginHour = 0;
        let endHour = 0;
        let endMin = 0;
        let timeStr = '';
        switch (source) {
            case '今晚':
                swift = 0;
                timeStr = 'TEV';
                beginHour = 16;
                endHour = 20;
                break;
            case '今早':
            case '今晨':
                swift = 0;
                timeStr = 'TMO';
                beginHour = 8;
                endHour = 12;
                break;
            case '明晚':
                swift = 1;
                timeStr = 'TEV';
                beginHour = 16;
                endHour = 20;
                break;
            case '明早':
            case '明晨':
                swift = 1;
                timeStr = 'TMO';
                beginHour = 8;
                endHour = 12;
                break;
            case '昨晚':
                swift = -1;
                timeStr = 'TEV';
                beginHour = 16;
                endHour = 20;
                break;
            default:
                return {
                    timeStr: '',
                    beginHour: 0,
                    endHour: 0,
                    endMin: 0,
                    swift: 0,
                    success: false
                };
        }
        return {
            timeStr: timeStr,
            beginHour: beginHour,
            endHour: endHour,
            endMin: endMin,
            swift: swift,
            success: true
        };
    }
    getSwiftPrefix(source) {
        return null;
    }
}
class ChineseDateTimePeriodParser extends baseDateTimePeriod_1.BaseDateTimePeriodParser {
    constructor() {
        let config = new ChineseDateTimePeriodParserConfiguration();
        super(config);
        this.TMORegex = recognizers_text_1.RegExpUtility.getSafeRegExp(chineseDateTime_1.ChineseDateTime.DateTimePeriodMORegex);
        this.TAFRegex = recognizers_text_1.RegExpUtility.getSafeRegExp(chineseDateTime_1.ChineseDateTime.DateTimePeriodAFRegex);
        this.TEVRegex = recognizers_text_1.RegExpUtility.getSafeRegExp(chineseDateTime_1.ChineseDateTime.DateTimePeriodEVRegex);
        this.TNIRegex = recognizers_text_1.RegExpUtility.getSafeRegExp(chineseDateTime_1.ChineseDateTime.DateTimePeriodNIRegex);
        this.timeOfDayRegex = recognizers_text_1.RegExpUtility.getSafeRegExp(chineseDateTime_1.ChineseDateTime.TimeOfDayRegex);
        this.cardinalExtractor = new recognizers_text_number_1.ChineseCardinalExtractor();
        this.cardinalParser = recognizers_text_number_1.AgnosticNumberParserFactory.getParser(recognizers_text_number_1.AgnosticNumberParserType.Cardinal, new recognizers_text_number_1.ChineseNumberParserConfiguration());
    }
    parse(extractorResult, referenceDate) {
        if (!referenceDate)
            referenceDate = new Date();
        let resultValue;
        if (extractorResult.type === this.parserName) {
            let source = extractorResult.text.trim().toLowerCase();
            let innerResult = this.mergeDateAndTimePeriods(source, referenceDate);
            if (!innerResult.success) {
                innerResult = this.mergeTwoTimePoints(source, referenceDate);
            }
            if (!innerResult.success) {
                innerResult = this.parseSpecificTimeOfDay(source, referenceDate);
            }
            if (!innerResult.success) {
                innerResult = this.parseNumberWithUnit(source, referenceDate);
            }
            if (innerResult.success) {
                innerResult.futureResolution = {};
                innerResult.futureResolution[constants_1.TimeTypeConstants.START_DATETIME] = utilities_1.FormatUtil.formatDateTime(innerResult.futureValue[0]);
                innerResult.futureResolution[constants_1.TimeTypeConstants.END_DATETIME] = utilities_1.FormatUtil.formatDateTime(innerResult.futureValue[1]);
                innerResult.pastResolution = {};
                innerResult.pastResolution[constants_1.TimeTypeConstants.START_DATETIME] = utilities_1.FormatUtil.formatDateTime(innerResult.pastValue[0]);
                innerResult.pastResolution[constants_1.TimeTypeConstants.END_DATETIME] = utilities_1.FormatUtil.formatDateTime(innerResult.pastValue[1]);
                resultValue = innerResult;
            }
        }
        let result = new parsers_1.DateTimeParseResult(extractorResult);
        result.value = resultValue;
        result.timexStr = resultValue ? resultValue.timex : '';
        result.resolutionStr = '';
        return result;
    }
    mergeDateAndTimePeriods(text, referenceTime) {
        let result = new utilities_1.DateTimeResolutionResult();
        let erDate = this.config.dateExtractor.extract(text, referenceTime).pop();
        let erTimePeriod = this.config.timePeriodExtractor.extract(text, referenceTime).pop();
        if (!erDate || !erTimePeriod)
            return result;
        let prDate = this.config.dateParser.parse(erDate, referenceTime);
        let prTimePeriod = this.config.timePeriodParser.parse(erTimePeriod, referenceTime);
        let split = prTimePeriod.timexStr.split('T');
        if (split.length !== 4) {
            return result;
        }
        let beginTime = prTimePeriod.value.futureValue.item1;
        let endTime = prTimePeriod.value.futureValue.item2;
        let futureDate = prDate.value.futureValue;
        let pastDate = prDate.value.pastValue;
        result.futureValue = [
            utilities_1.DateUtils.safeCreateFromMinValueWithDateAndTime(futureDate, beginTime),
            utilities_1.DateUtils.safeCreateFromMinValueWithDateAndTime(futureDate, endTime)
        ];
        result.pastValue = [
            utilities_1.DateUtils.safeCreateFromMinValueWithDateAndTime(pastDate, beginTime),
            utilities_1.DateUtils.safeCreateFromMinValueWithDateAndTime(pastDate, endTime)
        ];
        let dateTimex = prDate.timexStr;
        result.timex = `${split[0]}${dateTimex}T${split[1]}${dateTimex}T${split[2]}T${split[3]}`;
        result.success = true;
        return result;
    }
    mergeTwoTimePoints(text, referenceTime) {
        let result = new utilities_1.DateTimeResolutionResult();
        let prs;
        let timeErs = this.config.timeExtractor.extract(text, referenceTime);
        let datetimeErs = this.config.dateTimeExtractor.extract(text, referenceTime);
        let bothHasDate = false;
        let beginHasDate = false;
        let endHasDate = false;
        if (datetimeErs.length === 2) {
            prs = this.getTwoPoints(datetimeErs[0], datetimeErs[1], this.config.dateTimeParser, this.config.dateTimeParser, referenceTime);
            bothHasDate = true;
        }
        else if (datetimeErs.length === 1 && timeErs.length === 2) {
            if (recognizers_text_1.ExtractResult.isOverlap(datetimeErs[0], timeErs[0])) {
                prs = this.getTwoPoints(datetimeErs[0], timeErs[1], this.config.dateTimeParser, this.config.timeParser, referenceTime);
                beginHasDate = true;
            }
            else {
                prs = this.getTwoPoints(timeErs[0], datetimeErs[0], this.config.timeParser, this.config.dateTimeParser, referenceTime);
                endHasDate = true;
            }
        }
        else if (datetimeErs.length === 1 && timeErs.length === 1) {
            if (timeErs[0].start < datetimeErs[0].start) {
                prs = this.getTwoPoints(timeErs[0], datetimeErs[0], this.config.timeParser, this.config.dateTimeParser, referenceTime);
                endHasDate = true;
            }
            else {
                prs = this.getTwoPoints(datetimeErs[0], timeErs[0], this.config.dateTimeParser, this.config.timeParser, referenceTime);
                beginHasDate = true;
            }
        }
        if (!prs || !prs.begin.value || !prs.end.value)
            return result;
        let futureBegin = prs.begin.value.futureValue;
        let futureEnd = prs.end.value.futureValue;
        let pastBegin = prs.begin.value.pastValue;
        let pastEnd = prs.end.value.pastValue;
        if (futureBegin.getTime() > futureEnd.getTime())
            futureBegin = pastBegin;
        if (pastEnd.getTime() < pastBegin.getTime())
            pastEnd = futureEnd;
        let rightTime = utilities_1.DateUtils.safeCreateFromMinValueWithDateAndTime(referenceTime);
        let leftTime = utilities_1.DateUtils.safeCreateFromMinValueWithDateAndTime(referenceTime);
        if (bothHasDate) {
            rightTime = utilities_1.DateUtils.safeCreateFromMinValueWithDateAndTime(futureEnd);
            leftTime = utilities_1.DateUtils.safeCreateFromMinValueWithDateAndTime(futureBegin);
        }
        else if (beginHasDate) {
            // TODO: Handle "明天下午两点到五点"
            futureEnd = utilities_1.DateUtils.safeCreateFromMinValueWithDateAndTime(futureBegin, futureEnd);
            pastEnd = utilities_1.DateUtils.safeCreateFromMinValueWithDateAndTime(pastBegin, pastEnd);
            leftTime = utilities_1.DateUtils.safeCreateFromMinValueWithDateAndTime(futureBegin);
        }
        else if (endHasDate) {
            // TODO: Handle "明天下午两点到五点"
            futureBegin = utilities_1.DateUtils.safeCreateFromMinValueWithDateAndTime(futureEnd, futureBegin);
            pastBegin = utilities_1.DateUtils.safeCreateFromMinValueWithDateAndTime(pastEnd, pastBegin);
            rightTime = utilities_1.DateUtils.safeCreateFromMinValueWithDateAndTime(futureEnd);
        }
        let leftResult = prs.begin.value;
        let rightResult = prs.end.value;
        let leftResultTime = leftResult.futureValue;
        let rightResultTime = rightResult.futureValue;
        leftTime = utilities_1.DateUtils.addTime(leftTime, leftResultTime);
        rightTime = utilities_1.DateUtils.addTime(rightTime, rightResultTime);
        // the right side time contains "ampm", while the left side doesn't
        if (rightResult.comment === 'ampm' && !leftResult.comment && rightTime.getTime() < leftTime.getTime()) {
            rightTime = utilities_1.DateUtils.addHours(rightTime, 12);
        }
        if (rightTime.getTime() < leftTime.getTime()) {
            rightTime = utilities_1.DateUtils.addDays(rightTime, 1);
        }
        result.futureValue = [leftTime, rightTime];
        result.pastValue = [leftTime, rightTime];
        let hasFuzzyTimex = prs.begin.timexStr.includes('X') || prs.end.timexStr.includes('X');
        let leftTimex = hasFuzzyTimex ? prs.begin.timexStr : utilities_1.FormatUtil.luisDateTime(leftTime);
        let rightTimex = hasFuzzyTimex ? prs.end.timexStr : utilities_1.FormatUtil.luisDateTime(rightTime);
        let hoursBetween = utilities_1.DateUtils.totalHours(rightTime, leftTime);
        result.timex = `(${leftTimex},${rightTimex},PT${hoursBetween}H)`;
        result.success = true;
        return result;
    }
    parseSpecificTimeOfDay(text, referenceTime) {
        let result = new utilities_1.DateTimeResolutionResult();
        let source = text.trim().toLowerCase();
        let match = recognizers_text_1.RegExpUtility.getMatches(this.config.specificTimeOfDayRegex, source).pop();
        if (match && match.index === 0 && match.length === source.length) {
            let values = this.config.getMatchedTimeRange(source);
            if (!values.success) {
                return result;
            }
            let swift = values.swift;
            let date = utilities_1.DateUtils.addDays(referenceTime, swift);
            date.setHours(0);
            date.setMinutes(0);
            date.setSeconds(0);
            result.timex = utilities_1.FormatUtil.formatDate(date) + values.timeStr;
            result.futureValue = [
                utilities_1.DateUtils.safeCreateFromMinValue(date.getFullYear(), date.getMonth(), date.getDate(), values.beginHour, 0, 0),
                utilities_1.DateUtils.safeCreateFromMinValue(date.getFullYear(), date.getMonth(), date.getDate(), values.endHour, values.endMin, values.endMin)
            ];
            result.pastValue = [
                utilities_1.DateUtils.safeCreateFromMinValue(date.getFullYear(), date.getMonth(), date.getDate(), values.beginHour, 0, 0),
                utilities_1.DateUtils.safeCreateFromMinValue(date.getFullYear(), date.getMonth(), date.getDate(), values.endHour, values.endMin, values.endMin)
            ];
            result.success = true;
            return result;
        }
        let beginHour = 0;
        let endHour = 0;
        let endMin = 0;
        let timeStr = '';
        // handle morning, afternoon..
        if (recognizers_text_1.RegExpUtility.isMatch(this.TMORegex, source)) {
            timeStr = 'TMO';
            beginHour = 8;
            endHour = 12;
        }
        else if (recognizers_text_1.RegExpUtility.isMatch(this.TAFRegex, source)) {
            timeStr = 'TAF';
            beginHour = 12;
            endHour = 16;
        }
        else if (recognizers_text_1.RegExpUtility.isMatch(this.TEVRegex, source)) {
            timeStr = 'TEV';
            beginHour = 16;
            endHour = 20;
        }
        else if (recognizers_text_1.RegExpUtility.isMatch(this.TNIRegex, source)) {
            timeStr = 'TNI';
            beginHour = 20;
            endHour = 23;
            endMin = 59;
        }
        else {
            return result;
        }
        // handle Date followed by morning, afternoon
        let timeMatch = recognizers_text_1.RegExpUtility.getMatches(this.timeOfDayRegex, source).pop();
        if (!timeMatch)
            return result;
        let beforeStr = source.substr(0, timeMatch.index).trim();
        let erDate = this.config.dateExtractor.extract(beforeStr, referenceTime).pop();
        if (!erDate || erDate.length !== beforeStr.length)
            return result;
        let prDate = this.config.dateParser.parse(erDate, referenceTime);
        let futureDate = prDate.value.futureValue;
        let pastDate = prDate.value.pastValue;
        result.timex = prDate.timexStr + timeStr;
        result.futureValue = [
            utilities_1.DateUtils.safeCreateFromMinValue(futureDate.getFullYear(), futureDate.getMonth(), futureDate.getDate(), beginHour, 0, 0),
            utilities_1.DateUtils.safeCreateFromMinValue(futureDate.getFullYear(), futureDate.getMonth(), futureDate.getDate(), endHour, endMin, endMin)
        ];
        result.pastValue = [
            utilities_1.DateUtils.safeCreateFromMinValue(pastDate.getFullYear(), pastDate.getMonth(), pastDate.getDate(), beginHour, 0, 0),
            utilities_1.DateUtils.safeCreateFromMinValue(pastDate.getFullYear(), pastDate.getMonth(), pastDate.getDate(), endHour, endMin, endMin)
        ];
        result.success = true;
        return result;
    }
    parseNumberWithUnit(text, referenceTime) {
        let result = new utilities_1.DateTimeResolutionResult();
        let ers = this.cardinalExtractor.extract(text);
        if (ers.length !== 1)
            return result;
        let er = ers[0];
        let pr = this.cardinalParser.parse(er);
        let sourceUnit = text.substr(er.start + er.length).trim().toLowerCase();
        if (sourceUnit.startsWith('个')) {
            sourceUnit = sourceUnit.substr(1);
        }
        let beforeStr = text.substr(0, er.start).trim().toLowerCase();
        return this.parseCommonDurationWithUnit(beforeStr, sourceUnit, pr.resolutionStr, pr.value, referenceTime);
    }
    parseDuration(text, referenceTime) {
        let result = new utilities_1.DateTimeResolutionResult();
        let match = recognizers_text_1.RegExpUtility.getMatches(this.config.relativeTimeUnitRegex, text).pop();
        if (!match)
            return result;
        let sourceUnit = match.groups('unit').value.toLowerCase();
        let beforeStr = text.substr(0, match.index).trim().toLowerCase();
        return this.parseCommonDurationWithUnit(beforeStr, sourceUnit, '1', 1, referenceTime);
    }
    parseCommonDurationWithUnit(beforeStr, sourceUnit, numStr, swift, referenceDate) {
        let result = new utilities_1.DateTimeResolutionResult();
        if (!this.config.unitMap.has(sourceUnit))
            return result;
        let unitStr = this.config.unitMap.get(sourceUnit);
        let pastMatch = recognizers_text_1.RegExpUtility.getMatches(this.config.pastRegex, beforeStr).pop();
        let hasPast = pastMatch && pastMatch.length === beforeStr.length;
        let futureMatch = recognizers_text_1.RegExpUtility.getMatches(this.config.futureRegex, beforeStr).pop();
        let hasFuture = futureMatch && futureMatch.length === beforeStr.length;
        if (!hasPast || !hasFuture)
            return result;
        let beginDate = new Date(referenceDate);
        let endDate = new Date(referenceDate);
        switch (unitStr) {
            case 'H':
                beginDate = hasPast ? utilities_1.DateUtils.addHours(beginDate, -swift) : beginDate;
                endDate = hasFuture ? utilities_1.DateUtils.addHours(endDate, swift) : endDate;
                break;
            case 'M':
                beginDate = hasPast ? utilities_1.DateUtils.addMinutes(beginDate, -swift) : beginDate;
                endDate = hasFuture ? utilities_1.DateUtils.addMinutes(endDate, swift) : endDate;
                break;
            case 'S':
                beginDate = hasPast ? utilities_1.DateUtils.addSeconds(beginDate, -swift) : beginDate;
                endDate = hasFuture ? utilities_1.DateUtils.addSeconds(endDate, swift) : endDate;
                break;
            default: return result;
        }
        let beginTimex = `${utilities_1.FormatUtil.luisDateFromDate(beginDate)}T${utilities_1.FormatUtil.luisTimeFromDate(beginDate)}`;
        let endTimex = `${utilities_1.FormatUtil.luisDateFromDate(endDate)}T${utilities_1.FormatUtil.luisTimeFromDate(endDate)}`;
        result.timex = `(${beginTimex},${endTimex},PT${numStr}${unitStr.charAt(0)})`;
        result.futureValue = [beginDate, endDate];
        result.pastValue = [beginDate, endDate];
        result.success = true;
        return result;
    }
}
exports.ChineseDateTimePeriodParser = ChineseDateTimePeriodParser;
//# sourceMappingURL=dateTimePeriodConfiguration.js.map