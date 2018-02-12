import { Recognizer } from "recognizers-text";
import { IDateTimeModel } from "./models";
export declare enum DateTimeOptions {
    None = 0,
    SkipFromToMerge = 1,
    SplitDateAndTime = 2,
    Calendar = 4,
}
export default class DateTimeRecognizer extends Recognizer {
    static readonly instance: DateTimeRecognizer;
    private constructor();
    getDateTimeModel(culture?: string, fallbackToDefaultCulture?: boolean): IDateTimeModel;
    static getSingleCultureInstance(cultureCode: string, options?: DateTimeOptions): DateTimeRecognizer;
}
