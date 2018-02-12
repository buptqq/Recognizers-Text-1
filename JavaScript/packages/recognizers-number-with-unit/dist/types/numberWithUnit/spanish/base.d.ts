import { IExtractor, IParser } from "recognizers-text";
import { CultureInfo } from "recognizers-text-number";
import { INumberWithUnitExtractorConfiguration } from "../extractors";
import { BaseNumberWithUnitParserConfiguration } from "../parsers";
export declare abstract class SpanishNumberWithUnitExtractorConfiguration implements INumberWithUnitExtractorConfiguration {
    readonly abstract suffixList: ReadonlyMap<string, string>;
    readonly abstract prefixList: ReadonlyMap<string, string>;
    readonly abstract ambiguousUnitList: ReadonlyArray<string>;
    readonly abstract extractType: string;
    readonly cultureInfo: CultureInfo;
    readonly unitNumExtractor: IExtractor;
    readonly buildPrefix: string;
    readonly buildSuffix: string;
    readonly connectorToken: string;
    constructor(ci: CultureInfo);
}
export declare class SpanishNumberWithUnitParserConfiguration extends BaseNumberWithUnitParserConfiguration {
    readonly internalNumberParser: IParser;
    readonly internalNumberExtractor: IExtractor;
    readonly connectorToken: string;
    constructor(ci: CultureInfo);
}