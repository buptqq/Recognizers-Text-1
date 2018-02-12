"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const recognizers_text_1 = require("recognizers-text");
const recognizers_text_number_1 = require("recognizers-text-number");
const frenchDateTime_1 = require("../../resources/frenchDateTime");
const baseDuration_1 = require("../baseDuration");
const baseConfiguration_1 = require("./baseConfiguration");
const durationConfiguration_1 = require("./durationConfiguration");
class FrenchDateExtractorConfiguration {
    constructor() {
        this.dateRegexList = [
            recognizers_text_1.RegExpUtility.getSafeRegExp(frenchDateTime_1.FrenchDateTime.DateExtractor1, "gis"),
            recognizers_text_1.RegExpUtility.getSafeRegExp(frenchDateTime_1.FrenchDateTime.DateExtractor2, "gis"),
            recognizers_text_1.RegExpUtility.getSafeRegExp(frenchDateTime_1.FrenchDateTime.DateExtractor3, "gis"),
            recognizers_text_1.RegExpUtility.getSafeRegExp(frenchDateTime_1.FrenchDateTime.DateExtractor4, "gis"),
            recognizers_text_1.RegExpUtility.getSafeRegExp(frenchDateTime_1.FrenchDateTime.DateExtractor5, "gis"),
            recognizers_text_1.RegExpUtility.getSafeRegExp(frenchDateTime_1.FrenchDateTime.DateExtractor6, "gis"),
            recognizers_text_1.RegExpUtility.getSafeRegExp(frenchDateTime_1.FrenchDateTime.DateExtractor7, "gis"),
            recognizers_text_1.RegExpUtility.getSafeRegExp(frenchDateTime_1.FrenchDateTime.DateExtractor8, "gis"),
            recognizers_text_1.RegExpUtility.getSafeRegExp(frenchDateTime_1.FrenchDateTime.DateExtractor9, "gis"),
            recognizers_text_1.RegExpUtility.getSafeRegExp(frenchDateTime_1.FrenchDateTime.DateExtractorA, "gis"),
        ];
        this.implicitDateList = [
            recognizers_text_1.RegExpUtility.getSafeRegExp(frenchDateTime_1.FrenchDateTime.OnRegex, "gis"),
            recognizers_text_1.RegExpUtility.getSafeRegExp(frenchDateTime_1.FrenchDateTime.RelaxedOnRegex, "gis"),
            recognizers_text_1.RegExpUtility.getSafeRegExp(frenchDateTime_1.FrenchDateTime.SpecialDayRegex, "gis"),
            recognizers_text_1.RegExpUtility.getSafeRegExp(frenchDateTime_1.FrenchDateTime.ThisRegex, "gis"),
            recognizers_text_1.RegExpUtility.getSafeRegExp(frenchDateTime_1.FrenchDateTime.LastDateRegex, "gis"),
            recognizers_text_1.RegExpUtility.getSafeRegExp(frenchDateTime_1.FrenchDateTime.NextDateRegex, "gis"),
            recognizers_text_1.RegExpUtility.getSafeRegExp(frenchDateTime_1.FrenchDateTime.StrictWeekDay, "gis"),
            recognizers_text_1.RegExpUtility.getSafeRegExp(frenchDateTime_1.FrenchDateTime.WeekDayOfMonthRegex, "gis"),
            recognizers_text_1.RegExpUtility.getSafeRegExp(frenchDateTime_1.FrenchDateTime.SpecialDate, "gis")
        ];
        this.monthEnd = recognizers_text_1.RegExpUtility.getSafeRegExp(frenchDateTime_1.FrenchDateTime.MonthEnd, "gis");
        this.ofMonth = recognizers_text_1.RegExpUtility.getSafeRegExp(frenchDateTime_1.FrenchDateTime.OfMonth, "gis");
        this.dateUnitRegex = recognizers_text_1.RegExpUtility.getSafeRegExp(frenchDateTime_1.FrenchDateTime.DateUnitRegex, "gis");
        this.forTheRegex = recognizers_text_1.RegExpUtility.getSafeRegExp(frenchDateTime_1.FrenchDateTime.ForTheRegex, "gis");
        this.weekDayAndDayOfMothRegex = recognizers_text_1.RegExpUtility.getSafeRegExp(frenchDateTime_1.FrenchDateTime.WeekDayAndDayOfMothRegex, "gis");
        this.relativeMonthRegex = recognizers_text_1.RegExpUtility.getSafeRegExp(frenchDateTime_1.FrenchDateTime.RelativeMonthRegex, "gis");
        this.weekDayRegex = recognizers_text_1.RegExpUtility.getSafeRegExp(frenchDateTime_1.FrenchDateTime.WeekDayRegex, "gis");
        this.dayOfWeek = frenchDateTime_1.FrenchDateTime.DayOfWeek;
        this.ordinalExtractor = new recognizers_text_number_1.FrenchOrdinalExtractor();
        this.integerExtractor = new recognizers_text_number_1.FrenchIntegerExtractor();
        this.numberParser = new recognizers_text_number_1.BaseNumberParser(new recognizers_text_number_1.FrenchNumberParserConfiguration());
        this.durationExtractor = new baseDuration_1.BaseDurationExtractor(new durationConfiguration_1.FrenchDurationExtractorConfiguration());
        this.utilityConfiguration = new baseConfiguration_1.FrenchDateTimeUtilityConfiguration();
        this.nonDateUnitRegex = recognizers_text_1.RegExpUtility.getSafeRegExp("(?<unit>heure|heures|hrs|secondes|seconde|secs|sec|minutes|minute|mins)\b", "gis");
    }
}
exports.FrenchDateExtractorConfiguration = FrenchDateExtractorConfiguration;
class FrenchDateParserConfiguration {
    constructor(config) {
        this.ordinalExtractor = config.ordinalExtractor;
        this.integerExtractor = config.integerExtractor;
        this.cardinalExtractor = config.cardinalExtractor;
        this.durationExtractor = config.durationExtractor;
        this.numberParser = config.numberParser;
        this.durationParser = config.durationParser;
        this.monthOfYear = config.monthOfYear;
        this.dayOfMonth = config.dayOfMonth;
        this.dayOfWeek = config.dayOfWeek;
        this.unitMap = config.unitMap;
        this.cardinalMap = config.cardinalMap;
        this.dateRegex = [
            recognizers_text_1.RegExpUtility.getSafeRegExp(frenchDateTime_1.FrenchDateTime.DateExtractor1, "gis"),
            recognizers_text_1.RegExpUtility.getSafeRegExp(frenchDateTime_1.FrenchDateTime.DateExtractor2, "gis"),
            recognizers_text_1.RegExpUtility.getSafeRegExp(frenchDateTime_1.FrenchDateTime.DateExtractor3, "gis"),
            recognizers_text_1.RegExpUtility.getSafeRegExp(frenchDateTime_1.FrenchDateTime.DateExtractor4, "gis"),
            recognizers_text_1.RegExpUtility.getSafeRegExp(frenchDateTime_1.FrenchDateTime.DateExtractor5, "gis"),
            recognizers_text_1.RegExpUtility.getSafeRegExp(frenchDateTime_1.FrenchDateTime.DateExtractor6, "gis"),
            recognizers_text_1.RegExpUtility.getSafeRegExp(frenchDateTime_1.FrenchDateTime.DateExtractor7, "gis"),
            recognizers_text_1.RegExpUtility.getSafeRegExp(frenchDateTime_1.FrenchDateTime.DateExtractor8, "gis"),
            recognizers_text_1.RegExpUtility.getSafeRegExp(frenchDateTime_1.FrenchDateTime.DateExtractor9, "gis"),
            recognizers_text_1.RegExpUtility.getSafeRegExp(frenchDateTime_1.FrenchDateTime.DateExtractorA, "gis"),
        ];
        this.onRegex = recognizers_text_1.RegExpUtility.getSafeRegExp(frenchDateTime_1.FrenchDateTime.OnRegex, "gis");
        this.specialDayRegex = recognizers_text_1.RegExpUtility.getSafeRegExp(frenchDateTime_1.FrenchDateTime.SpecialDayRegex, "gis");
        this.nextRegex = recognizers_text_1.RegExpUtility.getSafeRegExp(frenchDateTime_1.FrenchDateTime.NextDateRegex, "gis");
        this.unitRegex = recognizers_text_1.RegExpUtility.getSafeRegExp(frenchDateTime_1.FrenchDateTime.DateUnitRegex, "gis");
        this.monthRegex = recognizers_text_1.RegExpUtility.getSafeRegExp(frenchDateTime_1.FrenchDateTime.MonthRegex, "gis");
        this.weekDayRegex = recognizers_text_1.RegExpUtility.getSafeRegExp(frenchDateTime_1.FrenchDateTime.WeekDayRegex, "gis");
        this.strictWeekDay = recognizers_text_1.RegExpUtility.getSafeRegExp(frenchDateTime_1.FrenchDateTime.StrictWeekDay, "gis");
        this.lastRegex = recognizers_text_1.RegExpUtility.getSafeRegExp(frenchDateTime_1.FrenchDateTime.LastDateRegex, "gis");
        this.thisRegex = recognizers_text_1.RegExpUtility.getSafeRegExp(frenchDateTime_1.FrenchDateTime.ThisRegex, "gis");
        this.weekDayOfMonthRegex = recognizers_text_1.RegExpUtility.getSafeRegExp(frenchDateTime_1.FrenchDateTime.WeekDayOfMonthRegex, "gis");
        this.forTheRegex = recognizers_text_1.RegExpUtility.getSafeRegExp(frenchDateTime_1.FrenchDateTime.ForTheRegex, "gis");
        this.weekDayAndDayOfMothRegex = recognizers_text_1.RegExpUtility.getSafeRegExp(frenchDateTime_1.FrenchDateTime.WeekDayAndDayOfMothRegex, "gis");
        this.relativeMonthRegex = recognizers_text_1.RegExpUtility.getSafeRegExp(frenchDateTime_1.FrenchDateTime.RelativeMonthRegex, "gis");
        this.utilityConfiguration = config.utilityConfiguration;
        this.dateTokenPrefix = frenchDateTime_1.FrenchDateTime.DateTokenPrefix;
    }
    getSwiftDay(source) {
        let trimedText = source.trim().toLowerCase();
        let swift = 0;
        if (trimedText === "aujourd'hui" || trimedText === "auj") {
            swift = 0;
        }
        else if (trimedText === "demain" ||
            trimedText.endsWith("a2m1") ||
            trimedText.endsWith("lendemain") ||
            trimedText.endsWith("jour suivant")) {
            swift = 1;
        }
        else if (trimedText === "hier") {
            swift = -1;
        }
        else if (trimedText.endsWith("après demain") ||
            trimedText.endsWith("après-demain")) {
            swift = 2;
        }
        else if (trimedText.endsWith("avant-hier") ||
            trimedText.endsWith("avant hier")) {
            swift = -2;
        }
        else if (trimedText.endsWith("dernier")) {
            swift = -1;
        }
        return swift;
    }
    getSwiftMonth(source) {
        let trimedText = source.trim().toLowerCase();
        let swift = 0;
        if (trimedText.endsWith("prochaine") || trimedText.endsWith("prochain")) {
            swift = 1;
        }
        else if (trimedText === "dernière" ||
            trimedText.endsWith("dernières") ||
            trimedText.endsWith("derniere") ||
            trimedText.endsWith("dernieres")) {
            swift = -1;
        }
        return swift;
    }
    isCardinalLast(source) {
        let trimedText = source.trim().toLowerCase();
        return (trimedText.endsWith("dernière") ||
            trimedText.endsWith("dernières") ||
            trimedText.endsWith("derniere") ||
            trimedText.endsWith("dernieres"));
    }
}
exports.FrenchDateParserConfiguration = FrenchDateParserConfiguration;
//# sourceMappingURL=dateConfiguration.js.map