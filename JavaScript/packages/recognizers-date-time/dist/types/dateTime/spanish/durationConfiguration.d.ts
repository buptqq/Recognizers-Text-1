import { BaseNumberExtractor, BaseNumberParser } from "recognizers-text-number";
import { IDurationExtractorConfiguration, IDurationParserConfiguration } from "../baseDuration";
import { ICommonDateTimeParserConfiguration } from "../parsers";
export declare class SpanishDurationExtractorConfiguration implements IDurationExtractorConfiguration {
    readonly allRegex: RegExp;
    readonly halfRegex: RegExp;
    readonly followedUnit: RegExp;
    readonly numberCombinedWithUnit: RegExp;
    readonly anUnitRegex: RegExp;
    readonly inExactNumberUnitRegex: RegExp;
    readonly suffixAndRegex: RegExp;
    readonly relativeDurationUnitRegex: RegExp;
    readonly cardinalExtractor: BaseNumberExtractor;
    constructor();
}
export declare class SpanishDurationParserConfiguration implements IDurationParserConfiguration {
    readonly cardinalExtractor: BaseNumberExtractor;
    readonly numberParser: BaseNumberParser;
    readonly followedUnit: RegExp;
    readonly suffixAndRegex: RegExp;
    readonly numberCombinedWithUnit: RegExp;
    readonly anUnitRegex: RegExp;
    readonly allDateUnitRegex: RegExp;
    readonly halfDateUnitRegex: RegExp;
    readonly inExactNumberUnitRegex: RegExp;
    readonly unitMap: ReadonlyMap<string, string>;
    readonly unitValueMap: ReadonlyMap<string, number>;
    readonly doubleNumbers: ReadonlyMap<string, number>;
    constructor(config: ICommonDateTimeParserConfiguration);
}