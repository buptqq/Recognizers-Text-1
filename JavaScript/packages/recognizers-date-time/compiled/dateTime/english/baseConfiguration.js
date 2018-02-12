"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const recognizers_text_1 = require("recognizers-text");
const recognizers_text_number_1 = require("recognizers-text-number");
const englishDateTime_1 = require("../../resources/englishDateTime");
const baseDateTime_1 = require("../../resources/baseDateTime");
const parsers_1 = require("../parsers");
const baseDate_1 = require("../baseDate");
const baseTime_1 = require("../baseTime");
const baseDatePeriod_1 = require("../baseDatePeriod");
const baseTimePeriod_1 = require("../baseTimePeriod");
const baseDateTime_2 = require("../baseDateTime");
const baseDateTimePeriod_1 = require("../baseDateTimePeriod");
const baseDuration_1 = require("../baseDuration");
const durationConfiguration_1 = require("./durationConfiguration");
const timeConfiguration_1 = require("./timeConfiguration");
const dateConfiguration_1 = require("./dateConfiguration");
const dateTimeConfiguration_1 = require("./dateTimeConfiguration");
const timePeriodConfiguration_1 = require("./timePeriodConfiguration");
const datePeriodConfiguration_1 = require("./datePeriodConfiguration");
const dateTimePeriodConfiguration_1 = require("./dateTimePeriodConfiguration");
const parsers_2 = require("./parsers");
class EnglishDateTimeUtilityConfiguration {
    constructor() {
        this.laterRegex = recognizers_text_1.RegExpUtility.getSafeRegExp(englishDateTime_1.EnglishDateTime.LaterRegex);
        this.agoRegex = recognizers_text_1.RegExpUtility.getSafeRegExp(englishDateTime_1.EnglishDateTime.AgoRegex);
        this.inConnectorRegex = recognizers_text_1.RegExpUtility.getSafeRegExp(englishDateTime_1.EnglishDateTime.InConnectorRegex);
        this.rangeUnitRegex = recognizers_text_1.RegExpUtility.getSafeRegExp(englishDateTime_1.EnglishDateTime.RangeUnitRegex);
        this.amDescRegex = recognizers_text_1.RegExpUtility.getSafeRegExp(englishDateTime_1.EnglishDateTime.AmDescRegex);
        this.pmDescRegex = recognizers_text_1.RegExpUtility.getSafeRegExp(englishDateTime_1.EnglishDateTime.PmDescRegex);
        this.amPmDescRegex = recognizers_text_1.RegExpUtility.getSafeRegExp(englishDateTime_1.EnglishDateTime.AmPmDescRegex);
    }
}
exports.EnglishDateTimeUtilityConfiguration = EnglishDateTimeUtilityConfiguration;
class EnglishCommonDateTimeParserConfiguration extends parsers_1.BaseDateParserConfiguration {
    constructor() {
        super();
        this.utilityConfiguration = new EnglishDateTimeUtilityConfiguration();
        this.unitMap = englishDateTime_1.EnglishDateTime.UnitMap;
        this.unitValueMap = englishDateTime_1.EnglishDateTime.UnitValueMap;
        this.seasonMap = englishDateTime_1.EnglishDateTime.SeasonMap;
        this.cardinalMap = englishDateTime_1.EnglishDateTime.CardinalMap;
        this.dayOfWeek = englishDateTime_1.EnglishDateTime.DayOfWeek;
        this.monthOfYear = englishDateTime_1.EnglishDateTime.MonthOfYear;
        this.numbers = englishDateTime_1.EnglishDateTime.Numbers;
        this.doubleNumbers = englishDateTime_1.EnglishDateTime.DoubleNumbers;
        this.cardinalExtractor = new recognizers_text_number_1.EnglishCardinalExtractor();
        this.integerExtractor = new recognizers_text_number_1.EnglishIntegerExtractor();
        this.ordinalExtractor = new recognizers_text_number_1.EnglishOrdinalExtractor();
        this.dayOfMonth = new Map([...baseDateTime_1.BaseDateTime.DayOfMonthDictionary, ...englishDateTime_1.EnglishDateTime.DayOfMonth]);
        this.numberParser = new recognizers_text_number_1.BaseNumberParser(new recognizers_text_number_1.EnglishNumberParserConfiguration());
        this.dateExtractor = new baseDate_1.BaseDateExtractor(new dateConfiguration_1.EnglishDateExtractorConfiguration());
        this.timeExtractor = new baseTime_1.BaseTimeExtractor(new timeConfiguration_1.EnglishTimeExtractorConfiguration());
        this.dateTimeExtractor = new baseDateTime_2.BaseDateTimeExtractor(new dateTimeConfiguration_1.EnglishDateTimeExtractorConfiguration());
        this.durationExtractor = new baseDuration_1.BaseDurationExtractor(new durationConfiguration_1.EnglishDurationExtractorConfiguration());
        this.datePeriodExtractor = new baseDatePeriod_1.BaseDatePeriodExtractor(new datePeriodConfiguration_1.EnglishDatePeriodExtractorConfiguration());
        this.timePeriodExtractor = new baseTimePeriod_1.BaseTimePeriodExtractor(new timePeriodConfiguration_1.EnglishTimePeriodExtractorConfiguration());
        this.dateTimePeriodExtractor = new baseDateTimePeriod_1.BaseDateTimePeriodExtractor(new dateTimePeriodConfiguration_1.EnglishDateTimePeriodExtractorConfiguration());
        this.durationParser = new baseDuration_1.BaseDurationParser(new durationConfiguration_1.EnglishDurationParserConfiguration(this));
        this.dateParser = new baseDate_1.BaseDateParser(new dateConfiguration_1.EnglishDateParserConfiguration(this));
        this.timeParser = new parsers_2.EnglishTimeParser(new timeConfiguration_1.EnglishTimeParserConfiguration(this));
        this.dateTimeParser = new baseDateTime_2.BaseDateTimeParser(new dateTimeConfiguration_1.EnglishDateTimeParserConfiguration(this));
        this.datePeriodParser = new baseDatePeriod_1.BaseDatePeriodParser(new datePeriodConfiguration_1.EnglishDatePeriodParserConfiguration(this));
        this.timePeriodParser = new baseTimePeriod_1.BaseTimePeriodParser(new timePeriodConfiguration_1.EnglishTimePeriodParserConfiguration(this));
        this.dateTimePeriodParser = new baseDateTimePeriod_1.BaseDateTimePeriodParser(new dateTimePeriodConfiguration_1.EnglishDateTimePeriodParserConfiguration(this));
    }
}
exports.EnglishCommonDateTimeParserConfiguration = EnglishCommonDateTimeParserConfiguration;
//# sourceMappingURL=baseConfiguration.js.map