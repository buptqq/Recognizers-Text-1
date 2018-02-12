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
const frenchDateTime_1 = require("../../resources/frenchDateTime");
const durationConfiguration_1 = require("./durationConfiguration");
const dateConfiguration_1 = require("./dateConfiguration");
const dateTimeConfiguration_1 = require("./dateTimeConfiguration");
const datePeriodConfiguration_1 = require("./datePeriodConfiguration");
const dateTimePeriodConfiguration_1 = require("./dateTimePeriodConfiguration");
const timeConfiguration_1 = require("./timeConfiguration");
const timePeriodConfiguration_1 = require("./timePeriodConfiguration");
class FrenchSetExtractorConfiguration {
    constructor() {
        this.lastRegex = recognizers_text_1.RegExpUtility.getSafeRegExp(frenchDateTime_1.FrenchDateTime.SetLastRegex, "gis");
        this.periodicRegex = recognizers_text_1.RegExpUtility.getSafeRegExp(frenchDateTime_1.FrenchDateTime.PeriodicRegex, "gis");
        this.eachUnitRegex = recognizers_text_1.RegExpUtility.getSafeRegExp(frenchDateTime_1.FrenchDateTime.EachUnitRegex, "gis");
        this.eachPrefixRegex = recognizers_text_1.RegExpUtility.getSafeRegExp(frenchDateTime_1.FrenchDateTime.EachPrefixRegex, "gis");
        this.eachDayRegex = recognizers_text_1.RegExpUtility.getSafeRegExp(frenchDateTime_1.FrenchDateTime.EachDayRegex, "gis");
        this.beforeEachDayRegex = null;
        this.setEachRegex = recognizers_text_1.RegExpUtility.getSafeRegExp(frenchDateTime_1.FrenchDateTime.SetEachRegex, "gis");
        this.setWeekDayRegex = recognizers_text_1.RegExpUtility.getSafeRegExp(frenchDateTime_1.FrenchDateTime.SetWeekDayRegex, "gis");
        this.durationExtractor = new baseDuration_1.BaseDurationExtractor(new durationConfiguration_1.FrenchDurationExtractorConfiguration());
        this.timeExtractor = new baseTime_1.BaseTimeExtractor(new timeConfiguration_1.FrenchTimeExtractorConfiguration());
        this.dateExtractor = new baseDate_1.BaseDateExtractor(new dateConfiguration_1.FrenchDateExtractorConfiguration());
        this.dateTimeExtractor = new baseDateTime_1.BaseDateTimeExtractor(new dateTimeConfiguration_1.FrenchDateTimeExtractorConfiguration());
        this.datePeriodExtractor = new baseDatePeriod_1.BaseDatePeriodExtractor(new datePeriodConfiguration_1.FrenchDatePeriodExtractorConfiguration());
        this.timePeriodExtractor = new baseTimePeriod_1.BaseTimePeriodExtractor(new timePeriodConfiguration_1.FrenchTimePeriodExtractorConfiguration());
        this.dateTimePeriodExtractor = new baseDateTimePeriod_1.BaseDateTimePeriodExtractor(new dateTimePeriodConfiguration_1.FrenchDateTimePeriodExtractorConfiguration());
    }
}
exports.FrenchSetExtractorConfiguration = FrenchSetExtractorConfiguration;
class FrenchSetParserConfiguration {
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
        this.eachPrefixRegex = recognizers_text_1.RegExpUtility.getSafeRegExp(frenchDateTime_1.FrenchDateTime.EachPrefixRegex, "gis");
        this.periodicRegex = recognizers_text_1.RegExpUtility.getSafeRegExp(frenchDateTime_1.FrenchDateTime.PeriodicRegex, "gis");
        this.eachUnitRegex = recognizers_text_1.RegExpUtility.getSafeRegExp(frenchDateTime_1.FrenchDateTime.EachUnitRegex, "gis");
        this.eachDayRegex = recognizers_text_1.RegExpUtility.getSafeRegExp(frenchDateTime_1.FrenchDateTime.EachDayRegex, "gis");
        this.setWeekDayRegex = recognizers_text_1.RegExpUtility.getSafeRegExp(frenchDateTime_1.FrenchDateTime.SetWeekDayRegex, "gis");
        this.setEachRegex = recognizers_text_1.RegExpUtility.getSafeRegExp(frenchDateTime_1.FrenchDateTime.SetEachRegex, "gis");
    }
    getMatchedDailyTimex(text) {
        let trimedText = text.trim().toLowerCase();
        let timex = "";
        if (trimedText === "quotidien" || trimedText === "quotidienne" ||
            trimedText === "jours" || trimedText === "journellement") {
            timex = "P1D";
        }
        else if (trimedText === "hebdomadaire") {
            timex = "P1W";
        }
        else if (trimedText === "bihebdomadaire") {
            timex = "P2W";
        }
        else if (trimedText === "mensuel") {
            timex = "P1M";
        }
        else if (trimedText === "annuel") {
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
        if (trimedText === "jour" || trimedText === "journee") {
            timex = "P1D";
        }
        else if (trimedText === "semaine") {
            timex = "P1W";
        }
        else if (trimedText === "mois") {
            timex = "P1M";
        }
        else if (trimedText === "an" || trimedText === "annee") {
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
exports.FrenchSetParserConfiguration = FrenchSetParserConfiguration;
//# sourceMappingURL=setConfiguration.js.map