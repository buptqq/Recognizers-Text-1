import { IParser, ExtractResult, ParseResult } from "recognizers-text";
export interface IOptionsParserConfiguration<T> {
    resolutions: Map<string, T>;
}
export declare class OptionsParser<T> implements IParser {
    private readonly config;
    constructor(config: IOptionsParserConfiguration<T>);
    parse(extResult: ExtractResult): ParseResult;
}
export declare class BooleanParser extends OptionsParser<boolean> {
    constructor();
}
