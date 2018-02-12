"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const baseMerged_1 = require("../baseMerged");
const baseHoliday_1 = require("../baseHoliday");
const recognizers_text_1 = require("recognizers-text");
const chineseDateTime_1 = require("../../resources/chineseDateTime");
const durationConfiguration_1 = require("./durationConfiguration");
const timeConfiguration_1 = require("./timeConfiguration");
const dateConfiguration_1 = require("./dateConfiguration");
const dateTimeConfiguration_1 = require("./dateTimeConfiguration");
const timePeriodConfiguration_1 = require("./timePeriodConfiguration");
const datePeriodConfiguration_1 = require("./datePeriodConfiguration");
const dateTimePeriodConfiguration_1 = require("./dateTimePeriodConfiguration");
const setConfiguration_1 = require("./setConfiguration");
const holidayConfiguration_1 = require("./holidayConfiguration");
const constants_1 = require("../constants");
const isEqual = require("lodash.isequal");
class ChineseMergedExtractorConfiguration {
    constructor() {
        this.dateExtractor = new dateConfiguration_1.ChineseDateExtractor();
        this.timeExtractor = new timeConfiguration_1.ChineseTimeExtractor();
        this.dateTimeExtractor = new dateTimeConfiguration_1.ChineseDateTimeExtractor();
        this.datePeriodExtractor = new datePeriodConfiguration_1.ChineseDatePeriodExtractor();
        this.timePeriodExtractor = new timePeriodConfiguration_1.ChineseTimePeriodExtractor();
        this.dateTimePeriodExtractor = new dateTimePeriodConfiguration_1.ChineseDateTimePeriodExtractor();
        this.setExtractor = new setConfiguration_1.ChineseSetExtractor();
        this.holidayExtractor = new baseHoliday_1.BaseHolidayExtractor(new holidayConfiguration_1.ChineseHolidayExtractorConfiguration());
        this.durationExtractor = new durationConfiguration_1.ChineseDurationExtractor();
    }
}
class ChineseMergedExtractor extends baseMerged_1.BaseMergedExtractor {
    constructor(options) {
        let config = new ChineseMergedExtractorConfiguration();
        super(config, options);
        this.dayOfMonthRegex = recognizers_text_1.RegExpUtility.getSafeRegExp(`^\\d{1,2}号`, 'gi');
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
        this.addMod(result, source);
        result = result.sort((a, b) => a.start - b.start);
        return result;
    }
    addTo(destination, source, sourceStr) {
        source.forEach(er => {
            let isFound = false;
            let rmIndex = -1;
            let rmLength = 1;
            for (let index = 0; index < destination.length; index++) {
                if (recognizers_text_1.ExtractResult.isOverlap(destination[index], er)) {
                    isFound = true;
                    if (er.length > destination[index].length) {
                        rmIndex = index;
                        let j = index + 1;
                        while (j < destination.length && recognizers_text_1.ExtractResult.isOverlap(destination[j], er)) {
                            rmLength++;
                            j++;
                        }
                    }
                    break;
                }
            }
            if (!isFound) {
                destination.push(er);
            }
            else if (rmIndex >= 0) {
                destination.splice(rmIndex, rmLength);
                this.moveOverlap(destination, er);
                destination.splice(rmIndex, 0, er);
            }
        });
    }
    moveOverlap(destination, result) {
        let duplicated = new Array();
        for (let i = 0; i < destination.length; i++) {
            if (result.text.includes(destination[i].text)
                && (result.start === destination[i].start || result.start + result.length === destination[i].start + destination[i].length)) {
                duplicated.push(i);
            }
        }
        duplicated.forEach(index => destination.splice(index, 1));
    }
    // ported from CheckBlackList
    addMod(destination, source) {
        let result = new Array();
        destination = destination.filter(value => {
            let valueEnd = value.start + value.length;
            if (valueEnd !== source.length) {
                let lastChar = source.substr(valueEnd, 1);
                if (value.text.endsWith('周') && valueEnd < source.length && lastChar === '岁') {
                    return false;
                }
            }
            if (recognizers_text_1.RegExpUtility.isMatch(this.dayOfMonthRegex, value.text)) {
                return false;
            }
            return true;
        });
    }
}
exports.ChineseMergedExtractor = ChineseMergedExtractor;
class ChineseMergedParserConfiguration {
    constructor() {
        this.beforeRegex = recognizers_text_1.RegExpUtility.getSafeRegExp(chineseDateTime_1.ChineseDateTime.MergedBeforeRegex);
        this.afterRegex = recognizers_text_1.RegExpUtility.getSafeRegExp(chineseDateTime_1.ChineseDateTime.MergedAfterRegex);
        this.sinceRegex = recognizers_text_1.RegExpUtility.getSafeRegExp(chineseDateTime_1.ChineseDateTime.MergedAfterRegex);
        this.dateParser = new dateConfiguration_1.ChineseDateParser();
        this.holidayParser = new holidayConfiguration_1.ChineseHolidayParser();
        this.timeParser = new timeConfiguration_1.ChineseTimeParser();
        this.dateTimeParser = new dateTimeConfiguration_1.ChineseDateTimeParser();
        this.datePeriodParser = new datePeriodConfiguration_1.ChineseDatePeriodParser();
        this.timePeriodParser = new timePeriodConfiguration_1.ChineseTimePeriodParser();
        this.dateTimePeriodParser = new dateTimePeriodConfiguration_1.ChineseDateTimePeriodParser();
        this.durationParser = new durationConfiguration_1.ChineseDurationParser();
        this.setParser = new setConfiguration_1.ChineseSetParser();
    }
}
class ChineseMergedParser extends baseMerged_1.BaseMergedParser {
    constructor() {
        let config = new ChineseMergedParserConfiguration();
        super(config, 0);
    }
    parse(er, refTime) {
        let referenceTime = refTime || new Date();
        let pr = null;
        // push, save teh MOD string
        let hasBefore = recognizers_text_1.RegExpUtility.isMatch(this.config.beforeRegex, er.text);
        let hasAfter = recognizers_text_1.RegExpUtility.isMatch(this.config.afterRegex, er.text);
        let hasSince = recognizers_text_1.RegExpUtility.isMatch(this.config.sinceRegex, er.text);
        let modStr = '';
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
            let val = pr.value;
            val.mod = constants_1.TimeTypeConstants.beforeMod;
            pr.value = val;
        }
        if (hasAfter && pr.value !== null) {
            let val = pr.value;
            val.mod = constants_1.TimeTypeConstants.afterMod;
            pr.value = val;
        }
        if (hasSince && pr.value !== null) {
            let val = pr.value;
            val.mod = constants_1.TimeTypeConstants.sinceMod;
            pr.value = val;
        }
        pr.value = this.dateTimeResolution(pr, hasBefore, hasAfter, hasSince);
        pr.type = `${this.parserTypeName}.${this.determineDateTimeType(er.type, hasBefore, hasAfter, hasSince)}`;
        return pr;
    }
}
exports.ChineseMergedParser = ChineseMergedParser;
class ChineseFullMergedParser extends baseMerged_1.BaseMergedParser {
    constructor() {
        let config = new ChineseMergedParserConfiguration();
        super(config, 0);
    }
    parse(er, refTime) {
        let referenceTime = refTime || new Date();
        let pr = null;
        // push, save teh MOD string
        let hasBefore = false;
        let hasAfter = false;
        let modStr = "";
        let beforeMatch = recognizers_text_1.RegExpUtility.getMatches(this.config.beforeRegex, er.text).pop();
        let afterMatch = recognizers_text_1.RegExpUtility.getMatches(this.config.afterRegex, er.text).pop();
        if (beforeMatch) {
            hasBefore = true;
            er.start += beforeMatch.length;
            er.length -= beforeMatch.length;
            er.text = er.text.substring(beforeMatch.length);
            modStr = beforeMatch.value;
        }
        else if (afterMatch) {
            hasAfter = true;
            er.start += afterMatch.length;
            er.length -= afterMatch.length;
            er.text = er.text.substring(afterMatch.length);
            modStr = afterMatch.value;
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
        pr.value = this.dateTimeResolution(pr, hasBefore, hasAfter);
        pr.type = `${this.parserTypeName}.${this.determineDateTimeType(er.type, hasBefore, hasAfter)}`;
        return pr;
    }
    dateTimeResolution(slot, hasBefore, hasAfter, hasSince = false) {
        if (!slot)
            return null;
        let result = new Map();
        let resolutions = new Array();
        let type = slot.type;
        let outputType = this.determineDateTimeType(type, hasBefore, hasAfter);
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
        if (isLunar) {
            this.addResolutionFieldsAny(result, constants_1.Constants.IsLunarKey, isLunar);
        }
        result.forEach((value, key) => {
            if (this.isObject(value)) {
                // is "StringMap"
                let newValues = {};
                this.addResolutionFields(newValues, constants_1.Constants.TimexKey, timex);
                this.addResolutionFields(newValues, constants_1.Constants.ModKey, mod);
                this.addResolutionFields(newValues, constants_1.Constants.TypeKey, outputType);
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
    determineDateTimeType(type, hasBefore, hasAfter, hasSince = false) {
        if (hasBefore || hasAfter || hasSince) {
            if (type === constants_1.Constants.SYS_DATETIME_DATE)
                return constants_1.Constants.SYS_DATETIME_DATEPERIOD;
            if (type === constants_1.Constants.SYS_DATETIME_TIME)
                return constants_1.Constants.SYS_DATETIME_TIMEPERIOD;
            if (type === constants_1.Constants.SYS_DATETIME_DATETIME)
                return constants_1.Constants.SYS_DATETIME_DATETIMEPERIOD;
        }
        return type;
    }
}
exports.ChineseFullMergedParser = ChineseFullMergedParser;
//# sourceMappingURL=mergedConfiguration.js.map