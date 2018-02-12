import { CultureInfo } from "recognizers-text-number";
import { FrenchNumberWithUnitExtractorConfiguration, FrenchNumberWithUnitParserConfiguration } from "./base";
export declare class FrenchDimensionExtractorConfiguration extends FrenchNumberWithUnitExtractorConfiguration {
    readonly suffixList: ReadonlyMap<string, string>;
    readonly prefixList: ReadonlyMap<string, string>;
    readonly ambiguousUnitList: ReadonlyArray<string>;
    readonly extractType: string;
    constructor(ci?: CultureInfo);
}
export declare class FrenchDimensionParserConfiguration extends FrenchNumberWithUnitParserConfiguration {
    constructor(ci?: CultureInfo);
}