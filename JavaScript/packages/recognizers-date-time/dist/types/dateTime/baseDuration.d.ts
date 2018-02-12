import { ExtractResult } from "recognizers-text";
import { BaseNumberExtractor, BaseNumberParser } from "recognizers-text-number";
import { IDateTimeParser, DateTimeParseResult } from "./parsers";
import { IDateTimeExtractor } from "./baseDateTime";
export interface IDurationExtractorConfiguration {
    allRegex: RegExp;
    halfRegex: RegExp;
    followedUnit: RegExp;
    numberCombinedWithUnit: RegExp;
    anUnitRegex: RegExp;
    inExactNumberUnitRegex: RegExp;
    suffixAndRegex: RegExp;
    relativeDurationUnitRegex: RegExp;
    cardinalExtractor: BaseNumberExtractor;
}
export declare class BaseDurationExtractor implements IDateTimeExtractor {
    private readonly extractorName;
    private readonly config;
    constructor(config: IDurationExtractorConfiguration);
    extract(source: string, refDate: Date): Array<ExtractResult>;
    private numberWithUnit(source);
    private numberWithUnitAndSuffix(source, ers);
    private implicitDuration(source);
    private getTokensFromRegex(regexp, source);
}
export interface IDurationParserConfiguration {
    cardinalExtractor: BaseNumberExtractor;
    numberParser: BaseNumberParser;
    followedUnit: RegExp;
    suffixAndRegex: RegExp;
    numberCombinedWithUnit: RegExp;
    anUnitRegex: RegExp;
    allDateUnitRegex: RegExp;
    halfDateUnitRegex: RegExp;
    inExactNumberUnitRegex: RegExp;
    unitMap: ReadonlyMap<string, string>;
    unitValueMap: ReadonlyMap<string, number>;
    doubleNumbers: ReadonlyMap<string, number>;
}
export declare class BaseDurationParser implements IDateTimeParser {
    protected readonly parserName: string;
    protected readonly config: IDurationParserConfiguration;
    constructor(config: IDurationParserConfiguration);
    parse(extractorResult: ExtractResult, referenceDate?: Date): DateTimeParseResult | null;
    private parseNumberWithUnit(source, referenceDate);
    private parseImplicitDuration(source, referenceDate);
    private getResultFromRegex(regex, source, num);
    private parseNumberSpaceUnit(source);
    private parseNumberWithUnitAndSuffix(source);
    private parseNumberCombinedUnit(source);
    private parseAnUnit(source);
    private parseInExactNumberUnit(source);
    protected isLessThanDay(source: string): boolean;
}