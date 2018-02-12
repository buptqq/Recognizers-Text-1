"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const baseHoliday_1 = require("../baseHoliday");
const recognizers_text_1 = require("recognizers-text");
const utilities_1 = require("../utilities");
const frenchDateTime_1 = require("../../resources/frenchDateTime");
class FrenchHolidayExtractorConfiguration {
    constructor() {
        this.holidayRegexes = [
            recognizers_text_1.RegExpUtility.getSafeRegExp(frenchDateTime_1.FrenchDateTime.HolidayRegex1, "gis"),
            recognizers_text_1.RegExpUtility.getSafeRegExp(frenchDateTime_1.FrenchDateTime.HolidayRegex2, "gis"),
            recognizers_text_1.RegExpUtility.getSafeRegExp(frenchDateTime_1.FrenchDateTime.HolidayRegex3, "gis"),
            recognizers_text_1.RegExpUtility.getSafeRegExp(frenchDateTime_1.FrenchDateTime.HolidayRegex4, "gis")
        ];
    }
}
exports.FrenchHolidayExtractorConfiguration = FrenchHolidayExtractorConfiguration;
class FrenchHolidayParserConfiguration extends baseHoliday_1.BaseHolidayParserConfiguration {
    constructor() {
        super();
        this.holidayRegexList = [
            recognizers_text_1.RegExpUtility.getSafeRegExp(frenchDateTime_1.FrenchDateTime.HolidayRegex1, "gis"),
            recognizers_text_1.RegExpUtility.getSafeRegExp(frenchDateTime_1.FrenchDateTime.HolidayRegex2, "gis"),
            recognizers_text_1.RegExpUtility.getSafeRegExp(frenchDateTime_1.FrenchDateTime.HolidayRegex3, "gis"),
            recognizers_text_1.RegExpUtility.getSafeRegExp(frenchDateTime_1.FrenchDateTime.HolidayRegex4, "gis")
        ];
        this.holidayNames = frenchDateTime_1.FrenchDateTime.HolidayNames;
        this.holidayFuncDictionary = this.initHolidayFuncs();
    }
    initHolidayFuncs() {
        return new Map([
            ...super.initHolidayFuncs(),
            ["maosbirthday", FrenchHolidayParserConfiguration.MaoBirthday],
            ["yuandan", FrenchHolidayParserConfiguration.NewYear],
            ["teachersday", FrenchHolidayParserConfiguration.TeacherDay],
            ["singleday", FrenchHolidayParserConfiguration.SinglesDay],
            ["allsaintsday", FrenchHolidayParserConfiguration.HalloweenDay],
            ["youthday", FrenchHolidayParserConfiguration.YouthDay],
            ["childrenday", FrenchHolidayParserConfiguration.ChildrenDay],
            ["femaleday", FrenchHolidayParserConfiguration.FemaleDay],
            ["treeplantingday", FrenchHolidayParserConfiguration.TreePlantDay],
            ["arborday", FrenchHolidayParserConfiguration.TreePlantDay],
            ["girlsday", FrenchHolidayParserConfiguration.GirlsDay],
            ["whiteloverday", FrenchHolidayParserConfiguration.WhiteLoverDay],
            ["loverday", FrenchHolidayParserConfiguration.ValentinesDay],
            ["christmas", FrenchHolidayParserConfiguration.ChristmasDay],
            ["xmas", FrenchHolidayParserConfiguration.ChristmasDay],
            ["newyear", FrenchHolidayParserConfiguration.NewYear],
            ["newyearday", FrenchHolidayParserConfiguration.NewYear],
            ["newyearsday", FrenchHolidayParserConfiguration.NewYear],
            ["inaugurationday", FrenchHolidayParserConfiguration.InaugurationDay],
            ["groundhougday", FrenchHolidayParserConfiguration.GroundhogDay],
            ["valentinesday", FrenchHolidayParserConfiguration.ValentinesDay],
            ["stpatrickday", FrenchHolidayParserConfiguration.StPatrickDay],
            ["aprilfools", FrenchHolidayParserConfiguration.FoolDay],
            ["stgeorgeday", FrenchHolidayParserConfiguration.StGeorgeDay],
            ["mayday", FrenchHolidayParserConfiguration.Mayday],
            ["cincodemayoday", FrenchHolidayParserConfiguration.CincoDeMayoday],
            ["baptisteday", FrenchHolidayParserConfiguration.BaptisteDay],
            ["usindependenceday", FrenchHolidayParserConfiguration.UsaIndependenceDay],
            ["independenceday", FrenchHolidayParserConfiguration.UsaIndependenceDay],
            ["bastilleday", FrenchHolidayParserConfiguration.BastilleDay],
            ["halloweenday", FrenchHolidayParserConfiguration.HalloweenDay],
            ["allhallowday", FrenchHolidayParserConfiguration.AllHallowDay],
            ["allsoulsday", FrenchHolidayParserConfiguration.AllSoulsday],
            ["guyfawkesday", FrenchHolidayParserConfiguration.GuyFawkesDay],
            ["veteransday", FrenchHolidayParserConfiguration.Veteransday],
            ["christmaseve", FrenchHolidayParserConfiguration.ChristmasEve],
            ["newyeareve", FrenchHolidayParserConfiguration.NewYearEve],
            ["fathersday", FrenchHolidayParserConfiguration.FathersDay],
            ["mothersday", FrenchHolidayParserConfiguration.MothersDay],
            ["labourday", FrenchHolidayParserConfiguration.LabourDay]
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
    static EasterDay(year) { return utilities_1.DateUtils.minValue(); }
    static ValentinesDay(year) { return new Date(year, 2, 14); }
    static WhiteLoverDay(year) { return new Date(year, 3, 14); }
    static FoolDay(year) { return new Date(year, 4, 1); }
    static GirlsDay(year) { return new Date(year, 3, 7); }
    static TreePlantDay(year) { return new Date(year, 3, 12); }
    static YouthDay(year) { return new Date(year, 5, 4); }
    static TeacherDay(year) { return new Date(year, 9, 10); }
    static SinglesDay(year) { return new Date(year, 11, 11); }
    static MaoBirthday(year) { return new Date(year, 12, 26); }
    static InaugurationDay(year) { return new Date(year, 1, 20); }
    static GroundhogDay(year) { return new Date(year, 2, 2); }
    static StPatrickDay(year) { return new Date(year, 3, 17); }
    static StGeorgeDay(year) { return new Date(year, 4, 23); }
    static Mayday(year) { return new Date(year, 5, 1); }
    static CincoDeMayoday(year) { return new Date(year, 5, 5); }
    static BaptisteDay(year) { return new Date(year, 6, 24); }
    static UsaIndependenceDay(year) { return new Date(year, 7, 4); }
    static BastilleDay(year) { return new Date(year, 7, 14); }
    static AllHallowDay(year) { return new Date(year, 11, 1); }
    static AllSoulsday(year) { return new Date(year, 11, 2); }
    static GuyFawkesDay(year) { return new Date(year, 11, 5); }
    static Veteransday(year) { return new Date(year, 11, 11); }
    static FathersDay(year) { return new Date(year, 6, 17); }
    static MothersDay(year) { return new Date(year, 5, 27); }
    static LabourDay(year) { return new Date(year, 5, 1); }
    getSwiftYear(text) {
        let trimedText = text.trim().toLowerCase();
        let swift = -10;
        if (trimedText.endsWith("prochain")) {
            swift = 1;
        }
        else if (trimedText.endsWith("dernier")) {
            swift = -1;
        }
        else if (trimedText.startsWith("cette")) {
            swift = 0;
        }
        return swift;
    }
    sanitizeHolidayToken(holiday) {
        return holiday.replace(/ /g, "")
            .replace(/'/g, "");
    }
}
exports.FrenchHolidayParserConfiguration = FrenchHolidayParserConfiguration;
//# sourceMappingURL=holidayConfiguration.js.map