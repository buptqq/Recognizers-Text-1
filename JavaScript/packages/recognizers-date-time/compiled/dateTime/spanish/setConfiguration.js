"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const recognizers_text_1 = require("recognizers-text");
const baseDuration_1 = require("../baseDuration");
const baseTime_1 = require("../baseTime");
const baseDate_1 = require("../baseDate");
const baseDateTime_1 = require("../baseDateTime");
const baseDatePeriod_1 = require("../baseDatePeriod");
const baseTimePeriod_1 = require("../baseTimePeriod");
const baseDateTimePeriod_1 = require("../baseDateTimePeriod");
const spanishDateTime_1 = require("../../resources/spanishDateTime");
const durationConfiguration_1 = require("./durationConfiguration");
const dateConfiguration_1 = require("./dateConfiguration");
const dateTimeConfiguration_1 = require("./dateTimeConfiguration");
const datePeriodConfiguration_1 = require("./datePeriodConfiguration");
const dateTimePeriodConfiguration_1 = require("./dateTimePeriodConfiguration");
const timeConfiguration_1 = require("./timeConfiguration");
const timePeriodConfiguration_1 = require("./timePeriodConfiguration");
class SpanishSetExtractorConfiguration {
    constructor() {
        this.lastRegex = recognizers_text_1.RegExpUtility.getSafeRegExp(spanishDateTime_1.SpanishDateTime.LastDateRegex, "gis");
        this.periodicRegex = recognizers_text_1.RegExpUtility.getSafeRegExp(spanishDateTime_1.SpanishDateTime.PeriodicRegex, "gis");
        this.eachUnitRegex = recognizers_text_1.RegExpUtility.getSafeRegExp(spanishDateTime_1.SpanishDateTime.EachUnitRegex, "gis");
        this.eachPrefixRegex = recognizers_text_1.RegExpUtility.getSafeRegExp(spanishDateTime_1.SpanishDateTime.EachPrefixRegex, "gis");
        this.eachDayRegex = recognizers_text_1.RegExpUtility.getSafeRegExp(spanishDateTime_1.SpanishDateTime.EachDayRegex, "gis");
        this.beforeEachDayRegex = recognizers_text_1.RegExpUtility.getSafeRegExp(spanishDateTime_1.SpanishDateTime.BeforeEachDayRegex, "gis");
        this.setEachRegex = recognizers_text_1.RegExpUtility.getSafeRegExp(spanishDateTime_1.SpanishDateTime.SetEachRegex, "gis");
        this.setWeekDayRegex = recognizers_text_1.RegExpUtility.getSafeRegExp(spanishDateTime_1.SpanishDateTime.SetWeekDayRegex, "gis");
        this.durationExtractor = new baseDuration_1.BaseDurationExtractor(new durationConfiguration_1.SpanishDurationExtractorConfiguration());
        this.timeExtractor = new baseTime_1.BaseTimeExtractor(new timeConfiguration_1.SpanishTimeExtractorConfiguration());
        this.dateExtractor = new baseDate_1.BaseDateExtractor(new dateConfiguration_1.SpanishDateExtractorConfiguration());
        this.dateTimeExtractor = new baseDateTime_1.BaseDateTimeExtractor(new dateTimeConfiguration_1.SpanishDateTimeExtractorConfiguration());
        this.datePeriodExtractor = new baseDatePeriod_1.BaseDatePeriodExtractor(new datePeriodConfiguration_1.SpanishDatePeriodExtractorConfiguration());
        this.timePeriodExtractor = new baseTimePeriod_1.BaseTimePeriodExtractor(new timePeriodConfiguration_1.SpanishTimePeriodExtractorConfiguration());
        this.dateTimePeriodExtractor = new baseDateTimePeriod_1.BaseDateTimePeriodExtractor(new dateTimePeriodConfiguration_1.SpanishDateTimePeriodExtractorConfiguration());
    }
}
exports.SpanishSetExtractorConfiguration = SpanishSetExtractorConfiguration;
class SpanishSetParserConfiguration {
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
        this.eachPrefixRegex = recognizers_text_1.RegExpUtility.getSafeRegExp(spanishDateTime_1.SpanishDateTime.EachPrefixRegex, "gis");
        this.periodicRegex = recognizers_text_1.RegExpUtility.getSafeRegExp(spanishDateTime_1.SpanishDateTime.PeriodicRegex, "gis");
        this.eachUnitRegex = recognizers_text_1.RegExpUtility.getSafeRegExp(spanishDateTime_1.SpanishDateTime.EachUnitRegex, "gis");
        this.eachDayRegex = recognizers_text_1.RegExpUtility.getSafeRegExp(spanishDateTime_1.SpanishDateTime.EachDayRegex, "gis");
        this.setWeekDayRegex = recognizers_text_1.RegExpUtility.getSafeRegExp(spanishDateTime_1.SpanishDateTime.SetWeekDayRegex, "gis");
        this.setEachRegex = recognizers_text_1.RegExpUtility.getSafeRegExp(spanishDateTime_1.SpanishDateTime.SetEachRegex, "gis");
    }
    getMatchedDailyTimex(text) {
        let trimedText = text.trim().toLowerCase();
        let timex = "";
        if (trimedText.endsWith("diario") || trimedText.endsWith("diariamente")) {
            timex = "P1D";
        }
        else if (trimedText === "semanalmente") {
            timex = "P1W";
        }
        else if (trimedText === "quincenalmente") {
            timex = "P2W";
        }
        else if (trimedText === "mensualmente") {
            timex = "P1M";
        }
        else if (trimedText === "anualmente") {
            timex = "P1Y";
        }
        else {
            timex = null;
            return {
                timex,
                matched: false
            };
        }
        return {
            timex,
            matched: true
        };
    }
    getMatchedUnitTimex(text) {
        let trimedText = text.trim().toLowerCase();
        let timex = "";
        if (trimedText === "día" || trimedText === "dia" ||
            trimedText === "días" || trimedText === "dias") {
            timex = "P1D";
        }
        else if (trimedText === "semana" || trimedText === "semanas") {
            timex = "P1W";
        }
        else if (trimedText === "mes" || trimedText === "meses") {
            timex = "P1M";
        }
        else if (trimedText === "año" || trimedText === "años") {
            timex = "P1Y";
        }
        else {
            timex = null;
            return {
                matched: false,
                timex
            };
        }
        return {
            matched: true,
            timex
        };
    }
}
exports.SpanishSetParserConfiguration = SpanishSetParserConfiguration;
//# sourceMappingURL=setConfiguration.js.map