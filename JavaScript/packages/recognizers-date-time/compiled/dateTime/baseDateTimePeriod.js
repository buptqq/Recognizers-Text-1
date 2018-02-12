"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const recognizers_text_1 = require("recognizers-text");
const constants_1 = require("./constants");
const parsers_1 = require("./parsers");
const utilities_1 = require("./utilities");
class BaseDateTimePeriodExtractor {
    constructor(config) {
        this.extractorName = constants_1.Constants.SYS_DATETIME_DATETIMEPERIOD;
        this.config = config;
    }
    extract(source, refDate) {
        if (!refDate)
            refDate = new Date();
        let referenceDate = refDate;
        let tokens = new Array()
            .concat(this.matchSimpleCases(source, referenceDate))
            .concat(this.mergeTwoTimePoints(source, referenceDate))
            .concat(this.matchDuration(source, referenceDate))
            .concat(this.matchNight(source, referenceDate))
            .concat(this.matchRelativeUnit(source));
        let result = utilities_1.Token.mergeAllTokens(tokens, source, this.extractorName);
        return result;
    }
    matchSimpleCases(source, refDate) {
        let tokens = new Array();
        this.config.simpleCasesRegexes.forEach(regexp => {
            recognizers_text_1.RegExpUtility.getMatches(regexp, source).forEach(match => {
                // has a date before?
                let hasBeforeDate = false;
                let beforeStr = source.substr(0, match.index);
                if (!recognizers_text_1.StringUtility.isNullOrWhitespace(beforeStr)) {
                    let ers = this.config.singleDateExtractor.extract(beforeStr, refDate);
                    if (ers && ers.length > 0) {
                        let er = ers[0];
                        let begin = er.start;
                        let end = er.start + er.length;
                        let middleStr = beforeStr.substr(begin + er.length).trim().toLowerCase();
                        if (recognizers_text_1.StringUtility.isNullOrWhitespace(middleStr) || recognizers_text_1.RegExpUtility.getMatches(this.config.prepositionRegex, middleStr).length > 0) {
                            tokens.push(new utilities_1.Token(begin, match.index + match.length));
                            hasBeforeDate = true;
                        }
                    }
                }
                let followedStr = source.substr(match.index + match.length);
                if (!recognizers_text_1.StringUtility.isNullOrWhitespace(followedStr) && !hasBeforeDate) {
                    let ers = this.config.singleDateExtractor.extract(followedStr, refDate);
                    if (ers && ers.length > 0) {
                        let er = ers[0];
                        let begin = er.start;
                        let end = er.start + er.length;
                        let middleStr = followedStr.substr(0, begin).trim().toLowerCase();
                        if (recognizers_text_1.StringUtility.isNullOrWhitespace(middleStr) || recognizers_text_1.RegExpUtility.getMatches(this.config.prepositionRegex, middleStr).length > 0) {
                            tokens.push(new utilities_1.Token(match.index, match.index + match.length + end));
                        }
                    }
                }
            });
        });
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
                let matchFrom = this.config.getFromTokenIndex(beforeStr);
                let fromTokenIndex = matchFrom.matched ? matchFrom : this.config.getBetweenTokenIndex(beforeStr);
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
                let beforeStr = source.substr(0, periodBegin).trim().toLowerCase();
                let betweenTokenIndex = this.config.getBetweenTokenIndex(beforeStr);
                if (betweenTokenIndex.matched) {
                    periodBegin = betweenTokenIndex.index;
                    tokens.push(new utilities_1.Token(periodBegin, periodEnd));
                    idx += 2;
                    continue;
                }
            }
            idx++;
        }
        ;
        return tokens;
    }
    matchDuration(source, refDate) {
        let tokens = new Array();
        let durations = new Array();
        this.config.durationExtractor.extract(source, refDate).forEach(duration => {
            let match = recognizers_text_1.RegExpUtility.getMatches(this.config.timeUnitRegex, duration.text).pop();
            if (match) {
                durations.push(new utilities_1.Token(duration.start, duration.start + duration.length));
            }
        });
        durations.forEach(duration => {
            let beforeStr = source.substr(0, duration.start).toLowerCase();
            if (recognizers_text_1.StringUtility.isNullOrWhitespace(beforeStr))
                return;
            let match = recognizers_text_1.RegExpUtility.getMatches(this.config.pastPrefixRegex, beforeStr).pop();
            if (match && recognizers_text_1.StringUtility.isNullOrWhitespace(beforeStr.substr(match.index + match.length))) {
                tokens.push(new utilities_1.Token(match.index, duration.end));
                return;
            }
            match = recognizers_text_1.RegExpUtility.getMatches(this.config.nextPrefixRegex, beforeStr).pop();
            if (match && recognizers_text_1.StringUtility.isNullOrWhitespace(beforeStr.substr(match.index + match.length))) {
                tokens.push(new utilities_1.Token(match.index, duration.end));
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
            let match = recognizers_text_1.RegExpUtility.getMatches(this.config.periodTimeOfDayWithDateRegex, afterStr).pop();
            if (match) {
                if (recognizers_text_1.StringUtility.isNullOrWhitespace(afterStr.substr(0, match.index))) {
                    tokens.push(new utilities_1.Token(er.start, er.start + er.length + match.index + match.length));
                }
                else {
                    let pauseMatch = recognizers_text_1.RegExpUtility.getMatches(this.config.middlePauseRegex, afterStr.substr(0, match.index)).pop();
                    if (pauseMatch) {
                        // TODO: should use trimStart() instead?
                        let suffix = afterStr.substr(match.index + match.length).trim();
                        let endingMatch = recognizers_text_1.RegExpUtility.getMatches(this.config.generalEndingRegex, suffix).pop();
                        if (endingMatch) {
                            tokens.push(new utilities_1.Token(er.start || 0, er.start + er.length + match.index + match.length || 0));
                        }
                    }
                }
            }
            let beforeStr = source.substr(0, er.start);
            match = recognizers_text_1.RegExpUtility.getMatches(this.config.periodTimeOfDayWithDateRegex, beforeStr).pop();
            if (match) {
                if (recognizers_text_1.StringUtility.isNullOrWhitespace(beforeStr.substr(match.index + match.length))) {
                    let middleStr = source.substr(match.index + match.length, er.start - match.index - match.length);
                    if (recognizers_text_1.StringUtility.isWhitespace(middleStr)) {
                        tokens.push(new utilities_1.Token(match.index, er.start + er.length));
                    }
                }
                else {
                    let pauseMatch = recognizers_text_1.RegExpUtility.getMatches(this.config.middlePauseRegex, beforeStr.substr(match.index + match.length)).pop();
                    if (pauseMatch) {
                        // TODO: should use trimStart() instead?
                        let suffix = source.substr(er.start + er.length || 0).trim();
                        let endingMatch = recognizers_text_1.RegExpUtility.getMatches(this.config.generalEndingRegex, suffix).pop();
                        if (endingMatch) {
                            tokens.push(new utilities_1.Token(match.index, er.start + er.length || 0));
                        }
                    }
                }
            }
            // check whether there are adjacent time period strings, before or after
            for (let e of tokens) {
                // try to extract a time period in before-string 
                if (e.start > 0) {
                    let beforeStr = source.substr(0, e.start);
                    if (!recognizers_text_1.StringUtility.isNullOrWhitespace(beforeStr)) {
                        let timeErs = this.config.timePeriodExtractor.extract(beforeStr);
                        if (timeErs.length > 0) {
                            for (let tp of timeErs) {
                                var midStr = beforeStr.substr(tp.start + tp.length || 0);
                                if (recognizers_text_1.StringUtility.isNullOrWhitespace(midStr)) {
                                    tokens.push(new utilities_1.Token(tp.start || 0, tp.start + tp.length + midStr.length + e.length || 0));
                                }
                            }
                        }
                    }
                }
                // try to extract a time period in after-string
                if (e.start + e.length <= source.length) {
                    let afterStr = source.substr(e.start + e.length);
                    if (!recognizers_text_1.StringUtility.isNullOrWhitespace(afterStr)) {
                        let timeErs = this.config.timePeriodExtractor.extract(afterStr);
                        if (timeErs.length > 0) {
                            for (let tp of timeErs) {
                                var midStr = afterStr.substr(0, tp.start || 0);
                                if (recognizers_text_1.StringUtility.isNullOrWhitespace(midStr)) {
                                    tokens.push(new utilities_1.Token(e.start, e.start + e.length + midStr.length + tp.length || 0));
                                }
                            }
                        }
                    }
                }
            }
        });
        return tokens;
    }
    matchRelativeUnit(source) {
        let tokens = new Array();
        let matches = recognizers_text_1.RegExpUtility.getMatches(this.config.relativeTimeUnitRegex, source);
        if (matches.length === 0) {
            matches = recognizers_text_1.RegExpUtility.getMatches(this.config.restOfDateTimeRegex, source);
        }
        matches.forEach(match => {
            tokens.push(new utilities_1.Token(match.index, match.index + match.length));
        });
        return tokens;
    }
}
exports.BaseDateTimePeriodExtractor = BaseDateTimePeriodExtractor;
class BaseDateTimePeriodParser {
    constructor(config) {
        this.parserName = constants_1.Constants.SYS_DATETIME_DATETIMEPERIOD;
        this.config = config;
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
                innerResult = this.parseDuration(source, referenceDate);
            }
            if (!innerResult.success) {
                innerResult = this.parseRelativeUnit(source, referenceDate);
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
        let ret = new utilities_1.DateTimeResolutionResult();
        let trimedText = text.trim().toLowerCase();
        let er = this.config.timePeriodExtractor.extract(trimedText, referenceTime);
        if (er.length !== 1) {
            return this.parseSimpleCases(text, referenceTime);
        }
        let timePeriodParseResult = this.config.timePeriodParser.parse(er[0]);
        let timePeriodResolutionResult = timePeriodParseResult.value;
        if (!timePeriodResolutionResult) {
            return this.parseSimpleCases(text, referenceTime);
        }
        let timePeriodTimex = timePeriodResolutionResult.timex;
        // if it is a range type timex
        if (!recognizers_text_1.StringUtility.isNullOrEmpty(timePeriodTimex)
            && timePeriodTimex.startsWith("(")) {
            let dateResult = this.config.dateExtractor.extract(trimedText.replace(er[0].text, ""), referenceTime);
            let dateStr = "";
            let futureTime;
            let pastTime;
            if (dateResult.length === 1 && trimedText.replace(er[0].text, "").trim() === dateResult[0].text) {
                let pr = this.config.dateParser.parse(dateResult[0], referenceTime);
                if (pr.value) {
                    futureTime = pr.value.futureValue;
                    pastTime = pr.value.pastValue;
                    dateStr = pr.timexStr;
                }
                else {
                    return this.parseSimpleCases(text, referenceTime);
                }
                timePeriodTimex = timePeriodTimex.replace("(", "").replace(")", "");
                let timePeriodTimexArray = timePeriodTimex.split(',');
                let timePeriodFutureValue = timePeriodResolutionResult.futureValue;
                let beginTime = timePeriodFutureValue.item1;
                let endTime = timePeriodFutureValue.item2;
                if (timePeriodTimexArray.length === 3) {
                    let beginStr = dateStr + timePeriodTimexArray[0];
                    let endStr = dateStr + timePeriodTimexArray[1];
                    ret.timex = `(${beginStr},${endStr},${timePeriodTimexArray[2]})`;
                    ret.futureValue = [
                        utilities_1.DateUtils.safeCreateFromMinValue(futureTime.getFullYear(), futureTime.getMonth(), futureTime.getDate(), beginTime.getHours(), beginTime.getMinutes(), beginTime.getSeconds()),
                        utilities_1.DateUtils.safeCreateFromMinValue(futureTime.getFullYear(), futureTime.getMonth(), futureTime.getDate(), endTime.getHours(), endTime.getMinutes(), endTime.getSeconds())
                    ];
                    ret.pastValue = [
                        utilities_1.DateUtils.safeCreateFromMinValue(pastTime.getFullYear(), pastTime.getMonth(), pastTime.getDate(), beginTime.getHours(), beginTime.getMinutes(), beginTime.getSeconds()),
                        utilities_1.DateUtils.safeCreateFromMinValue(pastTime.getFullYear(), pastTime.getMonth(), pastTime.getDate(), endTime.getHours(), endTime.getMinutes(), endTime.getSeconds())
                    ];
                    if (!recognizers_text_1.StringUtility.isNullOrEmpty(timePeriodResolutionResult.comment)
                        && timePeriodResolutionResult.comment === "ampm") {
                        ret.comment = "ampm";
                    }
                    ret.success = true;
                    ret.subDateTimeEntities = [pr, timePeriodParseResult];
                    return ret;
                }
            }
            else {
                return this.parseSimpleCases(text, referenceTime);
            }
        }
        return this.parseSimpleCases(text, referenceTime);
    }
    parseSimpleCases(source, referenceDate) {
        let result = new utilities_1.DateTimeResolutionResult();
        let match = recognizers_text_1.RegExpUtility.getMatches(this.config.pureNumberFromToRegex, source).pop();
        if (!match) {
            match = recognizers_text_1.RegExpUtility.getMatches(this.config.pureNumberBetweenAndRegex, source).pop();
        }
        if (!match || match.index !== 0)
            return result;
        let hourGroup = match.groups('hour');
        let beginHour = this.config.numbers.get(hourGroup.captures[0]) || Number.parseInt(hourGroup.captures[0], 10) || 0;
        let endHour = this.config.numbers.get(hourGroup.captures[1]) || Number.parseInt(hourGroup.captures[1], 10) || 0;
        let er = this.config.dateExtractor.extract(source.replace(match.value, ""), referenceDate).pop();
        if (!er)
            return result;
        let pr = this.config.dateParser.parse(er, referenceDate);
        if (!pr)
            return result;
        let dateResult = pr.value;
        let futureDate = dateResult.futureValue;
        let pastDate = dateResult.pastValue;
        let dateStr = pr.timexStr;
        let hasAm = false;
        let hasPm = false;
        let pmStr = match.groups('pm').value;
        let amStr = match.groups('am').value;
        let descStr = match.groups('desc').value;
        if (!recognizers_text_1.StringUtility.isNullOrEmpty(amStr) || descStr.startsWith('a')) {
            if (beginHour >= 12)
                beginHour -= 12;
            if (endHour >= 12)
                endHour -= 12;
            hasAm = true;
        }
        if (!recognizers_text_1.StringUtility.isNullOrEmpty(pmStr) || descStr.startsWith('p')) {
            if (beginHour < 12)
                beginHour += 12;
            if (endHour < 12)
                endHour += 12;
            hasPm = true;
        }
        if (!hasAm && !hasPm && beginHour <= 12 && endHour <= 12) {
            result.comment = "ampm";
        }
        let beginStr = `${dateStr}T${utilities_1.FormatUtil.toString(beginHour, 2)}`;
        let endStr = `${dateStr}T${utilities_1.FormatUtil.toString(endHour, 2)}`;
        result.timex = `(${beginStr},${endStr},PT${endHour - beginHour}H)`;
        result.futureValue = [
            utilities_1.DateUtils.safeCreateFromMinValue(futureDate.getFullYear(), futureDate.getMonth(), futureDate.getDate(), beginHour, 0, 0),
            utilities_1.DateUtils.safeCreateFromMinValue(futureDate.getFullYear(), futureDate.getMonth(), futureDate.getDate(), endHour, 0, 0)
        ];
        result.pastValue = [
            utilities_1.DateUtils.safeCreateFromMinValue(pastDate.getFullYear(), pastDate.getMonth(), pastDate.getDate(), beginHour, 0, 0),
            utilities_1.DateUtils.safeCreateFromMinValue(pastDate.getFullYear(), pastDate.getMonth(), pastDate.getDate(), endHour, 0, 0)
        ];
        result.success = true;
        return result;
    }
    mergeTwoTimePoints(source, referenceDate) {
        let result = new utilities_1.DateTimeResolutionResult();
        let prs;
        let timeErs = this.config.timeExtractor.extract(source, referenceDate);
        let datetimeErs = this.config.dateTimeExtractor.extract(source, referenceDate);
        let bothHasDate = false;
        let beginHasDate = false;
        let endHasDate = false;
        if (datetimeErs.length === 2) {
            prs = this.getTwoPoints(datetimeErs[0], datetimeErs[1], this.config.dateTimeParser, this.config.dateTimeParser, referenceDate);
            bothHasDate = true;
        }
        else if (datetimeErs.length === 1 && timeErs.length === 2) {
            if (recognizers_text_1.ExtractResult.isOverlap(datetimeErs[0], timeErs[0])) {
                prs = this.getTwoPoints(datetimeErs[0], timeErs[1], this.config.dateTimeParser, this.config.timeParser, referenceDate);
                beginHasDate = true;
            }
            else {
                prs = this.getTwoPoints(timeErs[0], datetimeErs[0], this.config.timeParser, this.config.dateTimeParser, referenceDate);
                endHasDate = true;
            }
        }
        else if (datetimeErs.length === 1 && timeErs.length === 1) {
            if (timeErs[0].start < datetimeErs[0].start) {
                prs = this.getTwoPoints(timeErs[0], datetimeErs[0], this.config.timeParser, this.config.dateTimeParser, referenceDate);
                endHasDate = true;
            }
            else {
                prs = this.getTwoPoints(datetimeErs[0], timeErs[0], this.config.dateTimeParser, this.config.timeParser, referenceDate);
                beginHasDate = true;
            }
        }
        if (!prs || !prs.begin.value || !prs.end.value)
            return result;
        let begin = prs.begin.value;
        let end = prs.end.value;
        let futureBegin = begin.futureValue;
        let futureEnd = end.futureValue;
        let pastBegin = begin.pastValue;
        let pastEnd = end.pastValue;
        if (bothHasDate) {
            if (futureBegin > futureEnd)
                futureBegin = pastBegin;
            if (pastEnd < pastBegin)
                pastEnd = futureEnd;
            result.timex = `(${prs.begin.timexStr},${prs.end.timexStr},PT${utilities_1.DateUtils.totalHours(futureEnd, futureBegin)}H)`;
        }
        else if (beginHasDate) {
            futureEnd = utilities_1.DateUtils.safeCreateFromMinValue(futureBegin.getFullYear(), futureBegin.getMonth(), futureBegin.getDate(), futureEnd.getHours(), futureEnd.getMinutes(), futureEnd.getSeconds());
            pastEnd = utilities_1.DateUtils.safeCreateFromMinValue(pastBegin.getFullYear(), pastBegin.getMonth(), pastBegin.getDate(), pastEnd.getHours(), pastEnd.getMinutes(), pastEnd.getSeconds());
            let dateStr = prs.begin.timexStr.split('T').pop();
            result.timex = `(${prs.begin.timexStr},${dateStr}${prs.end.timexStr},PT${utilities_1.DateUtils.totalHours(futureEnd, futureBegin)}H)`;
        }
        else if (endHasDate) {
            futureBegin = utilities_1.DateUtils.safeCreateFromMinValue(futureEnd.getFullYear(), futureEnd.getMonth(), futureEnd.getDate(), futureBegin.getHours(), futureBegin.getMinutes(), futureBegin.getSeconds());
            pastBegin = utilities_1.DateUtils.safeCreateFromMinValue(pastEnd.getFullYear(), pastEnd.getMonth(), pastEnd.getDate(), pastBegin.getHours(), pastBegin.getMinutes(), pastBegin.getSeconds());
            let dateStr = prs.end.timexStr.split('T')[0];
            result.timex = `(${dateStr}${prs.begin.timexStr},${prs.end.timexStr},PT${utilities_1.DateUtils.totalHours(futureEnd, futureBegin)}H)`;
        }
        if (!recognizers_text_1.StringUtility.isNullOrEmpty(begin.comment) && begin.comment.endsWith('ampm') && !recognizers_text_1.StringUtility.isNullOrEmpty(end.comment) && end.comment.endsWith('ampm')) {
            result.comment = 'ampm';
        }
        result.futureValue = [futureBegin, futureEnd];
        result.pastValue = [pastBegin, pastEnd];
        result.success = true;
        result.subDateTimeEntities = [prs.begin, prs.end];
        return result;
    }
    getTwoPoints(beginEr, endEr, beginParser, endParser, referenceDate) {
        let beginPr = beginParser.parse(beginEr, referenceDate);
        let endPr = endParser.parse(endEr, referenceDate);
        return { begin: beginPr, end: endPr };
    }
    parseSpecificTimeOfDay(source, referenceDate) {
        let result = new utilities_1.DateTimeResolutionResult();
        let timeText = source;
        let hasEarly = false;
        let hasLate = false;
        let match = recognizers_text_1.RegExpUtility.getMatches(this.config.periodTimeOfDayWithDateRegex, source).pop();
        if (match) {
            timeText = match.groups('timeOfDay').value;
            if (!recognizers_text_1.StringUtility.isNullOrEmpty(match.groups('early').value)) {
                hasEarly = true;
                result.comment = 'early';
            }
            else if (!recognizers_text_1.StringUtility.isNullOrEmpty(match.groups('late').value)) {
                hasLate = true;
                result.comment = 'late';
            }
        }
        let matched = this.config.getMatchedTimeRange(timeText);
        if (!matched || !matched.success)
            return result;
        if (hasEarly) {
            matched.endHour = matched.beginHour + 2;
            if (matched.endMin === 59)
                matched.endMin = 0;
        }
        else if (hasLate) {
            matched.beginHour += 2;
        }
        match = recognizers_text_1.RegExpUtility.getMatches(this.config.specificTimeOfDayRegex, source).pop();
        if (match && match.index === 0 && match.length === source.length) {
            let swift = this.config.getSwiftPrefix(source);
            let date = utilities_1.DateUtils.addDays(referenceDate, swift);
            result.timex = utilities_1.FormatUtil.formatDate(date) + matched.timeStr;
            result.futureValue = [
                utilities_1.DateUtils.safeCreateFromMinValue(date.getFullYear(), date.getMonth(), date.getDate(), matched.beginHour, 0, 0),
                utilities_1.DateUtils.safeCreateFromMinValue(date.getFullYear(), date.getMonth(), date.getDate(), matched.endHour, matched.endMin, matched.endMin),
            ];
            result.pastValue = [
                utilities_1.DateUtils.safeCreateFromMinValue(date.getFullYear(), date.getMonth(), date.getDate(), matched.beginHour, 0, 0),
                utilities_1.DateUtils.safeCreateFromMinValue(date.getFullYear(), date.getMonth(), date.getDate(), matched.endHour, matched.endMin, matched.endMin),
            ];
            result.success = true;
            return result;
        }
        match = recognizers_text_1.RegExpUtility.getMatches(this.config.periodTimeOfDayWithDateRegex, source).pop();
        if (!match)
            return result;
        let beforeStr = source.substr(0, match.index).trim();
        let afterStr = source.substr(match.index + match.length).trim();
        let ers = this.config.dateExtractor.extract(beforeStr, referenceDate);
        // eliminate time period, if any
        let timePeriodErs = this.config.timePeriodExtractor.extract(beforeStr);
        if (timePeriodErs.length > 0) {
            beforeStr = beforeStr.slice(timePeriodErs[0].start || 0, timePeriodErs[0].start + timePeriodErs[0].length || 0).trim();
        }
        else {
            timePeriodErs = this.config.timePeriodExtractor.extract(afterStr);
            if (timePeriodErs.length > 0) {
                afterStr = afterStr.slice(timePeriodErs[0].start || 0, timePeriodErs[0].start + timePeriodErs[0].length || 0).trim();
            }
        }
        if (ers.length === 0 || ers[0].length !== beforeStr.length) {
            let valid = false;
            if (ers.length > 0 && ers[0].start == 0) {
                var midStr = beforeStr.substr(ers[0].start + ers[0].length || 0);
                if (recognizers_text_1.StringUtility.isNullOrWhitespace(midStr.replace(',', ' '))) {
                    valid = true;
                }
            }
            if (!valid) {
                ers = this.config.dateExtractor.extract(afterStr);
                if (ers.length === 0 || ers[0].length !== afterStr.length) {
                    if (ers.length > 0 && ers[0].start + ers[0].length == afterStr.length) {
                        var midStr = afterStr.substr(0, ers[0].start || 0);
                        if (recognizers_text_1.StringUtility.isNullOrWhitespace(midStr.replace(',', ' '))) {
                            valid = true;
                        }
                    }
                }
                else {
                    valid = true;
                }
                if (!valid) {
                    return result;
                }
            }
        }
        var hasSpecificTimePeriod = false;
        if (timePeriodErs.length > 0) {
            var TimePr = this.config.timePeriodParser.parse(timePeriodErs[0]);
            if (TimePr != null) {
                var periodFuture = TimePr.value.futureValue;
                var periodPast = TimePr.value.pastValue;
                if (periodFuture == periodPast) {
                    matched.beginHour = periodFuture.item1.getHours();
                    matched.endHour = periodFuture.item2.getHours();
                }
                else {
                    if (periodFuture.item1.Hour >= matched.beginHour || periodFuture.item2.Hour <= matched.endHour) {
                        matched.beginHour = periodFuture.item1.getHours();
                        matched.endHour = periodFuture.item2.getHours();
                    }
                    else {
                        matched.beginHour = periodPast.item1.getHours();
                        matched.endHour = periodPast.item2.getHours();
                    }
                }
                hasSpecificTimePeriod = true;
            }
        }
        let pr = this.config.dateParser.parse(ers[0], referenceDate);
        if (!pr)
            return result;
        let futureDate = pr.value.futureValue;
        let pastDate = pr.value.pastValue;
        if (!hasSpecificTimePeriod) {
            result.timex = pr.timexStr + matched.timeStr;
        }
        else {
            result.timex = `${pr.timexStr}T${matched.beginHour},${pr.timexStr}T${matched.endHour},PT${matched.endHour - matched.beginHour}H`;
        }
        result.futureValue = [
            utilities_1.DateUtils.safeCreateFromMinValue(futureDate.getFullYear(), futureDate.getMonth(), futureDate.getDate(), matched.beginHour, 0, 0),
            utilities_1.DateUtils.safeCreateFromMinValue(futureDate.getFullYear(), futureDate.getMonth(), futureDate.getDate(), matched.endHour, matched.endMin, matched.endMin),
        ];
        result.pastValue = [
            utilities_1.DateUtils.safeCreateFromMinValue(pastDate.getFullYear(), pastDate.getMonth(), pastDate.getDate(), matched.beginHour, 0, 0),
            utilities_1.DateUtils.safeCreateFromMinValue(pastDate.getFullYear(), pastDate.getMonth(), pastDate.getDate(), matched.endHour, matched.endMin, matched.endMin),
        ];
        result.success = true;
        return result;
    }
    parseDuration(source, referenceDate) {
        let result = new utilities_1.DateTimeResolutionResult();
        // for rest of datetime, it will be handled in next function
        let restOfDateTimeMatch = recognizers_text_1.RegExpUtility.getMatches(this.config.restOfDateTimeRegex, source);
        if (restOfDateTimeMatch.length) {
            return result;
        }
        let ers = this.config.durationExtractor.extract(source, referenceDate);
        if (!ers || ers.length !== 1)
            return result;
        let pr = this.config.durationParser.parse(ers[0], referenceDate);
        if (!pr)
            return result;
        let beforeStr = source.substr(0, pr.start).trim();
        let durationResult = pr.value;
        let swiftSecond = 0;
        let mod;
        if (Number.isFinite(durationResult.pastValue) && Number.isFinite(durationResult.futureValue)) {
            swiftSecond = Math.round(durationResult.futureValue);
        }
        let beginTime = new Date(referenceDate);
        let endTime = new Date(referenceDate);
        let prefixMatch = recognizers_text_1.RegExpUtility.getMatches(this.config.pastRegex, beforeStr).pop();
        if (prefixMatch && prefixMatch.length === beforeStr.length) {
            mod = constants_1.TimeTypeConstants.beforeMod;
            beginTime.setSeconds(referenceDate.getSeconds() - swiftSecond);
        }
        prefixMatch = recognizers_text_1.RegExpUtility.getMatches(this.config.futureRegex, beforeStr).pop();
        if (prefixMatch && prefixMatch.length === beforeStr.length) {
            mod = constants_1.TimeTypeConstants.afterMod;
            endTime = new Date(beginTime);
            endTime.setSeconds(beginTime.getSeconds() + swiftSecond);
        }
        let luisDateBegin = utilities_1.FormatUtil.luisDateFromDate(beginTime);
        let luisTimeBegin = utilities_1.FormatUtil.luisTimeFromDate(beginTime);
        let luisDateEnd = utilities_1.FormatUtil.luisDateFromDate(endTime);
        let luisTimeEnd = utilities_1.FormatUtil.luisTimeFromDate(endTime);
        result.timex = `(${luisDateBegin}T${luisTimeBegin},${luisDateEnd}T${luisTimeEnd},${durationResult.timex})`;
        result.futureValue = [beginTime, endTime];
        result.pastValue = [beginTime, endTime];
        result.success = true;
        if (mod) {
            pr.value.mod = mod;
        }
        result.subDateTimeEntities = [pr];
        return result;
    }
    isFloat(value) {
        return Number.isFinite(value) && !Number.isInteger(value);
    }
    parseRelativeUnit(source, referenceDate) {
        let result = new utilities_1.DateTimeResolutionResult();
        let match = recognizers_text_1.RegExpUtility.getMatches(this.config.relativeTimeUnitRegex, source).pop();
        if (!match) {
            match = recognizers_text_1.RegExpUtility.getMatches(this.config.restOfDateTimeRegex, source).pop();
        }
        if (!match)
            return result;
        let srcUnit = match.groups('unit').value;
        let unitStr = this.config.unitMap.get(srcUnit);
        if (!unitStr)
            return result;
        let swift = 1;
        let prefixMatch = recognizers_text_1.RegExpUtility.getMatches(this.config.pastRegex, source).pop();
        if (prefixMatch)
            swift = -1;
        let beginTime = new Date(referenceDate);
        let endTime = new Date(referenceDate);
        let ptTimex = '';
        switch (unitStr) {
            case 'D':
                endTime = utilities_1.DateUtils.safeCreateFromMinValue(beginTime.getFullYear(), beginTime.getMonth(), beginTime.getDate());
                endTime.setDate(endTime.getDate() + 1);
                endTime.setSeconds(endTime.getSeconds() - 1);
                ptTimex = `PT${utilities_1.DateUtils.totalSeconds(endTime, beginTime)}S`;
                break;
            case 'H':
                beginTime.setHours(beginTime.getHours() + (swift > 0 ? 0 : swift));
                endTime.setHours(endTime.getHours() + (swift > 0 ? swift : 0));
                ptTimex = `PT1H`;
                break;
            case 'M':
                beginTime.setMinutes(beginTime.getMinutes() + (swift > 0 ? 0 : swift));
                endTime.setMinutes(endTime.getMinutes() + (swift > 0 ? swift : 0));
                ptTimex = `PT1M`;
                break;
            case 'S':
                beginTime.setSeconds(beginTime.getSeconds() + (swift > 0 ? 0 : swift));
                endTime.setSeconds(endTime.getSeconds() + (swift > 0 ? swift : 0));
                ptTimex = `PT1S`;
                break;
            default: return result;
        }
        let luisDateBegin = utilities_1.FormatUtil.luisDateFromDate(beginTime);
        let luisTimeBegin = utilities_1.FormatUtil.luisTimeFromDate(beginTime);
        let luisDateEnd = utilities_1.FormatUtil.luisDateFromDate(endTime);
        let luisTimeEnd = utilities_1.FormatUtil.luisTimeFromDate(endTime);
        result.timex = `(${luisDateBegin}T${luisTimeBegin},${luisDateEnd}T${luisTimeEnd},${ptTimex})`;
        result.futureValue = [beginTime, endTime];
        result.pastValue = [beginTime, endTime];
        result.success = true;
        return result;
    }
}
exports.BaseDateTimePeriodParser = BaseDateTimePeriodParser;
//# sourceMappingURL=baseDateTimePeriod.js.map