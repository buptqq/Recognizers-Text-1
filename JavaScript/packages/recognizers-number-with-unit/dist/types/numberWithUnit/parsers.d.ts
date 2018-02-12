import { IExtractor, ExtractResult, IParser, ParseResult } from "recognizers-text";
import { CultureInfo } from "recognizers-text-number";
export declare class UnitValue {
    number: string;
    unit: string;
}
export declare class NumberWithUnitParser implements IParser {
    protected readonly config: INumberWithUnitParserConfiguration;
    constructor(config: INumberWithUnitParserConfiguration);
    parse(extResult: ExtractResult): ParseResult;
    private addIfNotContained(keys, newKey);
}
export interface INumberWithUnitParserConfiguration {
    readonly unitMap: Map<string, string>;
    readonly cultureInfo: CultureInfo;
    readonly internalNumberParser: IParser;
    readonly internalNumberExtractor: IExtractor;
    readonly connectorToken: string;
    BindDictionary(dictionary: Map<string, string>): void;
}
export declare abstract class BaseNumberWithUnitParserConfiguration implements INumberWithUnitParserConfiguration {
    unitMap: Map<string, string>;
    cultureInfo: CultureInfo;
    abstract internalNumberParser: IParser;
    abstract internalNumberExtractor: IExtractor;
    abstract connectorToken: string;
    constructor(cultureInfo: CultureInfo);
    BindDictionary(dictionary: ReadonlyMap<string, string>): void;
}