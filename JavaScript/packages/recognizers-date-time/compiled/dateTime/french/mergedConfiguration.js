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
const frenchDateTime_1 = require("../../resources/frenchDateTime");
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
class FrenchMergedExtractorConfiguration {
    constructor() {
        this.beforeRegex = recognizers_text_1.RegExpUtility.getSafeRegExp(frenchDateTime_1.FrenchDateTime.BeforeRegex);
        this.afterRegex = recognizers_text_1.RegExpUtility.getSafeRegExp(frenchDateTime_1.FrenchDateTime.AfterRegex);
        this.sinceRegex = recognizers_text_1.RegExpUtility.getSafeRegExp(frenchDateTime_1.FrenchDateTime.SinceRegex);
        this.fromToRegex = recognizers_text_1.RegExpUtility.getSafeRegExp(frenchDateTime_1.FrenchDateTime.FromToRegex);
        this.singleAmbiguousMonthRegex = recognizers_text_1.RegExpUtility.getSafeRegExp(frenchDateTime_1.FrenchDateTime.SingleAmbiguousMonthRegex);
        this.prepositionSuffixRegex = recognizers_text_1.RegExpUtility.getSafeRegExp(frenchDateTime_1.FrenchDateTime.PrepositionSuffixRegex);
        this.numberEndingPattern = recognizers_text_1.RegExpUtility.getSafeRegExp(frenchDateTime_1.FrenchDateTime.NumberEndingPattern);
        this.dateExtractor = new baseDate_1.BaseDateExtractor(new dateConfiguration_1.FrenchDateExtractorConfiguration());
        this.timeExtractor = new baseTime_1.BaseTimeExtractor(new timeConfiguration_1.FrenchTimeExtractorConfiguration());
        this.dateTimeExtractor = new baseDateTime_1.BaseDateTimeExtractor(new dateTimeConfiguration_1.FrenchDateTimeExtractorConfiguration());
        this.datePeriodExtractor = new baseDatePeriod_1.BaseDatePeriodExtractor(new datePeriodConfiguration_1.FrenchDatePeriodExtractorConfiguration());
        this.timePeriodExtractor = new baseTimePeriod_1.BaseTimePeriodExtractor(new timePeriodConfiguration_1.FrenchTimePeriodExtractorConfiguration());
        this.dateTimePeriodExtractor = new baseDateTimePeriod_1.BaseDateTimePeriodExtractor(new dateTimePeriodConfiguration_1.FrenchDateTimePeriodExtractorConfiguration());
        this.durationExtractor = new baseDuration_1.BaseDurationExtractor(new durationConfiguration_1.FrenchDurationExtractorConfiguration());
        this.setExtractor = new baseSet_1.BaseSetExtractor(new setConfiguration_1.FrenchSetExtractorConfiguration());
        this.holidayExtractor = new baseHoliday_1.BaseHolidayExtractor(new holidayConfiguration_1.FrenchHolidayExtractorConfiguration());
        this.integerExtractor = new recognizers_text_number_1.FrenchIntegerExtractor();
        this.filterWordRegexList = [];
    }
}
exports.FrenchMergedExtractorConfiguration = FrenchMergedExtractorConfiguration;
class FrenchMergedParserConfiguration extends baseConfiguration_1.FrenchCommonDateTimeParserConfiguration {
    constructor() {
        super();
        this.beforeRegex = recognizers_text_1.RegExpUtility.getSafeRegExp(frenchDateTime_1.FrenchDateTime.BeforeRegex);
        this.afterRegex = recognizers_text_1.RegExpUtility.getSafeRegExp(frenchDateTime_1.FrenchDateTime.AfterRegex);
        this.sinceRegex = recognizers_text_1.RegExpUtility.getSafeRegExp(frenchDateTime_1.FrenchDateTime.SinceRegex);
        this.datePeriodParser = new baseDatePeriod_1.BaseDatePeriodParser(new datePeriodConfiguration_1.FrenchDatePeriodParserConfiguration(this));
        this.timePeriodParser = new baseTimePeriod_1.BaseTimePeriodParser(new timePeriodConfiguration_1.FrenchTimePeriodParserConfiguration(this));
        this.setParser = new baseSet_1.BaseSetParser(new setConfiguration_1.FrenchSetParserConfiguration(this));
        this.holidayParser = new baseHoliday_1.BaseHolidayParser(new holidayConfiguration_1.FrenchHolidayParserConfiguration());
    }
}
exports.FrenchMergedParserConfiguration = FrenchMergedParserConfiguration;
//# sourceMappingURL=mergedConfiguration.js.map