"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const recognizers_text_1 = require("recognizers-text");
const recognizers_text_number_1 = require("recognizers-text-number");
const spanishDateTime_1 = require("../../resources/spanishDateTime");
const parsers_1 = require("../parsers");
const baseDate_1 = require("../baseDate");
const baseTime_1 = require("../baseTime");
const baseDateTime_1 = require("../baseDateTime");
const baseDuration_1 = require("../baseDuration");
const baseDatePeriod_1 = require("../baseDatePeriod");
const baseTimePeriod_1 = require("../baseTimePeriod");
const baseDateTimePeriod_1 = require("../baseDateTimePeriod");
const dateConfiguration_1 = require("./dateConfiguration");
const dateTimeConfiguration_1 = require("./dateTimeConfiguration");
const durationConfiguration_1 = require("./durationConfiguration");
const datePeriodConfiguration_1 = require("./datePeriodConfiguration");
const timeConfiguration_1 = require("./timeConfiguration");
const timePeriodConfiguration_1 = require("./timePeriodConfiguration");
const dateTimePeriodConfiguration_1 = require("./dateTimePeriodConfiguration");
class SpanishDateTimeUtilityConfiguration {
    constructor() {
        this.laterRegex = recognizers_text_1.RegExpUtility.getSafeRegExp(spanishDateTime_1.SpanishDateTime.LaterRegex);
        this.agoRegex = recognizers_text_1.RegExpUtility.getSafeRegExp(spanishDateTime_1.SpanishDateTime.AgoRegex);
        this.inConnectorRegex = recognizers_text_1.RegExpUtility.getSafeRegExp(spanishDateTime_1.SpanishDateTime.InConnectorRegex);
        this.rangeUnitRegex = recognizers_text_1.RegExpUtility.getSafeRegExp(spanishDateTime_1.SpanishDateTime.RangeUnitRegex);
        this.amDescRegex = recognizers_text_1.RegExpUtility.getSafeRegExp(spanishDateTime_1.SpanishDateTime.AmDescRegex);
        this.pmDescRegex = recognizers_text_1.RegExpUtility.getSafeRegExp(spanishDateTime_1.SpanishDateTime.PmDescRegex);
        this.amPmDescRegex = recognizers_text_1.RegExpUtility.getSafeRegExp(spanishDateTime_1.SpanishDateTime.AmPmDescRegex);
    }
}
exports.SpanishDateTimeUtilityConfiguration = SpanishDateTimeUtilityConfiguration;
class SpanishCommonDateTimeParserConfiguration extends parsers_1.BaseDateParserConfiguration {
    constructor() {
        super();
        this.utilityConfiguration = new SpanishDateTimeUtilityConfiguration();
        this.unitMap = spanishDateTime_1.SpanishDateTime.UnitMap;
        this.unitValueMap = spanishDateTime_1.SpanishDateTime.UnitValueMap;
        this.seasonMap = spanishDateTime_1.SpanishDateTime.SeasonMap;
        this.cardinalMap = spanishDateTime_1.SpanishDateTime.CardinalMap;
        this.dayOfWeek = spanishDateTime_1.SpanishDateTime.DayOfWeek;
        this.monthOfYear = spanishDateTime_1.SpanishDateTime.MonthOfYear;
        this.numbers = spanishDateTime_1.SpanishDateTime.Numbers;
        this.doubleNumbers = spanishDateTime_1.SpanishDateTime.DoubleNumbers;
        this.cardinalExtractor = new recognizers_text_number_1.SpanishCardinalExtractor();
        this.integerExtractor = new recognizers_text_number_1.SpanishIntegerExtractor();
        this.ordinalExtractor = new recognizers_text_number_1.SpanishOrdinalExtractor();
        this.numberParser = new recognizers_text_number_1.BaseNumberParser(new recognizers_text_number_1.SpanishNumberParserConfiguration());
        this.dateExtractor = new baseDate_1.BaseDateExtractor(new dateConfiguration_1.SpanishDateExtractorConfiguration());
        this.timeExtractor = new baseTime_1.BaseTimeExtractor(new timeConfiguration_1.SpanishTimeExtractorConfiguration());
        this.dateTimeExtractor = new baseDateTime_1.BaseDateTimeExtractor(new dateTimeConfiguration_1.SpanishDateTimeExtractorConfiguration());
        this.durationExtractor = new baseDuration_1.BaseDurationExtractor(new durationConfiguration_1.SpanishDurationExtractorConfiguration());
        this.datePeriodExtractor = new baseDatePeriod_1.BaseDatePeriodExtractor(new datePeriodConfiguration_1.SpanishDatePeriodExtractorConfiguration());
        this.timePeriodExtractor = new baseTimePeriod_1.BaseTimePeriodExtractor(new timePeriodConfiguration_1.SpanishTimePeriodExtractorConfiguration());
        this.dateTimePeriodExtractor = new baseDateTimePeriod_1.BaseDateTimePeriodExtractor(new dateTimePeriodConfiguration_1.SpanishDateTimePeriodExtractorConfiguration());
        this.durationParser = new baseDuration_1.BaseDurationParser(new durationConfiguration_1.SpanishDurationParserConfiguration(this));
        this.dateParser = new baseDate_1.BaseDateParser(new dateConfiguration_1.SpanishDateParserConfiguration(this));
        this.timeParser = new baseTime_1.BaseTimeParser(new timeConfiguration_1.SpanishTimeParserConfiguration(this));
        this.dateTimeParser = new baseDateTime_1.BaseDateTimeParser(new dateTimeConfiguration_1.SpanishDateTimeParserConfiguration(this));
        this.datePeriodParser = new baseDatePeriod_1.BaseDatePeriodParser(new datePeriodConfiguration_1.SpanishDatePeriodParserConfiguration(this));
        this.timePeriodParser = new baseTimePeriod_1.BaseTimePeriodParser(new timePeriodConfiguration_1.SpanishTimePeriodParserConfiguration(this));
        this.dateTimePeriodParser = new baseDateTimePeriod_1.BaseDateTimePeriodParser(new dateTimePeriodConfiguration_1.SpanishDateTimePeriodParserConfiguration(this));
    }
}
exports.SpanishCommonDateTimeParserConfiguration = SpanishCommonDateTimeParserConfiguration;
//# sourceMappingURL=baseConfiguration.js.map