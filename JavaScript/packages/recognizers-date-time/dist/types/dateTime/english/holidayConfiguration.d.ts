import { IHolidayExtractorConfiguration, BaseHolidayParserConfiguration } from "../baseHoliday";
export declare class EnglishHolidayExtractorConfiguration implements IHolidayExtractorConfiguration {
    readonly holidayRegexes: RegExp[];
    constructor();
}
export declare class EnglishHolidayParserConfiguration extends BaseHolidayParserConfiguration {
    constructor();
    protected initHolidayFuncs(): ReadonlyMap<string, (year: number) => Date>;
    private static NewYear(year);
    private static NewYearEve(year);
    private static ChristmasDay(year);
    private static ChristmasEve(year);
    private static ValentinesDay(year);
    private static WhiteLoverDay(year);
    private static FoolDay(year);
    private static GirlsDay(year);
    private static TreePlantDay(year);
    private static FemaleDay(year);
    private static ChildrenDay(year);
    private static YouthDay(year);
    private static TeacherDay(year);
    private static SinglesDay(year);
    private static MaoBirthday(year);
    private static InaugurationDay(year);
    private static GroundhogDay(year);
    private static StPatrickDay(year);
    private static StGeorgeDay(year);
    private static Mayday(year);
    private static CincoDeMayoday(year);
    private static BaptisteDay(year);
    private static UsaIndependenceDay(year);
    private static BastilleDay(year);
    private static HalloweenDay(year);
    private static AllHallowDay(year);
    private static AllSoulsday(year);
    private static GuyFawkesDay(year);
    private static Veteransday(year);
    private static EasterDay(year);
    getSwiftYear(text: string): number;
    sanitizeHolidayToken(holiday: string): string;
}
