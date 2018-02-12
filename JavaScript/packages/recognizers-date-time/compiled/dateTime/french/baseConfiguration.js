"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const recognizers_text_1 = require("recognizers-text");
const recognizers_text_number_1 = require("recognizers-text-number");
const frenchDateTime_1 = require("../../resources/frenchDateTime");
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
class FrenchDateTimeUtilityConfiguration {
    constructor() {
        this.laterRegex = recognizers_text_1.RegExpUtility.getSafeRegExp(frenchDateTime_1.FrenchDateTime.LaterRegex);
        this.agoRegex = recognizers_text_1.RegExpUtility.getSafeRegExp(frenchDateTime_1.FrenchDateTime.AgoPrefixRegex);
        this.inConnectorRegex = recognizers_text_1.RegExpUtility.getSafeRegExp(frenchDateTime_1.FrenchDateTime.InConnectorRegex);
        this.rangeUnitRegex = recognizers_text_1.RegExpUtility.getSafeRegExp(frenchDateTime_1.FrenchDateTime.RangeUnitRegex);
        this.amDescRegex = recognizers_text_1.RegExpUtility.getSafeRegExp(frenchDateTime_1.FrenchDateTime.AmDescRegex);
        this.pmDescRegex = recognizers_text_1.RegExpUtility.getSafeRegExp(frenchDateTime_1.FrenchDateTime.PmDescRegex);
        this.amPmDescRegex = recognizers_text_1.RegExpUtility.getSafeRegExp(frenchDateTime_1.FrenchDateTime.AmPmDescRegex);
    }
}
exports.FrenchDateTimeUtilityConfiguration = FrenchDateTimeUtilityConfiguration;
class FrenchCommonDateTimeParserConfiguration extends parsers_1.BaseDateParserConfiguration {
    constructor() {
        super();
        this.utilityConfiguration = new FrenchDateTimeUtilityConfiguration();
        this.unitMap = frenchDateTime_1.FrenchDateTime.UnitMap;
        this.unitValueMap = frenchDateTime_1.FrenchDateTime.UnitValueMap;
        this.seasonMap = frenchDateTime_1.FrenchDateTime.SeasonMap;
        this.cardinalMap = frenchDateTime_1.FrenchDateTime.CardinalMap;
        this.dayOfWeek = frenchDateTime_1.FrenchDateTime.DayOfWeek;
        this.monthOfYear = frenchDateTime_1.FrenchDateTime.MonthOfYear;
        this.numbers = frenchDateTime_1.FrenchDateTime.Numbers;
        this.doubleNumbers = frenchDateTime_1.FrenchDateTime.DoubleNumbers;
        this.cardinalExtractor = new recognizers_text_number_1.FrenchCardinalExtractor();
        this.integerExtractor = new recognizers_text_number_1.FrenchIntegerExtractor();
        this.ordinalExtractor = new recognizers_text_number_1.FrenchOrdinalExtractor();
        this.numberParser = new recognizers_text_number_1.BaseNumberParser(new recognizers_text_number_1.FrenchNumberParserConfiguration());
        this.dateExtractor = new baseDate_1.BaseDateExtractor(new dateConfiguration_1.FrenchDateExtractorConfiguration());
        this.timeExtractor = new baseTime_1.BaseTimeExtractor(new timeConfiguration_1.FrenchTimeExtractorConfiguration());
        this.dateTimeExtractor = new baseDateTime_1.BaseDateTimeExtractor(new dateTimeConfiguration_1.FrenchDateTimeExtractorConfiguration());
        this.durationExtractor = new baseDuration_1.BaseDurationExtractor(new durationConfiguration_1.FrenchDurationExtractorConfiguration());
        this.datePeriodExtractor = new baseDatePeriod_1.BaseDatePeriodExtractor(new datePeriodConfiguration_1.FrenchDatePeriodExtractorConfiguration());
        this.timePeriodExtractor = new baseTimePeriod_1.BaseTimePeriodExtractor(new timePeriodConfiguration_1.FrenchTimePeriodExtractorConfiguration());
        this.dateTimePeriodExtractor = new baseDateTimePeriod_1.BaseDateTimePeriodExtractor(new dateTimePeriodConfiguration_1.FrenchDateTimePeriodExtractorConfiguration());
        this.durationParser = new baseDuration_1.BaseDurationParser(new durationConfiguration_1.FrenchDurationParserConfiguration(this));
        this.dateParser = new baseDate_1.BaseDateParser(new dateConfiguration_1.FrenchDateParserConfiguration(this));
        this.timeParser = new baseTime_1.BaseTimeParser(new timeConfiguration_1.FrenchTimeParserConfiguration(this));
        this.dateTimeParser = new baseDateTime_1.BaseDateTimeParser(new dateTimeConfiguration_1.FrenchDateTimeParserConfiguration(this));
        this.datePeriodParser = new baseDatePeriod_1.BaseDatePeriodParser(new datePeriodConfiguration_1.FrenchDatePeriodParserConfiguration(this));
        this.timePeriodParser = new baseTimePeriod_1.BaseTimePeriodParser(new timePeriodConfiguration_1.FrenchTimePeriodParserConfiguration(this));
        this.dateTimePeriodParser = new baseDateTimePeriod_1.BaseDateTimePeriodParser(new dateTimePeriodConfiguration_1.FrenchDateTimePeriodParserConfiguration(this));
    }
}
exports.FrenchCommonDateTimeParserConfiguration = FrenchCommonDateTimeParserConfiguration;
//# sourceMappingURL=baseConfiguration.js.map