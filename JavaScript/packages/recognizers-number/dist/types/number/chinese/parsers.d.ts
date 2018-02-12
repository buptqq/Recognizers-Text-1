import { ExtractResult, ParseResult } from "recognizers-text";
import { BaseNumberParser } from "../parsers";
import { ChineseNumberParserConfiguration } from "./parserConfiguration";
export declare class ChineseNumberParser extends BaseNumberParser {
    readonly config: ChineseNumberParserConfiguration;
    constructor(config: ChineseNumberParserConfiguration);
    private toString(value);
    parse(extResult: ExtractResult): ParseResult | null;
    private replaceTraditionalWithSimplified(value);
    private replaceFullWithHalf(value);
    private replaceUnit(value);
    private perParseChs(extResult);
    private fracParseChs(extResult);
    private douParseChs(extResult);
    private intParseChs(extResult);
    private ordParseChs(extResult);
    private getDigitValueChs(value, power);
    private getIntValueChs(value);
    private getPointValueChs(value);
    private isDigitChs(value);
}