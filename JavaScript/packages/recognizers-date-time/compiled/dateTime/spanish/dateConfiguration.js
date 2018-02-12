"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const recognizers_text_1 = require("recognizers-text");
const recognizers_text_number_1 = require("recognizers-text-number");
const spanishDateTime_1 = require("../../resources/spanishDateTime");
const baseDuration_1 = require("../baseDuration");
const baseConfiguration_1 = require("./baseConfiguration");
const durationConfiguration_1 = require("./durationConfiguration");
class SpanishDateExtractorConfiguration {
    constructor() {
        this.dateRegexList = [
            recognizers_text_1.RegExpUtility.getSafeRegExp(spanishDateTime_1.SpanishDateTime.DateExtractor1, "gis"),
            recognizers_text_1.RegExpUtility.getSafeRegExp(spanishDateTime_1.SpanishDateTime.DateExtractor2, "gis"),
            recognizers_text_1.RegExpUtility.getSafeRegExp(spanishDateTime_1.SpanishDateTime.DateExtractor3, "gis"),
            recognizers_text_1.RegExpUtility.getSafeRegExp(spanishDateTime_1.SpanishDateTime.DateExtractor4, "gis"),
            recognizers_text_1.RegExpUtility.getSafeRegExp(spanishDateTime_1.SpanishDateTime.DateExtractor5, "gis"),
            recognizers_text_1.RegExpUtility.getSafeRegExp(spanishDateTime_1.SpanishDateTime.DateExtractor6, "gis"),
            recognizers_text_1.RegExpUtility.getSafeRegExp(spanishDateTime_1.SpanishDateTime.DateExtractor7, "gis"),
            recognizers_text_1.RegExpUtility.getSafeRegExp(spanishDateTime_1.SpanishDateTime.DateExtractor8, "gis"),
            recognizers_text_1.RegExpUtility.getSafeRegExp(spanishDateTime_1.SpanishDateTime.DateExtractor9, "gis"),
            recognizers_text_1.RegExpUtility.getSafeRegExp(spanishDateTime_1.SpanishDateTime.DateExtractor10, "gis"),
        ];
        this.implicitDateList = [
            recognizers_text_1.RegExpUtility.getSafeRegExp(spanishDateTime_1.SpanishDateTime.OnRegex, "gis"),
            recognizers_text_1.RegExpUtility.getSafeRegExp(spanishDateTime_1.SpanishDateTime.RelaxedOnRegex, "gis"),
            recognizers_text_1.RegExpUtility.getSafeRegExp(spanishDateTime_1.SpanishDateTime.SpecialDayRegex, "gis"),
            recognizers_text_1.RegExpUtility.getSafeRegExp(spanishDateTime_1.SpanishDateTime.ThisRegex, "gis"),
            recognizers_text_1.RegExpUtility.getSafeRegExp(spanishDateTime_1.SpanishDateTime.LastDateRegex, "gis"),
            recognizers_text_1.RegExpUtility.getSafeRegExp(spanishDateTime_1.SpanishDateTime.NextDateRegex, "gis"),
            recognizers_text_1.RegExpUtility.getSafeRegExp(spanishDateTime_1.SpanishDateTime.WeekDayRegex, "gis"),
            recognizers_text_1.RegExpUtility.getSafeRegExp(spanishDateTime_1.SpanishDateTime.WeekDayOfMonthRegex, "gis"),
            recognizers_text_1.RegExpUtility.getSafeRegExp(spanishDateTime_1.SpanishDateTime.SpecialDateRegex, "gis")
        ];
        this.monthEnd = recognizers_text_1.RegExpUtility.getSafeRegExp(spanishDateTime_1.SpanishDateTime.MonthEndRegex, "gis");
        this.ofMonth = recognizers_text_1.RegExpUtility.getSafeRegExp(spanishDateTime_1.SpanishDateTime.OfMonthRegex, "gis");
        this.dateUnitRegex = recognizers_text_1.RegExpUtility.getSafeRegExp(spanishDateTime_1.SpanishDateTime.DateUnitRegex, "gis");
        this.forTheRegex = recognizers_text_1.RegExpUtility.getSafeRegExp(spanishDateTime_1.SpanishDateTime.ForTheRegex, "gis");
        this.weekDayAndDayOfMothRegex = recognizers_text_1.RegExpUtility.getSafeRegExp(spanishDateTime_1.SpanishDateTime.WeekDayAndDayOfMothRegex, "gis");
        this.relativeMonthRegex = recognizers_text_1.RegExpUtility.getSafeRegExp(spanishDateTime_1.SpanishDateTime.RelativeMonthRegex, "gis");
        this.weekDayRegex = recognizers_text_1.RegExpUtility.getSafeRegExp(spanishDateTime_1.SpanishDateTime.WeekDayRegex, "gis");
        this.dayOfWeek = spanishDateTime_1.SpanishDateTime.DayOfWeek;
        this.ordinalExtractor = new recognizers_text_number_1.SpanishOrdinalExtractor();
        this.integerExtractor = new recognizers_text_number_1.SpanishIntegerExtractor();
        this.numberParser = new recognizers_text_number_1.BaseNumberParser(new recognizers_text_number_1.SpanishNumberParserConfiguration());
        this.durationExtractor = new baseDuration_1.BaseDurationExtractor(new durationConfiguration_1.SpanishDurationExtractorConfiguration());
        this.utilityConfiguration = new baseConfiguration_1.SpanishDateTimeUtilityConfiguration();
    }
}
exports.SpanishDateExtractorConfiguration = SpanishDateExtractorConfiguration;
class SpanishDateParserConfiguration {
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
            recognizers_text_1.RegExpUtility.getSafeRegExp(spanishDateTime_1.SpanishDateTime.DateExtractor1, "gis"),
            recognizers_text_1.RegExpUtility.getSafeRegExp(spanishDateTime_1.SpanishDateTime.DateExtractor2, "gis"),
            recognizers_text_1.RegExpUtility.getSafeRegExp(spanishDateTime_1.SpanishDateTime.DateExtractor3, "gis"),
            recognizers_text_1.RegExpUtility.getSafeRegExp(spanishDateTime_1.SpanishDateTime.DateExtractor4, "gis"),
            recognizers_text_1.RegExpUtility.getSafeRegExp(spanishDateTime_1.SpanishDateTime.DateExtractor5, "gis"),
            recognizers_text_1.RegExpUtility.getSafeRegExp(spanishDateTime_1.SpanishDateTime.DateExtractor6, "gis"),
            recognizers_text_1.RegExpUtility.getSafeRegExp(spanishDateTime_1.SpanishDateTime.DateExtractor7, "gis"),
            recognizers_text_1.RegExpUtility.getSafeRegExp(spanishDateTime_1.SpanishDateTime.DateExtractor8, "gis"),
            recognizers_text_1.RegExpUtility.getSafeRegExp(spanishDateTime_1.SpanishDateTime.DateExtractor9, "gis"),
            recognizers_text_1.RegExpUtility.getSafeRegExp(spanishDateTime_1.SpanishDateTime.DateExtractor10, "gis"),
        ];
        this.onRegex = recognizers_text_1.RegExpUtility.getSafeRegExp(spanishDateTime_1.SpanishDateTime.OnRegex, "gis");
        this.specialDayRegex = recognizers_text_1.RegExpUtility.getSafeRegExp(spanishDateTime_1.SpanishDateTime.SpecialDayRegex, "gis");
        this.nextRegex = recognizers_text_1.RegExpUtility.getSafeRegExp(spanishDateTime_1.SpanishDateTime.NextDateRegex, "gis");
        this.unitRegex = recognizers_text_1.RegExpUtility.getSafeRegExp(spanishDateTime_1.SpanishDateTime.DateUnitRegex, "gis");
        this.monthRegex = recognizers_text_1.RegExpUtility.getSafeRegExp(spanishDateTime_1.SpanishDateTime.MonthRegex, "gis");
        this.weekDayRegex = recognizers_text_1.RegExpUtility.getSafeRegExp(spanishDateTime_1.SpanishDateTime.WeekDayRegex, "gis");
        this.lastRegex = recognizers_text_1.RegExpUtility.getSafeRegExp(spanishDateTime_1.SpanishDateTime.LastDateRegex, "gis");
        this.thisRegex = recognizers_text_1.RegExpUtility.getSafeRegExp(spanishDateTime_1.SpanishDateTime.ThisRegex, "gis");
        this.weekDayOfMonthRegex = recognizers_text_1.RegExpUtility.getSafeRegExp(spanishDateTime_1.SpanishDateTime.WeekDayOfMonthRegex, "gis");
        this.forTheRegex = recognizers_text_1.RegExpUtility.getSafeRegExp(spanishDateTime_1.SpanishDateTime.ForTheRegex, "gis");
        this.weekDayAndDayOfMothRegex = recognizers_text_1.RegExpUtility.getSafeRegExp(spanishDateTime_1.SpanishDateTime.WeekDayAndDayOfMothRegex, "gis");
        this.relativeMonthRegex = recognizers_text_1.RegExpUtility.getSafeRegExp(spanishDateTime_1.SpanishDateTime.RelativeMonthRegex, "gis");
        this.utilityConfiguration = config.utilityConfiguration;
        this.dateTokenPrefix = spanishDateTime_1.SpanishDateTime.DateTokenPrefix;
    }
    getSwiftDay(source) {
        let trimedText = SpanishDateParserConfiguration.normalize(source.trim().toLowerCase());
        let swift = 0;
        // TODO: add the relative day logic if needed. If yes, the whole method should be abstracted.
        if (trimedText === "hoy" || trimedText === "el dia") {
            swift = 0;
        }
        else if (trimedText === "mañana" ||
            trimedText.endsWith("dia siguiente") ||
            trimedText.endsWith("el dia de mañana") ||
            trimedText.endsWith("proximo dia")) {
            swift = 1;
        }
        else if (trimedText === "ayer") {
            swift = -1;
        }
        else if (trimedText.endsWith("pasado mañana") ||
            trimedText.endsWith("dia despues de mañana")) {
            swift = 2;
        }
        else if (trimedText.endsWith("anteayer") ||
            trimedText.endsWith("dia antes de ayer")) {
            swift = -2;
        }
        else if (trimedText.endsWith("ultimo dia")) {
            swift = -1;
        }
        return swift;
    }
    getSwiftMonth(source) {
        let trimedText = source.trim().toLowerCase();
        let swift = 0;
        if (recognizers_text_1.RegExpUtility.getMatches(SpanishDateParserConfiguration.nextPrefixRegex, trimedText).length) {
            swift = 1;
        }
        if (recognizers_text_1.RegExpUtility.getMatches(SpanishDateParserConfiguration.pastPrefixRegex, trimedText).length) {
            swift = -1;
        }
        return swift;
    }
    isCardinalLast(source) {
        let trimedText = source.trim().toLowerCase();
        return recognizers_text_1.RegExpUtility.getMatches(SpanishDateParserConfiguration.pastPrefixRegex, trimedText).length > 0;
    }
    static normalize(source) {
        return source
            .replace(/á/g, "a")
            .replace(/é/g, "e")
            .replace(/í/g, "i")
            .replace(/ó/g, "o")
            .replace(/ú/g, "u");
    }
}
// TODO: implement the relative day regex if needed. If yes, they should be abstracted
SpanishDateParserConfiguration.relativeDayRegex = recognizers_text_1.RegExpUtility.getSafeRegExp(spanishDateTime_1.SpanishDateTime.RelativeDayRegex);
SpanishDateParserConfiguration.nextPrefixRegex = recognizers_text_1.RegExpUtility.getSafeRegExp(spanishDateTime_1.SpanishDateTime.NextPrefixRegex);
SpanishDateParserConfiguration.pastPrefixRegex = recognizers_text_1.RegExpUtility.getSafeRegExp(spanishDateTime_1.SpanishDateTime.PastPrefixRegex);
exports.SpanishDateParserConfiguration = SpanishDateParserConfiguration;
//# sourceMappingURL=dateConfiguration.js.map