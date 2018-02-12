import { ExtractResult } from "recognizers-text";
import { IDateTimeUtilityConfiguration } from "./utilities";
import { IDateTimeParser, DateTimeParseResult } from "./parsers";
import { BaseTimeParser } from "./baseTime";
import { IDateTimeExtractor } from "./baseDateTime";
export interface ITimePeriodExtractorConfiguration {
    simpleCasesRegex: RegExp[];
    tillRegex: RegExp;
    timeOfDayRegex: RegExp;
    singleTimeExtractor: IDateTimeExtractor;
    getFromTokenIndex(text: string): {
        matched: boolean;
        index: number;
    };
    hasConnectorToken(text: string): boolean;
    getBetweenTokenIndex(text: string): {
        matched: boolean;
        index: number;
    };
}
export declare class BaseTimePeriodExtractor implements IDateTimeExtractor {
    readonly extractorName: string;
    readonly config: ITimePeriodExtractorConfiguration;
    constructor(config: ITimePeriodExtractorConfiguration);
    extract(source: string, refDate: Date): Array<ExtractResult>;
    private matchSimpleCases(text);
    private mergeTwoTimePoints(text, refDate);
    private matchNight(source);
}
export interface ITimePeriodParserConfiguration {
    timeExtractor: IDateTimeExtractor;
    timeParser: BaseTimeParser;
    pureNumberFromToRegex: RegExp;
    pureNumberBetweenAndRegex: RegExp;
    timeOfDayRegex: RegExp;
    numbers: ReadonlyMap<string, number>;
    utilityConfiguration: IDateTimeUtilityConfiguration;
    getMatchedTimexRange(text: string): {
        matched: boolean;
        timex: string;
        beginHour: number;
        endHour: number;
        endMin: number;
    };
}
export declare class BaseTimePeriodParser implements IDateTimeParser {
    static readonly ParserName: string;
    protected readonly config: ITimePeriodParserConfiguration;
    constructor(configuration: ITimePeriodParserConfiguration);
    parse(er: ExtractResult, refTime?: Date): DateTimeParseResult;
    private parseSimpleCases(text, referenceTime);
    private mergeTwoTimePoints(text, referenceTime);
    private parseNight(text, referenceTime);
}