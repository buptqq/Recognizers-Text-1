import { Match, ExtractResult } from "recognizers-text";
import { IHolidayExtractorConfiguration, BaseHolidayParser } from "../baseHoliday";
import { DateTimeResolutionResult } from "../utilities";
import { DateTimeParseResult } from "../parsers";
export declare class ChineseHolidayExtractorConfiguration implements IHolidayExtractorConfiguration {
    readonly holidayRegexes: RegExp[];
    constructor();
}
export declare class ChineseHolidayParser extends BaseHolidayParser {
    private readonly lunarHolidayRegex;
    RegExp: any;
    private readonly integerExtractor;
    private readonly numberParser;
    private readonly fixedHolidayDictionary;
    constructor();
    parse(er: ExtractResult, referenceDate?: Date): DateTimeParseResult;
    private isLunar(source);
    protected match2Date(match: Match, referenceDate: Date): DateTimeResolutionResult;
    private convertYear(yearStr, isChinese);
    private getDateValue(date, referenceDate, holiday, swift, comparer);
}
