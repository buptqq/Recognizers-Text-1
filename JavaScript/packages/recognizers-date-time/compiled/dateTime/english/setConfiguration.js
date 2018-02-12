"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const baseDate_1 = require("../baseDate");
const baseTime_1 = require("../baseTime");
const baseDatePeriod_1 = require("../baseDatePeriod");
const baseTimePeriod_1 = require("../baseTimePeriod");
const baseDateTime_1 = require("../baseDateTime");
const baseDateTimePeriod_1 = require("../baseDateTimePeriod");
const baseDuration_1 = require("../baseDuration");
const recognizers_text_1 = require("recognizers-text");
const englishDateTime_1 = require("../../resources/englishDateTime");
const durationConfiguration_1 = require("./durationConfiguration");
const timeConfiguration_1 = require("./timeConfiguration");
const dateConfiguration_1 = require("./dateConfiguration");
const dateTimeConfiguration_1 = require("./dateTimeConfiguration");
const timePeriodConfiguration_1 = require("./timePeriodConfiguration");
const datePeriodConfiguration_1 = require("./datePeriodConfiguration");
const dateTimePeriodConfiguration_1 = require("./dateTimePeriodConfiguration");
class EnglishSetExtractorConfiguration {
    constructor() {
        this.durationExtractor = new baseDuration_1.BaseDurationExtractor(new durationConfiguration_1.EnglishDurationExtractorConfiguration());
        this.timeExtractor = new baseTime_1.BaseTimeExtractor(new timeConfiguration_1.EnglishTimeExtractorConfiguration());
        this.dateExtractor = new baseDate_1.BaseDateExtractor(new dateConfiguration_1.EnglishDateExtractorConfiguration());
        this.dateTimeExtractor = new baseDateTime_1.BaseDateTimeExtractor(new dateTimeConfiguration_1.EnglishDateTimeExtractorConfiguration());
        this.datePeriodExtractor = new baseDatePeriod_1.BaseDatePeriodExtractor(new datePeriodConfiguration_1.EnglishDatePeriodExtractorConfiguration());
        this.timePeriodExtractor = new baseTimePeriod_1.BaseTimePeriodExtractor(new timePeriodConfiguration_1.EnglishTimePeriodExtractorConfiguration());
        this.dateTimePeriodExtractor = new baseDateTimePeriod_1.BaseDateTimePeriodExtractor(new dateTimePeriodConfiguration_1.EnglishDateTimePeriodExtractorConfiguration());
        this.lastRegex = recognizers_text_1.RegExpUtility.getSafeRegExp(englishDateTime_1.EnglishDateTime.SetLastRegex);
        this.eachPrefixRegex = recognizers_text_1.RegExpUtility.getSafeRegExp(englishDateTime_1.EnglishDateTime.EachPrefixRegex);
        this.periodicRegex = recognizers_text_1.RegExpUtility.getSafeRegExp(englishDateTime_1.EnglishDateTime.PeriodicRegex);
        this.eachUnitRegex = recognizers_text_1.RegExpUtility.getSafeRegExp(englishDateTime_1.EnglishDateTime.EachUnitRegex);
        this.eachDayRegex = recognizers_text_1.RegExpUtility.getSafeRegExp(englishDateTime_1.EnglishDateTime.EachDayRegex);
        this.setWeekDayRegex = recognizers_text_1.RegExpUtility.getSafeRegExp(englishDateTime_1.EnglishDateTime.SetWeekDayRegex);
        this.setEachRegex = recognizers_text_1.RegExpUtility.getSafeRegExp(englishDateTime_1.EnglishDateTime.SetEachRegex);
        this.beforeEachDayRegex = null;
    }
}
exports.EnglishSetExtractorConfiguration = EnglishSetExtractorConfiguration;
class EnglishSetParserConfiguration {
    constructor(config) {
        this.durationExtractor = config.durationExtractor;
        this.timeExtractor = config.timeExtractor;
        this.dateExtractor = config.dateExtractor;
        this.dateTimeExtractor = config.dateTimeExtractor;
        this.datePeriodExtractor = config.datePeriodExtractor;
        this.timePeriodExtractor = config.timePeriodExtractor;
        this.dateTimePeriodExtractor = config.dateTimePeriodExtractor;
        this.durationParser = config.durationParser;
        this.timeParser = config.timeParser;
        this.dateParser = config.dateParser;
        this.dateTimeParser = config.dateTimeParser;
        this.datePeriodParser = config.datePeriodParser;
        this.timePeriodParser = config.timePeriodParser;
        this.dateTimePeriodParser = config.dateTimePeriodParser;
        this.unitMap = config.unitMap;
        this.eachPrefixRegex = recognizers_text_1.RegExpUtility.getSafeRegExp(englishDateTime_1.EnglishDateTime.EachPrefixRegex);
        this.periodicRegex = recognizers_text_1.RegExpUtility.getSafeRegExp(englishDateTime_1.EnglishDateTime.PeriodicRegex);
        this.eachUnitRegex = recognizers_text_1.RegExpUtility.getSafeRegExp(englishDateTime_1.EnglishDateTime.EachUnitRegex);
        this.eachDayRegex = recognizers_text_1.RegExpUtility.getSafeRegExp(englishDateTime_1.EnglishDateTime.EachDayRegex);
        this.setWeekDayRegex = recognizers_text_1.RegExpUtility.getSafeRegExp(englishDateTime_1.EnglishDateTime.SetWeekDayRegex);
        this.setEachRegex = recognizers_text_1.RegExpUtility.getSafeRegExp(englishDateTime_1.EnglishDateTime.SetEachRegex);
    }
    getMatchedDailyTimex(text) {
        let timex = "";
        let trimmedText = text.trim().toLowerCase();
        if (trimmedText === "daily") {
            timex = "P1D";
        }
        else if (trimmedText === "weekly") {
            timex = "P1W";
        }
        else if (trimmedText === "biweekly") {
            timex = "P2W";
        }
        else if (trimmedText === "monthly") {
            timex = "P1M";
        }
        else if (trimmedText === "yearly" || trimmedText === "annually" || trimmedText === "annual") {
            timex = "P1Y";
        }
        else {
            timex = null;
            return { matched: false, timex: timex };
        }
        return { matched: true, timex: timex };
    }
    getMatchedUnitTimex(text) {
        let timex = "";
        let trimmedText = text.trim().toLowerCase();
        if (trimmedText === "day") {
            timex = "P1D";
        }
        else if (trimmedText === "week") {
            timex = "P1W";
        }
        else if (trimmedText === "month") {
            timex = "P1M";
        }
        else if (trimmedText === "year") {
            timex = "P1Y";
        }
        else {
            timex = null;
            return { matched: false, timex: timex };
        }
        return { matched: true, timex: timex };
    }
}
exports.EnglishSetParserConfiguration = EnglishSetParserConfiguration;
//# sourceMappingURL=setConfiguration.js.map