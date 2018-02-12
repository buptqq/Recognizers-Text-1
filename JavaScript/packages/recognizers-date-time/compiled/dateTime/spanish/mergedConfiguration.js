"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const recognizers_text_1 = require("recognizers-text");
const recognizers_text_number_1 = require("recognizers-text-number");
const baseDate_1 = require("../baseDate");
const baseTime_1 = require("../baseTime");
const baseDateTime_1 = require("../baseDateTime");
const baseDatePeriod_1 = require("../baseDatePeriod");
const baseTimePeriod_1 = require("../baseTimePeriod");
const baseDateTimePeriod_1 = require("../baseDateTimePeriod");
const baseHoliday_1 = require("../baseHoliday");
const baseDuration_1 = require("../baseDuration");
const baseSet_1 = require("../baseSet");
const spanishDateTime_1 = require("../../resources/spanishDateTime");
const dateConfiguration_1 = require("./dateConfiguration");
const dateTimeConfiguration_1 = require("./dateTimeConfiguration");
const datePeriodConfiguration_1 = require("./datePeriodConfiguration");
const durationConfiguration_1 = require("./durationConfiguration");
const holidayConfiguration_1 = require("./holidayConfiguration");
const baseConfiguration_1 = require("./baseConfiguration");
const timeConfiguration_1 = require("./timeConfiguration");
const timePeriodConfiguration_1 = require("./timePeriodConfiguration");
const dateTimePeriodConfiguration_1 = require("./dateTimePeriodConfiguration");
const setConfiguration_1 = require("./setConfiguration");
const dateTimePeriodParser_1 = require("./dateTimePeriodParser");
class SpanishMergedExtractorConfiguration {
    constructor() {
        this.beforeRegex = recognizers_text_1.RegExpUtility.getSafeRegExp(spanishDateTime_1.SpanishDateTime.BeforeRegex);
        this.afterRegex = recognizers_text_1.RegExpUtility.getSafeRegExp(spanishDateTime_1.SpanishDateTime.AfterRegex);
        this.sinceRegex = recognizers_text_1.RegExpUtility.getSafeRegExp(spanishDateTime_1.SpanishDateTime.SinceRegex);
        this.fromToRegex = recognizers_text_1.RegExpUtility.getSafeRegExp(spanishDateTime_1.SpanishDateTime.FromToRegex);
        this.singleAmbiguousMonthRegex = recognizers_text_1.RegExpUtility.getSafeRegExp(spanishDateTime_1.SpanishDateTime.SingleAmbiguousMonthRegex);
        this.prepositionSuffixRegex = recognizers_text_1.RegExpUtility.getSafeRegExp(spanishDateTime_1.SpanishDateTime.PrepositionSuffixRegex);
        this.numberEndingPattern = recognizers_text_1.RegExpUtility.getSafeRegExp(spanishDateTime_1.SpanishDateTime.NumberEndingPattern);
        this.dateExtractor = new baseDate_1.BaseDateExtractor(new dateConfiguration_1.SpanishDateExtractorConfiguration());
        this.timeExtractor = new baseTime_1.BaseTimeExtractor(new timeConfiguration_1.SpanishTimeExtractorConfiguration());
        this.dateTimeExtractor = new baseDateTime_1.BaseDateTimeExtractor(new dateTimeConfiguration_1.SpanishDateTimeExtractorConfiguration());
        this.datePeriodExtractor = new baseDatePeriod_1.BaseDatePeriodExtractor(new datePeriodConfiguration_1.SpanishDatePeriodExtractorConfiguration());
        this.timePeriodExtractor = new baseTimePeriod_1.BaseTimePeriodExtractor(new timePeriodConfiguration_1.SpanishTimePeriodExtractorConfiguration());
        this.dateTimePeriodExtractor = new baseDateTimePeriod_1.BaseDateTimePeriodExtractor(new dateTimePeriodConfiguration_1.SpanishDateTimePeriodExtractorConfiguration());
        this.durationExtractor = new baseDuration_1.BaseDurationExtractor(new durationConfiguration_1.SpanishDurationExtractorConfiguration());
        this.setExtractor = new baseSet_1.BaseSetExtractor(new setConfiguration_1.SpanishSetExtractorConfiguration());
        this.holidayExtractor = new baseHoliday_1.BaseHolidayExtractor(new holidayConfiguration_1.SpanishHolidayExtractorConfiguration());
        this.integerExtractor = new recognizers_text_number_1.SpanishIntegerExtractor();
        this.filterWordRegexList = [];
    }
}
exports.SpanishMergedExtractorConfiguration = SpanishMergedExtractorConfiguration;
class SpanishMergedParserConfiguration extends baseConfiguration_1.SpanishCommonDateTimeParserConfiguration {
    constructor() {
        super();
        this.beforeRegex = recognizers_text_1.RegExpUtility.getSafeRegExp(spanishDateTime_1.SpanishDateTime.BeforeRegex);
        this.afterRegex = recognizers_text_1.RegExpUtility.getSafeRegExp(spanishDateTime_1.SpanishDateTime.AfterRegex);
        this.sinceRegex = recognizers_text_1.RegExpUtility.getSafeRegExp(spanishDateTime_1.SpanishDateTime.SinceRegex);
        this.datePeriodParser = new baseDatePeriod_1.BaseDatePeriodParser(new datePeriodConfiguration_1.SpanishDatePeriodParserConfiguration(this));
        this.timePeriodParser = new baseTimePeriod_1.BaseTimePeriodParser(new timePeriodConfiguration_1.SpanishTimePeriodParserConfiguration(this));
        this.dateTimePeriodParser = new dateTimePeriodParser_1.SpanishDateTimePeriodParser(new dateTimePeriodConfiguration_1.SpanishDateTimePeriodParserConfiguration(this));
        this.setParser = new baseSet_1.BaseSetParser(new setConfiguration_1.SpanishSetParserConfiguration(this));
        this.holidayParser = new baseHoliday_1.BaseHolidayParser(new holidayConfiguration_1.SpanishHolidayParserConfiguration());
    }
}
exports.SpanishMergedParserConfiguration = SpanishMergedParserConfiguration;
//# sourceMappingURL=mergedConfiguration.js.map