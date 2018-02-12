"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const baseHoliday_1 = require("../baseHoliday");
const recognizers_text_1 = require("recognizers-text");
const utilities_1 = require("../utilities");
const spanishDateTime_1 = require("../../resources/spanishDateTime");
class SpanishHolidayExtractorConfiguration {
    constructor() {
        this.holidayRegexes = [
            recognizers_text_1.RegExpUtility.getSafeRegExp(spanishDateTime_1.SpanishDateTime.HolidayRegex1, "gis"),
            recognizers_text_1.RegExpUtility.getSafeRegExp(spanishDateTime_1.SpanishDateTime.HolidayRegex2, "gis"),
            recognizers_text_1.RegExpUtility.getSafeRegExp(spanishDateTime_1.SpanishDateTime.HolidayRegex3, "gis")
        ];
    }
}
exports.SpanishHolidayExtractorConfiguration = SpanishHolidayExtractorConfiguration;
class SpanishHolidayParserConfiguration extends baseHoliday_1.BaseHolidayParserConfiguration {
    constructor() {
        super();
        this.holidayRegexList = [
            recognizers_text_1.RegExpUtility.getSafeRegExp(spanishDateTime_1.SpanishDateTime.HolidayRegex1, "gis"),
            recognizers_text_1.RegExpUtility.getSafeRegExp(spanishDateTime_1.SpanishDateTime.HolidayRegex2, "gis"),
            recognizers_text_1.RegExpUtility.getSafeRegExp(spanishDateTime_1.SpanishDateTime.HolidayRegex3, "gis")
        ];
        this.holidayNames = spanishDateTime_1.SpanishDateTime.HolidayNames;
        this.holidayFuncDictionary = this.initHolidayFuncs();
        this.variableHolidaysTimexDictionary = spanishDateTime_1.SpanishDateTime.VariableHolidaysTimexDictionary;
        this.nextPrefixRegex = recognizers_text_1.RegExpUtility.getSafeRegExp(spanishDateTime_1.SpanishDateTime.NextPrefixRegex);
        this.pastPrefixRegex = recognizers_text_1.RegExpUtility.getSafeRegExp(spanishDateTime_1.SpanishDateTime.PastPrefixRegex);
        this.thisPrefixRegex = recognizers_text_1.RegExpUtility.getSafeRegExp(spanishDateTime_1.SpanishDateTime.ThisPrefixRegex);
    }
    initHolidayFuncs() {
        return new Map([
            ...super.initHolidayFuncs(),
            ["padres", SpanishHolidayParserConfiguration.FathersDay],
            ["madres", SpanishHolidayParserConfiguration.MothersDay],
            ["acciondegracias", SpanishHolidayParserConfiguration.ThanksgivingDay],
            ["trabajador", SpanishHolidayParserConfiguration.LabourDay],
            ["delaraza", SpanishHolidayParserConfiguration.ColumbusDay],
            ["memoria", SpanishHolidayParserConfiguration.MemorialDay],
            ["pascuas", SpanishHolidayParserConfiguration.EasterDay],
            ["navidad", SpanishHolidayParserConfiguration.ChristmasDay],
            ["nochebuena", SpanishHolidayParserConfiguration.ChristmasEve],
            ["añonuevo", SpanishHolidayParserConfiguration.NewYear],
            ["nochevieja", SpanishHolidayParserConfiguration.NewYearEve],
            ["yuandan", SpanishHolidayParserConfiguration.NewYear],
            ["maestro", SpanishHolidayParserConfiguration.TeacherDay],
            ["todoslossantos", SpanishHolidayParserConfiguration.HalloweenDay],
            ["niño", SpanishHolidayParserConfiguration.ChildrenDay],
            ["mujer", SpanishHolidayParserConfiguration.FemaleDay]
        ]);
    }
    // All JavaScript dates are zero-based (-1)
    static NewYear(year) { return new Date(year, 1 - 1, 1); }
    static NewYearEve(year) { return new Date(year, 12 - 1, 31); }
    static ChristmasDay(year) { return new Date(year, 12 - 1, 25); }
    static ChristmasEve(year) { return new Date(year, 12 - 1, 24); }
    static FemaleDay(year) { return new Date(year, 3 - 1, 8); }
    static ChildrenDay(year) { return new Date(year, 6 - 1, 1); }
    static HalloweenDay(year) { return new Date(year, 10 - 1, 31); }
    static TeacherDay(year) { return new Date(year, 9 - 1, 11); }
    static EasterDay(year) { return utilities_1.DateUtils.minValue(); }
    getSwiftYear(text) {
        let trimedText = text.trim().toLowerCase();
        let swift = -10;
        if (recognizers_text_1.RegExpUtility.getFirstMatchIndex(this.nextPrefixRegex, trimedText).matched) {
            swift = 1;
        }
        if (recognizers_text_1.RegExpUtility.getFirstMatchIndex(this.pastPrefixRegex, trimedText).matched) {
            swift = -1;
        }
        else if (recognizers_text_1.RegExpUtility.getFirstMatchIndex(this.thisPrefixRegex, trimedText).matched) {
            swift = 0;
        }
        return swift;
    }
    sanitizeHolidayToken(holiday) {
        return holiday.replace(/ /g, "")
            .replace(/á/g, "a")
            .replace(/é/g, "e")
            .replace(/í/g, "i")
            .replace(/ó/g, "o")
            .replace(/ú/g, "u");
    }
}
exports.SpanishHolidayParserConfiguration = SpanishHolidayParserConfiguration;
//# sourceMappingURL=holidayConfiguration.js.map