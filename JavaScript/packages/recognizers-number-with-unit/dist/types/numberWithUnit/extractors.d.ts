import { IExtractor, ExtractResult } from "recognizers-text";
import { CultureInfo } from "recognizers-text-number";
export interface INumberWithUnitExtractorConfiguration {
    readonly suffixList: ReadonlyMap<string, string>;
    readonly prefixList: ReadonlyMap<string, string>;
    readonly ambiguousUnitList: ReadonlyArray<string>;
    readonly extractType: string;
    readonly cultureInfo: CultureInfo;
    readonly unitNumExtractor: IExtractor;
    readonly buildPrefix: string;
    readonly buildSuffix: string;
    readonly connectorToken: string;
}
export declare class NumberWithUnitExtractor implements IExtractor {
    private readonly config;
    private readonly suffixRegexes;
    private readonly prefixRegexes;
    private readonly separateRegex;
    private readonly maxPrefixMatchLen;
    constructor(config: INumberWithUnitExtractorConfiguration);
    extract(source: string): Array<ExtractResult>;
    validateUnit(source: string): boolean;
    protected preCheckStr(str: string): number;
    protected extractSeparateUnits(source: string, numDependResults: Array<ExtractResult>): void;
    protected buildRegexFromSet(collection: Array<string>, ignoreCase?: boolean): Set<RegExp>;
    protected buildSeparateRegexFromSet(ignoreCase?: boolean): RegExp;
    protected dinoComparer(x: string, y: string): number;
}
export declare class PrefixUnitResult {
    offset: number;
    unitString: string;
}