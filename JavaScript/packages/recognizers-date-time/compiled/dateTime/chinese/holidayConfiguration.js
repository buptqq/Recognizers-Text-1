"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const recognizers_text_1 = require("recognizers-text");
const baseHoliday_1 = require("../baseHoliday");
const recognizers_text_number_1 = require("recognizers-text-number");
const recognizers_text_number_2 = require("recognizers-text-number");
const utilities_1 = require("../utilities");
const chineseDateTime_1 = require("../../resources/chineseDateTime");
const parsers_1 = require("../parsers");
const constants_1 = require("../constants");
class ChineseHolidayExtractorConfiguration {
    constructor() {
        this.holidayRegexes = [
            recognizers_text_1.RegExpUtility.getSafeRegExp(chineseDateTime_1.ChineseDateTime.HolidayRegexList1),
            recognizers_text_1.RegExpUtility.getSafeRegExp(chineseDateTime_1.ChineseDateTime.HolidayRegexList2),
            recognizers_text_1.RegExpUtility.getSafeRegExp(chineseDateTime_1.ChineseDateTime.LunarHolidayRegex)
        ];
    }
}
exports.ChineseHolidayExtractorConfiguration = ChineseHolidayExtractorConfiguration;
class ChineseHolidayParserConfiguration extends baseHoliday_1.BaseHolidayParserConfiguration {
    constructor() {
        super();
        this.holidayRegexList = [
            recognizers_text_1.RegExpUtility.getSafeRegExp(chineseDateTime_1.ChineseDateTime.HolidayRegexList1),
            recognizers_text_1.RegExpUtility.getSafeRegExp(chineseDateTime_1.ChineseDateTime.HolidayRegexList1)
        ];
        this.holidayFuncDictionary = this.initHolidayFuncs();
        this.variableHolidaysTimexDictionary = chineseDateTime_1.ChineseDateTime.HolidayNoFixedTimex;
    }
    getSwiftYear(source) {
        if (source.endsWith('年'))
            return 0;
        if (source.endsWith('去年'))
            return -1;
        if (source.endsWith('明年'))
            return 1;
        return null;
    }
    sanitizeHolidayToken(holiday) {
        return holiday;
    }
    initHolidayFuncs() {
        return new Map([
            ...super.initHolidayFuncs(),
            ['父亲节', baseHoliday_1.BaseHolidayParserConfiguration.FathersDay],
            ['母亲节', baseHoliday_1.BaseHolidayParserConfiguration.MothersDay],
            ['感恩节', baseHoliday_1.BaseHolidayParserConfiguration.ThanksgivingDay]
        ]);
    }
}
const yearNow = (new Date()).getFullYear();
const yuandan = new Date(yearNow, 1 - 1, 1);
const chsnationalday = new Date(yearNow, 10 - 1, 1);
const laborday = new Date(yearNow, 5 - 1, 1);
const christmasday = new Date(yearNow, 12 - 1, 25);
const loverday = new Date(yearNow, 2 - 1, 14);
const chsmilbuildday = new Date(yearNow, 8 - 1, 1);
const foolday = new Date(yearNow, 4 - 1, 1);
const girlsday = new Date(yearNow, 3 - 1, 7);
const treeplantday = new Date(yearNow, 3 - 1, 12);
const femaleday = new Date(yearNow, 3 - 1, 8);
const childrenday = new Date(yearNow, 6 - 1, 1);
const youthday = new Date(yearNow, 5 - 1, 4);
const teacherday = new Date(yearNow, 9 - 1, 10);
const singlesday = new Date(yearNow, 11 - 1, 11);
const halloweenday = new Date(yearNow, 10 - 1, 31);
const midautumnday = new Date(yearNow, 8 - 1, 15);
const springday = new Date(yearNow, 1 - 1, 1);
const chuxiday = utilities_1.DateUtils.addDays(new Date(yearNow, 1 - 1, 1), -1);
const lanternday = new Date(yearNow, 1 - 1, 15);
const qingmingday = new Date(yearNow, 4 - 1, 4);
const dragonboatday = new Date(yearNow, 5 - 1, 5);
const chongyangday = new Date(yearNow, 9 - 1, 9);
class ChineseHolidayParser extends baseHoliday_1.BaseHolidayParser {
    constructor() {
        let config = new ChineseHolidayParserConfiguration();
        super(config);
        this.lunarHolidayRegex = recognizers_text_1.RegExpUtility.getSafeRegExp(chineseDateTime_1.ChineseDateTime.LunarHolidayRegex);
        this.integerExtractor = new recognizers_text_number_1.ChineseIntegerExtractor();
        this.numberParser = recognizers_text_number_1.AgnosticNumberParserFactory.getParser(recognizers_text_number_1.AgnosticNumberParserType.Integer, new recognizers_text_number_1.ChineseNumberParserConfiguration());
        this.fixedHolidayDictionary = new Map([
            ['元旦', yuandan],
            ['元旦节', yuandan],
            ['教师节', teacherday],
            ['青年节', youthday],
            ['儿童节', childrenday],
            ['妇女节', femaleday],
            ['植树节', treeplantday],
            ['情人节', loverday],
            ['圣诞节', christmasday],
            ['新年', yuandan],
            ['愚人节', foolday],
            ['五一', laborday],
            ['劳动节', laborday],
            ['万圣节', halloweenday],
            ['中秋节', midautumnday],
            ['中秋', midautumnday],
            ['春节', springday],
            ['除夕', chuxiday],
            ['元宵节', lanternday],
            ['清明节', qingmingday],
            ['清明', qingmingday],
            ['端午节', dragonboatday],
            ['端午', dragonboatday],
            ['国庆节', chsnationalday],
            ['建军节', chsmilbuildday],
            ['女生节', girlsday],
            ['光棍节', singlesday],
            ['双十一', singlesday],
            ['重阳节', chongyangday]
        ]);
    }
    parse(er, referenceDate) {
        if (!referenceDate)
            referenceDate = new Date();
        let value = null;
        if (er.type === baseHoliday_1.BaseHolidayParser.ParserName) {
            let innerResult = this.parseHolidayRegexMatch(er.text, referenceDate);
            if (innerResult.success) {
                innerResult.futureResolution = {};
                innerResult.futureResolution[constants_1.TimeTypeConstants.DATE] = utilities_1.FormatUtil.formatDate(innerResult.futureValue);
                innerResult.pastResolution = {};
                innerResult.pastResolution[constants_1.TimeTypeConstants.DATE] = utilities_1.FormatUtil.formatDate(innerResult.pastValue);
                innerResult.isLunar = this.isLunar(er.text);
                value = innerResult;
            }
        }
        let ret = new parsers_1.DateTimeParseResult(er);
        ret.value = value;
        ret.timexStr = value === null ? "" : value.timex;
        ret.resolutionStr = "";
        return ret;
    }
    isLunar(source) {
        return recognizers_text_1.RegExpUtility.isMatch(this.lunarHolidayRegex, source);
    }
    match2Date(match, referenceDate) {
        let ret = new utilities_1.DateTimeResolutionResult();
        let holidayStr = this.config.sanitizeHolidayToken(match.groups("holiday").value.toLowerCase());
        if (recognizers_text_1.StringUtility.isNullOrEmpty(holidayStr))
            return ret;
        // get year (if exist)
        let year = referenceDate.getFullYear();
        let yearNum = match.groups('year').value;
        let yearChinese = match.groups('yearchs').value;
        let yearRelative = match.groups('yearrel').value;
        let hasYear = false;
        if (!recognizers_text_1.StringUtility.isNullOrEmpty(yearNum)) {
            hasYear = true;
            if (this.config.getSwiftYear(yearNum) === 0) {
                yearNum = yearNum.substr(0, yearNum.length - 1);
            }
            year = this.convertYear(yearNum, false);
        }
        else if (!recognizers_text_1.StringUtility.isNullOrEmpty(yearChinese)) {
            hasYear = true;
            if (this.config.getSwiftYear(yearChinese) === 0) {
                yearChinese = yearChinese.substr(0, yearChinese.length - 1);
            }
            year = this.convertYear(yearChinese, true);
        }
        else if (!recognizers_text_1.StringUtility.isNullOrEmpty(yearRelative)) {
            hasYear = true;
            year += this.config.getSwiftYear(yearRelative);
        }
        if (year < 100 && year >= 90) {
            year += 1900;
        }
        else if (year < 100 && year < 20) {
            year += 2000;
        }
        let timex = '';
        let date = new Date(referenceDate);
        if (this.fixedHolidayDictionary.has(holidayStr)) {
            date = this.fixedHolidayDictionary.get(holidayStr);
            timex = `-${utilities_1.FormatUtil.toString(date.getMonth() + 1, 2)}-${utilities_1.FormatUtil.toString(date.getDate(), 2)}`;
        }
        else if (this.config.holidayFuncDictionary.has(holidayStr)) {
            date = this.config.holidayFuncDictionary.get(holidayStr)(year);
            timex = this.config.variableHolidaysTimexDictionary.get(holidayStr);
        }
        else {
            return ret;
        }
        if (hasYear) {
            ret.timex = utilities_1.FormatUtil.toString(year, 4) + timex;
            ret.futureValue = new Date(year, date.getMonth(), date.getDate());
            ret.pastValue = new Date(year, date.getMonth(), date.getDate());
        }
        else {
            ret.timex = "XXXX" + timex;
            ret.futureValue = this.getDateValue(date, referenceDate, holidayStr, 1, (d, r) => d.getTime() < r.getTime());
            ret.pastValue = this.getDateValue(date, referenceDate, holidayStr, -1, (d, r) => d.getTime() >= r.getTime());
        }
        ret.success = true;
        return ret;
    }
    convertYear(yearStr, isChinese) {
        let year = -1;
        let er;
        if (isChinese) {
            let yearNum = 0;
            er = this.integerExtractor.extract(yearStr).pop();
            if (er && er.type === recognizers_text_number_2.Constants.SYS_NUM_INTEGER) {
                yearNum = Number.parseInt(this.numberParser.parse(er).value);
            }
            if (yearNum < 10) {
                yearNum = 0;
                for (let index = 0; index < yearStr.length; index++) {
                    let char = yearStr.charAt[index];
                    yearNum *= 10;
                    er = this.integerExtractor.extract(char).pop();
                    if (er && er.type === recognizers_text_number_2.Constants.SYS_NUM_INTEGER) {
                        yearNum += Number.parseInt(this.numberParser.parse(er).value);
                    }
                }
            }
            else {
                year = yearNum;
            }
        }
        else {
            year = Number.parseInt(yearStr, 10);
        }
        return year === 0 ? -1 : year;
    }
    getDateValue(date, referenceDate, holiday, swift, comparer) {
        let result = new Date(date);
        if (comparer(date, referenceDate)) {
            if (this.fixedHolidayDictionary.has(holiday)) {
                return utilities_1.DateUtils.addYears(date, swift);
            }
            if (this.config.holidayFuncDictionary.has(holiday)) {
                result = this.config.holidayFuncDictionary.get(holiday)(referenceDate.getFullYear() + swift);
            }
        }
        return result;
    }
}
exports.ChineseHolidayParser = ChineseHolidayParser;
//# sourceMappingURL=holidayConfiguration.js.map