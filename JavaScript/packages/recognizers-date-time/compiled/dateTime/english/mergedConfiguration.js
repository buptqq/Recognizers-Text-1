"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const baseDate_1 = require("../baseDate");
const baseTime_1 = require("../baseTime");
const baseSet_1 = require("../baseSet");
const baseHoliday_1 = require("../baseHoliday");
const baseDatePeriod_1 = require("../baseDatePeriod");
const baseTimePeriod_1 = require("../baseTimePeriod");
const baseDateTime_1 = require("../baseDateTime");
const baseDateTimePeriod_1 = require("../baseDateTimePeriod");
const baseDuration_1 = require("../baseDuration");
const recognizers_text_1 = require("recognizers-text");
const recognizers_text_number_1 = require("recognizers-text-number");
const englishDateTime_1 = require("../../resources/englishDateTime");
const durationConfiguration_1 = require("./durationConfiguration");
const timeConfiguration_1 = require("./timeConfiguration");
const dateConfiguration_1 = require("./dateConfiguration");
const dateTimeConfiguration_1 = require("./dateTimeConfiguration");
const timePeriodConfiguration_1 = require("./timePeriodConfiguration");
const datePeriodConfiguration_1 = require("./datePeriodConfiguration");
const dateTimePeriodConfiguration_1 = require("./dateTimePeriodConfiguration");
const setConfiguration_1 = require("./setConfiguration");
const holidayConfiguration_1 = require("./holidayConfiguration");
class EnglishMergedExtractorConfiguration {
    constructor() {
        this.dateExtractor = new baseDate_1.BaseDateExtractor(new dateConfiguration_1.EnglishDateExtractorConfiguration());
        this.timeExtractor = new baseTime_1.BaseTimeExtractor(new timeConfiguration_1.EnglishTimeExtractorConfiguration());
        this.dateTimeExtractor = new baseDateTime_1.BaseDateTimeExtractor(new dateTimeConfiguration_1.EnglishDateTimeExtractorConfiguration());
        this.datePeriodExtractor = new baseDatePeriod_1.BaseDatePeriodExtractor(new datePeriodConfiguration_1.EnglishDatePeriodExtractorConfiguration());
        this.timePeriodExtractor = new baseTimePeriod_1.BaseTimePeriodExtractor(new timePeriodConfiguration_1.EnglishTimePeriodExtractorConfiguration());
        this.dateTimePeriodExtractor = new baseDateTimePeriod_1.BaseDateTimePeriodExtractor(new dateTimePeriodConfiguration_1.EnglishDateTimePeriodExtractorConfiguration());
        this.holidayExtractor = new baseHoliday_1.BaseHolidayExtractor(new holidayConfiguration_1.EnglishHolidayExtractorConfiguration());
        this.durationExtractor = new baseDuration_1.BaseDurationExtractor(new durationConfiguration_1.EnglishDurationExtractorConfiguration());
        this.setExtractor = new baseSet_1.BaseSetExtractor(new setConfiguration_1.EnglishSetExtractorConfiguration());
        this.integerExtractor = new recognizers_text_number_1.EnglishIntegerExtractor();
        this.afterRegex = recognizers_text_1.RegExpUtility.getSafeRegExp(englishDateTime_1.EnglishDateTime.AfterRegex);
        this.sinceRegex = recognizers_text_1.RegExpUtility.getSafeRegExp(englishDateTime_1.EnglishDateTime.SinceRegex);
        this.beforeRegex = recognizers_text_1.RegExpUtility.getSafeRegExp(englishDateTime_1.EnglishDateTime.BeforeRegex);
        this.fromToRegex = recognizers_text_1.RegExpUtility.getSafeRegExp(englishDateTime_1.EnglishDateTime.FromToRegex);
        this.singleAmbiguousMonthRegex = recognizers_text_1.RegExpUtility.getSafeRegExp(englishDateTime_1.EnglishDateTime.SingleAmbiguousMonthRegex);
        this.prepositionSuffixRegex = recognizers_text_1.RegExpUtility.getSafeRegExp(englishDateTime_1.EnglishDateTime.PrepositionSuffixRegex);
        this.numberEndingPattern = recognizers_text_1.RegExpUtility.getSafeRegExp(englishDateTime_1.EnglishDateTime.NumberEndingPattern);
        this.filterWordRegexList = [
            recognizers_text_1.RegExpUtility.getSafeRegExp(englishDateTime_1.EnglishDateTime.OneOnOneRegex)
        ];
    }
}
exports.EnglishMergedExtractorConfiguration = EnglishMergedExtractorConfiguration;
class EnglishMergedParserConfiguration {
    constructor(config) {
        this.beforeRegex = recognizers_text_1.RegExpUtility.getSafeRegExp(englishDateTime_1.EnglishDateTime.BeforeRegex);
        this.afterRegex = recognizers_text_1.RegExpUtility.getSafeRegExp(englishDateTime_1.EnglishDateTime.AfterRegex);
        this.sinceRegex = recognizers_text_1.RegExpUtility.getSafeRegExp(englishDateTime_1.EnglishDateTime.SinceRegex);
        this.holidayParser = new baseHoliday_1.BaseHolidayParser(new holidayConfiguration_1.EnglishHolidayParserConfiguration());
        this.dateParser = config.dateParser;
        this.timeParser = config.timeParser;
        this.dateTimeParser = config.dateTimeParser;
        this.datePeriodParser = config.datePeriodParser;
        this.timePeriodParser = config.timePeriodParser;
        this.dateTimePeriodParser = config.dateTimePeriodParser;
        this.durationParser = config.durationParser;
        this.setParser = new baseSet_1.BaseSetParser(new setConfiguration_1.EnglishSetParserConfiguration(config));
    }
}
exports.EnglishMergedParserConfiguration = EnglishMergedParserConfiguration;
//# sourceMappingURL=mergedConfiguration.js.map