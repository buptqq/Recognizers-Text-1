import { Culture as BaseCulture, CultureInfo as BaseCultureInfo } from "recognizers-text";
import { BigNumber } from 'bignumber.js';
import { LongFormatType } from "./number/models";
export declare class Culture extends BaseCulture {
    static readonly supportedCultures: Array<Culture>;
    readonly longFormat: LongFormatType;
    private constructor();
}
export declare class CultureInfo extends BaseCultureInfo {
    format(value: number | BigNumber): string;
}
