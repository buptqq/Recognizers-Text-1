"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const baseHoliday_1 = require("../baseHoliday");
const recognizers_text_1 = require("recognizers-text");
const utilities_1 = require("../utilities");
const englishDateTime_1 = require("../../resources/englishDateTime");
class EnglishHolidayExtractorConfiguration {
    constructor() {
        this.holidayRegexes = [
            recognizers_text_1.RegExpUtility.getSafeRegExp(englishDateTime_1.EnglishDateTime.HolidayRegex1, "gis"),
            recognizers_text_1.RegExpUtility.getSafeRegExp(englishDateTime_1.EnglishDateTime.HolidayRegex2, "gis"),
            recognizers_text_1.RegExpUtility.getSafeRegExp(englishDateTime_1.EnglishDateTime.HolidayRegex3, "gis")
        ];
    }
}
exports.EnglishHolidayExtractorConfiguration = EnglishHolidayExtractorConfiguration;
class EnglishHolidayParserConfiguration extends baseHoliday_1.BaseHolidayParserConfiguration {
    constructor() {
        super();
        this.holidayRegexList = [
            recognizers_text_1.RegExpUtility.getSafeRegExp(englishDateTime_1.EnglishDateTime.HolidayRegex1, "gis"),
            recognizers_text_1.RegExpUtility.getSafeRegExp(englishDateTime_1.EnglishDateTime.HolidayRegex2, "gis"),
            recognizers_text_1.RegExpUtility.getSafeRegExp(englishDateTime_1.EnglishDateTime.HolidayRegex3, "gis")
        ];
        this.holidayNames = englishDateTime_1.EnglishDateTime.HolidayNames;
        this.holidayFuncDictionary = this.initHolidayFuncs();
    }
    initHolidayFuncs() {
        return new Map([
            ...super.initHolidayFuncs(),
            ["maosbirthday", EnglishHolidayParserConfiguration.MaoBirthday],
            ["yuandan", EnglishHolidayParserConfiguration.NewYear],
            ["teachersday", EnglishHolidayParserConfiguration.TeacherDay],
            ["singleday", EnglishHolidayParserConfiguration.SinglesDay],
            ["allsaintsday", EnglishHolidayParserConfiguration.HalloweenDay],
            ["youthday", EnglishHolidayParserConfiguration.YouthDay],
            ["childrenday", EnglishHolidayParserConfiguration.ChildrenDay],
            ["femaleday", EnglishHolidayParserConfiguration.FemaleDay],
            ["treeplantingday", EnglishHolidayParserConfiguration.TreePlantDay],
            ["arborday", EnglishHolidayParserConfiguration.TreePlantDay],
            ["girlsday", EnglishHolidayParserConfiguration.GirlsDay],
            ["whiteloverday", EnglishHolidayParserConfiguration.WhiteLoverDay],
            ["loverday", EnglishHolidayParserConfiguration.ValentinesDay],
            ["christmas", EnglishHolidayParserConfiguration.ChristmasDay],
            ["xmas", EnglishHolidayParserConfiguration.ChristmasDay],
            ["newyear", EnglishHolidayParserConfiguration.NewYear],
            ["newyearday", EnglishHolidayParserConfiguration.NewYear],
            ["newyearsday", EnglishHolidayParserConfiguration.NewYear],
            ["inaugurationday", EnglishHolidayParserConfiguration.InaugurationDay],
            ["groundhougday", EnglishHolidayParserConfiguration.GroundhogDay],
            ["valentinesday", EnglishHolidayParserConfiguration.ValentinesDay],
            ["stpatrickday", EnglishHolidayParserConfiguration.StPatrickDay],
            ["aprilfools", EnglishHolidayParserConfiguration.FoolDay],
            ["stgeorgeday", EnglishHolidayParserConfiguration.StGeorgeDay],
            ["mayday", EnglishHolidayParserConfiguration.Mayday],
            ["cincodemayoday", EnglishHolidayParserConfiguration.CincoDeMayoday],
            ["baptisteday", EnglishHolidayParserConfiguration.BaptisteDay],
            ["usindependenceday", EnglishHolidayParserConfiguration.UsaIndependenceDay],
            ["independenceday", EnglishHolidayParserConfiguration.UsaIndependenceDay],
            ["bastilleday", EnglishHolidayParserConfiguration.BastilleDay],
            ["halloweenday", EnglishHolidayParserConfiguration.HalloweenDay],
            ["allhallowday", EnglishHolidayParserConfiguration.AllHallowDay],
            ["allsoulsday", EnglishHolidayParserConfiguration.AllSoulsday],
            ["guyfawkesday", EnglishHolidayParserConfiguration.GuyFawkesDay],
            ["veteransday", EnglishHolidayParserConfiguration.Veteransday],
            ["christmaseve", EnglishHolidayParserConfiguration.ChristmasEve],
            ["newyeareve", EnglishHolidayParserConfiguration.NewYearEve],
            ["easterday", EnglishHolidayParserConfiguration.EasterDay]
        ]);
    }
    // All JavaScript dates are zero-based (-1)
    static NewYear(year) { return new Date(year, 1 - 1, 1); }
    static NewYearEve(year) { return new Date(year, 12 - 1, 31); }
    static ChristmasDay(year) { return new Date(year, 12 - 1, 25); }
    static ChristmasEve(year) { return new Date(year, 12 - 1, 24); }
    static ValentinesDay(year) { return new Date(year, 2 - 1, 14); }
    static WhiteLoverDay(year) { return new Date(year, 3 - 1, 14); }
    static FoolDay(year) { return new Date(year, 4 - 1, 1); }
    static GirlsDay(year) { return new Date(year, 3 - 1, 7); }
    static TreePlantDay(year) { return new Date(year, 3 - 1, 12); }
    static FemaleDay(year) { return new Date(year, 3 - 1, 8); }
    static ChildrenDay(year) { return new Date(year, 6 - 1, 1); }
    static YouthDay(year) { return new Date(year, 5 - 1, 4); }
    static TeacherDay(year) { return new Date(year, 9 - 1, 10); }
    static SinglesDay(year) { return new Date(year, 11 - 1, 11); }
    static MaoBirthday(year) { return new Date(year, 12 - 1, 26); }
    static InaugurationDay(year) { return new Date(year, 1 - 1, 20); }
    static GroundhogDay(year) { return new Date(year, 2 - 1, 2); }
    static StPatrickDay(year) { return new Date(year, 3 - 1, 17); }
    static StGeorgeDay(year) { return new Date(year, 4 - 1, 23); }
    static Mayday(year) { return new Date(year, 5 - 1, 1); }
    static CincoDeMayoday(year) { return new Date(year, 5 - 1, 5); }
    static BaptisteDay(year) { return new Date(year, 6 - 1, 24); }
    static UsaIndependenceDay(year) { return new Date(year, 7 - 1, 4); }
    static BastilleDay(year) { return new Date(year, 7 - 1, 14); }
    static HalloweenDay(year) { return new Date(year, 10 - 1, 31); }
    static AllHallowDay(year) { return new Date(year, 11 - 1, 1); }
    static AllSoulsday(year) { return new Date(year, 11 - 1, 2); }
    static GuyFawkesDay(year) { return new Date(year, 11 - 1, 5); }
    static Veteransday(year) { return new Date(year, 11 - 1, 11); }
    static EasterDay(year) { return utilities_1.DateUtils.minValue(); }
    getSwiftYear(text) {
        let trimmedText = text.trim().toLowerCase();
        let swift = -10;
        if (trimmedText.startsWith("next")) {
            swift = 1;
        }
        else if (trimmedText.startsWith("last")) {
            swift = -1;
        }
        else if (trimmedText.startsWith("this")) {
            swift = 0;
        }
        return swift;
    }
    sanitizeHolidayToken(holiday) {
        return holiday.replace(/[ ']/g, "");
    }
}
exports.EnglishHolidayParserConfiguration = EnglishHolidayParserConfiguration;
//# sourceMappingURL=holidayConfiguration.js.map