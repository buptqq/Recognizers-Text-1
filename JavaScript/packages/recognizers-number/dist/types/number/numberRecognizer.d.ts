import { IModel } from "recognizers-text";
import { Recognizer } from "recognizers-text";
export default class NumberRecognizer extends Recognizer {
    static readonly instance: NumberRecognizer;
    private constructor();
    getNumberModel(culture: string, fallbackToDefaultCulture?: boolean): IModel;
    getOrdinalModel(culture: string, fallbackToDefaultCulture?: boolean): IModel;
    getPercentageModel(culture: string, fallbackToDefaultCulture?: boolean): IModel;
}
