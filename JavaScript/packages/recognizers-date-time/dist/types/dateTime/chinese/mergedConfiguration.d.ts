import { BaseMergedExtractor, BaseMergedParser } from "../baseMerged";
import { ExtractResult } from "recognizers-text";
import { DateTimeOptions } from "../dateTimeRecognizer";
import { DateTimeParseResult } from "../parsers";
import { StringMap } from "../utilities";
export declare class ChineseMergedExtractor extends BaseMergedExtractor {
    private readonly dayOfMonthRegex;
    constructor(options: DateTimeOptions);
    extract(source: string, refDate: Date): Array<ExtractResult>;
    protected addTo(destination: ExtractResult[], source: ExtractResult[], sourceStr: string): void;
    protected moveOverlap(destination: ExtractResult[], result: ExtractResult): void;
    protected addMod(destination: ExtractResult[], source: string): void;
}
export declare class ChineseMergedParser extends BaseMergedParser {
    constructor();
    parse(er: ExtractResult, refTime?: Date): DateTimeParseResult | null;
}
export declare class ChineseFullMergedParser extends BaseMergedParser {
    constructor();
    parse(er: ExtractResult, refTime?: Date): DateTimeParseResult | null;
    protected dateTimeResolution(slot: DateTimeParseResult, hasBefore: boolean, hasAfter: boolean, hasSince?: boolean): {
        [s: string]: Array<StringMap>;
    };
    protected determineDateTimeType(type: string, hasBefore: boolean, hasAfter: boolean, hasSince?: boolean): string;
}
