"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const recognizers_text_1 = require("recognizers-text");
const constants_1 = require("./constants");
const recognizers_text_number_1 = require("recognizers-text-number");
const utilities_1 = require("./utilities");
const isEqual = require("lodash.isequal");
const dateTimeRecognizer_1 = require("./dateTimeRecognizer");
class BaseMergedExtractor {
    constructor(config, options) {
        this.config = config;
        this.options = options;
    }
    extract(source, refDate) {
        if (!refDate)
            refDate = new Date();
        let referenceDate = refDate;
        let result = new Array();
        this.addTo(result, this.config.dateExtractor.extract(source, referenceDate), source);
        this.addTo(result, this.config.timeExtractor.extract(source, referenceDate), source);
        this.addTo(result, this.config.durationExtractor.extract(source, referenceDate), source);
        this.addTo(result, this.config.datePeriodExtractor.extract(source, referenceDate), source);
        this.addTo(result, this.config.dateTimeExtractor.extract(source, referenceDate), source);
        this.addTo(result, this.config.timePeriodExtractor.extract(source, referenceDate), source);
        this.addTo(result, this.config.dateTimePeriodExtractor.extract(source, referenceDate), source);
        this.addTo(result, this.config.setExtractor.extract(source, referenceDate), source);
        this.addTo(result, this.config.holidayExtractor.extract(source, referenceDate), source);
        // this should be at the end since if need the extractor to determine the previous text contains time or not
        this.addTo(result, this.numberEndingRegexMatch(source, result), source);
        this.addMod(result, source);
        //filtering
        if ((this.options & dateTimeRecognizer_1.DateTimeOptions.Calendar) != 0) {
            this.checkCalendarFilterList(result, source);
        }
        result = result.sort((a, b) => a.start - b.start);
        return result;
    }
    checkCalendarFilterList(ers, text) {
        for (let er of ers.reverse()) {
            for (let negRegex of this.config.filterWordRegexList) {
                var match = recognizers_text_number_1.RegExpUtility.getMatches(negRegex, er.text).pop();
                if (match) {
                    ers.splice(ers.indexOf(er));
                }
            }
        }
    }
    // handle cases like "move 3pm appointment to 4"
    numberEndingRegexMatch(text, extractResults) {
        let tokens = new Array();
        extractResults.forEach(extractResult => {
            if (extractResult.type === constants_1.Constants.SYS_DATETIME_TIME
                || extractResult.type === constants_1.Constants.SYS_DATETIME_DATETIME) {
                let stringAfter = text.substring(extractResult.start + extractResult.length);
                let match = recognizers_text_number_1.RegExpUtility.getMatches(this.config.numberEndingPattern, stringAfter);
                if (match != null && match.length) {
                    let newTime = match[0].groups("newTime");
                    let numRes = this.config.integerExtractor.extract(newTime.value);
                    if (numRes.length === 0) {
                        return;
                    }
                    let startPosition = extractResult.start + extractResult.length + newTime.index;
                    tokens.push(new utilities_1.Token(startPosition, startPosition + newTime.length));
                }
            }
        });
        return utilities_1.Token.mergeAllTokens(tokens, text, constants_1.Constants.SYS_DATETIME_TIME);
    }
    addTo(destination, source, text) {
        source.forEach(value => {
            if (this.options === dateTimeRecognizer_1.DateTimeOptions.SkipFromToMerge && this.shouldSkipFromMerge(value))
                return;
            let isFound = false;
            let overlapIndexes = new Array();
            let firstIndex = -1;
            destination.forEach((dest, index) => {
                if (recognizers_text_1.ExtractResult.isOverlap(dest, value)) {
                    isFound = true;
                    if (recognizers_text_1.ExtractResult.isCover(dest, value)) {
                        if (firstIndex === -1) {
                            firstIndex = index;
                        }
                        overlapIndexes.push(index);
                    }
                    else {
                        return;
                    }
                }
            });
            if (!isFound) {
                destination.push(value);
            }
            else if (overlapIndexes.length) {
                let tempDst = new Array();
                for (let i = 0; i < destination.length; i++) {
                    if (overlapIndexes.indexOf(i) === -1) {
                        tempDst.push(destination[i]);
                    }
                }
                // insert at the first overlap occurence to keep the order
                tempDst.splice(firstIndex, 0, value);
                destination.length = 0;
                destination.push.apply(destination, tempDst);
            }
        });
    }
    shouldSkipFromMerge(er) {
        return recognizers_text_number_1.RegExpUtility.getMatches(this.config.fromToRegex, er.text).length > 0;
    }
    filterAmbiguousSingleWord(er, text) {
        let matches = recognizers_text_number_1.RegExpUtility.getMatches(this.config.singleAmbiguousMonthRegex, er.text.toLowerCase());
        if (matches.length) {
            let stringBefore = text.substring(0, er.start).replace(/\s+$/, '');
            matches = recognizers_text_number_1.RegExpUtility.getMatches(this.config.prepositionSuffixRegex, stringBefore);
            if (!matches.length) {
                return true;
            }
        }
        return false;
    }
    addMod(ers, source) {
        let lastEnd = 0;
        ers.forEach(er => {
            let beforeStr = source.substr(lastEnd, er.start).toLowerCase();
            let before = this.hasTokenIndex(beforeStr.trim(), this.config.beforeRegex);
            if (before.matched) {
                let modLength = beforeStr.length - before.index;
                er.length += modLength;
                er.start -= modLength;
                er.text = source.substr(er.start, er.length);
            }
            let after = this.hasTokenIndex(beforeStr.trim(), this.config.afterRegex);
            if (after.matched) {
                let modLength = beforeStr.length - after.index;
                er.length += modLength;
                er.start -= modLength;
                er.text = source.substr(er.start, er.length);
            }
            let since = this.hasTokenIndex(beforeStr.trim(), this.config.sinceRegex);
            if (since.matched) {
                let modLength = beforeStr.length - since.index;
                er.length += modLength;
                er.start -= modLength;
                er.text = source.substr(er.start, er.length);
            }
        });
    }
    hasTokenIndex(source, regex) {
        let result = { matched: false, index: -1 };
        let match = recognizers_text_number_1.RegExpUtility.getMatches(regex, source).pop();
        if (match) {
            result.matched = true;
            result.index = match.index;
        }
        return result;
    }
}
exports.BaseMergedExtractor = BaseMergedExtractor;
class BaseMergedParser {
    constructor(config, options) {
        this.parserTypeName = 'datetimeV2';
        this.dateMinValue = utilities_1.FormatUtil.formatDate(utilities_1.DateUtils.minValue());
        this.dateTimeMinValue = utilities_1.FormatUtil.formatDateTime(utilities_1.DateUtils.minValue());
        this.config = config;
        this.options = options;
    }
    parse(er, refTime) {
        let referenceTime = refTime || new Date();
        let pr = null;
        // push, save teh MOD string
        let hasBefore = false;
        let hasAfter = false;
        let hasSince = false;
        let modStr = "";
        let beforeMatch = recognizers_text_number_1.RegExpUtility.getMatches(this.config.beforeRegex, er.text).shift();
        let afterMatch = recognizers_text_number_1.RegExpUtility.getMatches(this.config.afterRegex, er.text).shift();
        let sinceMatch = recognizers_text_number_1.RegExpUtility.getMatches(this.config.sinceRegex, er.text).shift();
        if (beforeMatch && beforeMatch.index === 0) {
            hasBefore = true;
            er.start += beforeMatch.length;
            er.length -= beforeMatch.length;
            er.text = er.text.substring(beforeMatch.length);
            modStr = beforeMatch.value;
        }
        else if (afterMatch && afterMatch.index === 0) {
            hasAfter = true;
            er.start += afterMatch.length;
            er.length -= afterMatch.length;
            er.text = er.text.substring(afterMatch.length);
            modStr = afterMatch.value;
        }
        else if (sinceMatch && sinceMatch.index === 0) {
            hasSince = true;
            er.start += sinceMatch.length;
            er.length -= sinceMatch.length;
            er.text = er.text.substring(sinceMatch.length);
            modStr = sinceMatch.value;
        }
        if (er.type === constants_1.Constants.SYS_DATETIME_DATE) {
            pr = this.config.dateParser.parse(er, referenceTime);
            if (pr.value === null || pr.value === undefined) {
                pr = this.config.holidayParser.parse(er, referenceTime);
            }
        }
        else if (er.type === constants_1.Constants.SYS_DATETIME_TIME) {
            pr = this.config.timeParser.parse(er, referenceTime);
        }
        else if (er.type === constants_1.Constants.SYS_DATETIME_DATETIME) {
            pr = this.config.dateTimeParser.parse(er, referenceTime);
        }
        else if (er.type === constants_1.Constants.SYS_DATETIME_DATEPERIOD) {
            pr = this.config.datePeriodParser.parse(er, referenceTime);
        }
        else if (er.type === constants_1.Constants.SYS_DATETIME_TIMEPERIOD) {
            pr = this.config.timePeriodParser.parse(er, referenceTime);
        }
        else if (er.type === constants_1.Constants.SYS_DATETIME_DATETIMEPERIOD) {
            pr = this.config.dateTimePeriodParser.parse(er, referenceTime);
        }
        else if (er.type === constants_1.Constants.SYS_DATETIME_DURATION) {
            pr = this.config.durationParser.parse(er, referenceTime);
        }
        else if (er.type === constants_1.Constants.SYS_DATETIME_SET) {
            pr = this.config.setParser.parse(er, referenceTime);
        }
        else {
            return null;
        }
        // pop, restore the MOD string
        if (hasBefore && pr.value !== null) {
            pr.length += modStr.length;
            pr.start -= modStr.length;
            pr.text = modStr + pr.text;
            let val = pr.value;
            val.mod = constants_1.TimeTypeConstants.beforeMod;
            pr.value = val;
        }
        if (hasAfter && pr.value !== null) {
            pr.length += modStr.length;
            pr.start -= modStr.length;
            pr.text = modStr + pr.text;
            let val = pr.value;
            val.mod = constants_1.TimeTypeConstants.afterMod;
            pr.value = val;
        }
        if (hasSince && pr.value !== null) {
            pr.length += modStr.length;
            pr.start -= modStr.length;
            pr.text = modStr + pr.text;
            let val = pr.value;
            val.mod = constants_1.TimeTypeConstants.sinceMod;
            pr.value = val;
        }
        if ((this.options & dateTimeRecognizer_1.DateTimeOptions.SplitDateAndTime) === dateTimeRecognizer_1.DateTimeOptions.SplitDateAndTime
            && pr.value && pr.value.subDateTimeEntities != null) {
            pr.value = this.dateTimeResolutionForSplit(pr);
        }
        else {
            pr = this.setParseResult(pr, hasBefore, hasAfter, hasSince);
        }
        return pr;
    }
    setParseResult(slot, hasBefore, hasAfter, hasSince) {
        slot.value = this.dateTimeResolution(slot, hasBefore, hasAfter, hasSince);
        // change the type at last for the after or before mode
        slot.type = `${this.parserTypeName}.${this.determineDateTimeType(slot.type, hasBefore, hasAfter, hasSince)}`;
        return slot;
    }
    getParseResult(extractorResult, referenceDate) {
        let extractorType = extractorResult.type;
        if (extractorType === constants_1.Constants.SYS_DATETIME_DATE) {
            let pr = this.config.dateParser.parse(extractorResult, referenceDate);
            if (!pr || !pr.value)
                return this.config.holidayParser.parse(extractorResult, referenceDate);
            return pr;
        }
        if (extractorType === constants_1.Constants.SYS_DATETIME_TIME) {
            return this.config.timeParser.parse(extractorResult, referenceDate);
        }
        if (extractorType === constants_1.Constants.SYS_DATETIME_DATETIME) {
            return this.config.dateTimeParser.parse(extractorResult, referenceDate);
        }
        if (extractorType === constants_1.Constants.SYS_DATETIME_DATEPERIOD) {
            return this.config.datePeriodParser.parse(extractorResult, referenceDate);
        }
        if (extractorType === constants_1.Constants.SYS_DATETIME_TIMEPERIOD) {
            return this.config.timePeriodParser.parse(extractorResult, referenceDate);
        }
        if (extractorType === constants_1.Constants.SYS_DATETIME_DATETIMEPERIOD) {
            return this.config.dateTimePeriodParser.parse(extractorResult, referenceDate);
        }
        if (extractorType === constants_1.Constants.SYS_DATETIME_DURATION) {
            return this.config.durationParser.parse(extractorResult, referenceDate);
        }
        if (extractorType === constants_1.Constants.SYS_DATETIME_SET) {
            return this.config.setParser.parse(extractorResult, referenceDate);
        }
        return null;
    }
    determineDateTimeType(type, hasBefore, hasAfter, hasSince) {
        if ((this.options & dateTimeRecognizer_1.DateTimeOptions.SplitDateAndTime) === dateTimeRecognizer_1.DateTimeOptions.SplitDateAndTime) {
            if (type === constants_1.Constants.SYS_DATETIME_DATETIME) {
                return constants_1.Constants.SYS_DATETIME_TIME;
            }
        }
        else {
            if (hasBefore || hasAfter || hasSince) {
                if (type === constants_1.Constants.SYS_DATETIME_DATE)
                    return constants_1.Constants.SYS_DATETIME_DATEPERIOD;
                if (type === constants_1.Constants.SYS_DATETIME_TIME)
                    return constants_1.Constants.SYS_DATETIME_TIMEPERIOD;
                if (type === constants_1.Constants.SYS_DATETIME_DATETIME)
                    return constants_1.Constants.SYS_DATETIME_DATETIMEPERIOD;
            }
        }
        return type;
    }
    dateTimeResolutionForSplit(slot) {
        let results = new Array();
        if (slot.value.subDateTimeEntities != null) {
            let subEntities = slot.value.subDateTimeEntities;
            for (let subEntity of subEntities) {
                let result = subEntity;
                results.push(...this.dateTimeResolutionForSplit(result));
            }
        }
        else {
            slot.value = this.dateTimeResolution(slot, false, false, false);
            slot.type = `${this.parserTypeName}.${this.determineDateTimeType(slot.type, false, false, false)}`;
            results.push(slot);
        }
        return results;
    }
    dateTimeResolution(slot, hasBefore, hasAfter, hasSince) {
        if (!slot)
            return null;
        let result = new Map();
        let resolutions = new Array();
        let type = slot.type;
        let outputType = this.determineDateTimeType(type, hasBefore, hasAfter, hasSince);
        let timex = slot.timexStr;
        let value = slot.value;
        if (!value)
            return null;
        let isLunar = value.isLunar;
        let mod = value.mod;
        let comment = value.comment;
        // the following should added to res first since the ResolveAmPm is using these fields
        this.addResolutionFieldsAny(result, constants_1.Constants.TimexKey, timex);
        this.addResolutionFieldsAny(result, constants_1.Constants.CommentKey, comment);
        this.addResolutionFieldsAny(result, constants_1.Constants.ModKey, mod);
        this.addResolutionFieldsAny(result, constants_1.Constants.TypeKey, outputType);
        this.addResolutionFieldsAny(result, constants_1.Constants.IsLunarKey, isLunar ? String(isLunar) : "");
        let futureResolution = value.futureResolution;
        let pastResolution = value.pastResolution;
        let future = this.generateFromResolution(type, futureResolution, mod);
        let past = this.generateFromResolution(type, pastResolution, mod);
        let futureValues = Array.from(this.getValues(future)).sort();
        let pastValues = Array.from(this.getValues(past)).sort();
        if (isEqual(futureValues, pastValues)) {
            if (pastValues.length > 0)
                this.addResolutionFieldsAny(result, constants_1.Constants.ResolveKey, past);
        }
        else {
            if (pastValues.length > 0)
                this.addResolutionFieldsAny(result, constants_1.Constants.ResolveToPastKey, past);
            if (futureValues.length > 0)
                this.addResolutionFieldsAny(result, constants_1.Constants.ResolveToFutureKey, future);
        }
        if (comment && comment === 'ampm') {
            if (result.has('resolve')) {
                this.resolveAMPM(result, 'resolve');
            }
            else {
                this.resolveAMPM(result, 'resolveToPast');
                this.resolveAMPM(result, 'resolveToFuture');
            }
        }
        result.forEach((value, key) => {
            if (this.isObject(value)) {
                // is "StringMap"
                let newValues = {};
                this.addResolutionFields(newValues, constants_1.Constants.TimexKey, timex);
                this.addResolutionFields(newValues, constants_1.Constants.ModKey, mod);
                this.addResolutionFields(newValues, constants_1.Constants.TypeKey, outputType);
                this.addResolutionFields(newValues, constants_1.Constants.IsLunarKey, isLunar ? String(isLunar) : "");
                Object.keys(value).forEach((innerKey) => {
                    newValues[innerKey] = value[innerKey];
                });
                resolutions.push(newValues);
            }
        });
        if (Object.keys(past).length === 0 && Object.keys(future).length === 0) {
            let o = {};
            o['timex'] = timex;
            o['type'] = outputType;
            o['value'] = 'not resolved';
            resolutions.push(o);
        }
        return {
            values: resolutions
        };
    }
    isObject(o) {
        return (!!o) && (o.constructor === Object);
    }
    addResolutionFieldsAny(dic, key, value) {
        if (value instanceof String) {
            if (!recognizers_text_number_1.StringUtility.isNullOrEmpty(value)) {
                dic.set(key, value);
            }
        }
        else {
            dic.set(key, value);
        }
    }
    addResolutionFields(dic, key, value) {
        if (!recognizers_text_number_1.StringUtility.isNullOrEmpty(value)) {
            dic[key] = value;
        }
    }
    generateFromResolution(type, resolutions, mod) {
        let result = {};
        switch (type) {
            case constants_1.Constants.SYS_DATETIME_DATETIME:
                this.addSingleDateTimeToResolution(resolutions, constants_1.TimeTypeConstants.DATETIME, mod, result);
                break;
            case constants_1.Constants.SYS_DATETIME_TIME:
                this.addSingleDateTimeToResolution(resolutions, constants_1.TimeTypeConstants.TIME, mod, result);
                break;
            case constants_1.Constants.SYS_DATETIME_DATE:
                this.addSingleDateTimeToResolution(resolutions, constants_1.TimeTypeConstants.DATE, mod, result);
                break;
            case constants_1.Constants.SYS_DATETIME_DURATION:
                if (resolutions.hasOwnProperty(constants_1.TimeTypeConstants.DURATION)) {
                    result[constants_1.TimeTypeConstants.VALUE] = resolutions[constants_1.TimeTypeConstants.DURATION];
                }
                break;
            case constants_1.Constants.SYS_DATETIME_TIMEPERIOD:
                this.addPeriodToResolution(resolutions, constants_1.TimeTypeConstants.START_TIME, constants_1.TimeTypeConstants.END_TIME, mod, result);
                break;
            case constants_1.Constants.SYS_DATETIME_DATEPERIOD:
                this.addPeriodToResolution(resolutions, constants_1.TimeTypeConstants.START_DATE, constants_1.TimeTypeConstants.END_DATE, mod, result);
                break;
            case constants_1.Constants.SYS_DATETIME_DATETIMEPERIOD:
                this.addPeriodToResolution(resolutions, constants_1.TimeTypeConstants.START_DATETIME, constants_1.TimeTypeConstants.END_DATETIME, mod, result);
                break;
        }
        return result;
    }
    addSingleDateTimeToResolution(resolutions, type, mod, result) {
        let key = constants_1.TimeTypeConstants.VALUE;
        let value = resolutions[type];
        if (!value || this.dateMinValue === value || this.dateTimeMinValue === value)
            return;
        if (!recognizers_text_number_1.StringUtility.isNullOrEmpty(mod)) {
            if (mod === constants_1.TimeTypeConstants.beforeMod) {
                key = constants_1.TimeTypeConstants.END;
            }
            else if (mod === constants_1.TimeTypeConstants.afterMod) {
                key = constants_1.TimeTypeConstants.START;
            }
            else if (mod === constants_1.TimeTypeConstants.sinceMod) {
                key = constants_1.TimeTypeConstants.START;
            }
        }
        result[key] = value;
    }
    addPeriodToResolution(resolutions, startType, endType, mod, result) {
        let start = resolutions[startType];
        let end = resolutions[endType];
        if (!recognizers_text_number_1.StringUtility.isNullOrEmpty(mod)) {
            if (mod === constants_1.TimeTypeConstants.beforeMod) {
                result[constants_1.TimeTypeConstants.END] = start;
                return;
            }
            if (mod === constants_1.TimeTypeConstants.afterMod) {
                result[constants_1.TimeTypeConstants.START] = end;
                return;
            }
            if (mod === constants_1.TimeTypeConstants.sinceMod) {
                result[constants_1.TimeTypeConstants.START] = start;
                return;
            }
        }
        if (recognizers_text_number_1.StringUtility.isNullOrEmpty(start) || recognizers_text_number_1.StringUtility.isNullOrEmpty(end))
            return;
        result[constants_1.TimeTypeConstants.START] = start;
        result[constants_1.TimeTypeConstants.END] = end;
    }
    getValues(obj) {
        return Object.keys(obj).map(key => obj[key]);
    }
    resolveAMPM(valuesMap, keyName) {
        if (!valuesMap.has(keyName))
            return;
        let resolution = valuesMap.get(keyName);
        if (!valuesMap.has('timex'))
            return;
        let timex = valuesMap.get('timex');
        valuesMap.delete(keyName);
        valuesMap.set(keyName + 'Am', resolution);
        let resolutionPm = {};
        switch (valuesMap.get('type')) {
            case constants_1.Constants.SYS_DATETIME_TIME:
                resolutionPm[constants_1.TimeTypeConstants.VALUE] = utilities_1.FormatUtil.toPm(resolution[constants_1.TimeTypeConstants.VALUE]);
                resolutionPm['timex'] = utilities_1.FormatUtil.toPm(timex);
                break;
            case constants_1.Constants.SYS_DATETIME_DATETIME:
                let splitValue = resolution[constants_1.TimeTypeConstants.VALUE].split(' ');
                resolutionPm[constants_1.TimeTypeConstants.VALUE] = `${splitValue[0]} ${utilities_1.FormatUtil.toPm(splitValue[1])}`;
                resolutionPm['timex'] = utilities_1.FormatUtil.allStringToPm(timex);
                break;
            case constants_1.Constants.SYS_DATETIME_TIMEPERIOD:
                if (resolution.hasOwnProperty(constants_1.TimeTypeConstants.START))
                    resolutionPm[constants_1.TimeTypeConstants.START] = utilities_1.FormatUtil.toPm(resolution[constants_1.TimeTypeConstants.START]);
                if (resolution.hasOwnProperty(constants_1.TimeTypeConstants.END))
                    resolutionPm[constants_1.TimeTypeConstants.END] = utilities_1.FormatUtil.toPm(resolution[constants_1.TimeTypeConstants.END]);
                resolutionPm['timex'] = utilities_1.FormatUtil.allStringToPm(timex);
                break;
            case constants_1.Constants.SYS_DATETIME_DATETIMEPERIOD:
                if (resolution.hasOwnProperty(constants_1.TimeTypeConstants.START)) {
                    let splitValue = resolution[constants_1.TimeTypeConstants.START].split(' ');
                    resolutionPm[constants_1.TimeTypeConstants.START] = `${splitValue[0]} ${utilities_1.FormatUtil.toPm(splitValue[1])}`;
                }
                if (resolution.hasOwnProperty(constants_1.TimeTypeConstants.END)) {
                    let splitValue = resolution[constants_1.TimeTypeConstants.END].split(' ');
                    resolutionPm[constants_1.TimeTypeConstants.END] = `${splitValue[0]} ${utilities_1.FormatUtil.toPm(splitValue[1])}`;
                }
                resolutionPm['timex'] = utilities_1.FormatUtil.allStringToPm(timex);
                break;
        }
        valuesMap.set(keyName + 'Pm', resolutionPm);
    }
}
exports.BaseMergedParser = BaseMergedParser;
//# sourceMappingURL=baseMerged.js.map