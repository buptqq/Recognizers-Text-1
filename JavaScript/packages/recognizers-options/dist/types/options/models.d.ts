import { IModel, ModelResult, IExtractor, IParser } from "recognizers-text";
export declare abstract class OptionsModel implements IModel {
    readonly abstract modelTypeName: string;
    protected readonly extractor: IExtractor;
    protected readonly parser: IParser;
    constructor(parser: IParser, extractor: IExtractor);
    parse(source: string): ModelResult[];
    protected abstract getResolution(data: any): any;
}
export declare class BooleanModel extends OptionsModel {
    readonly modelTypeName: string;
    protected getResolution(sources: any): any;
}
