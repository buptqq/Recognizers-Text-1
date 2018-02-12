import { Recognizer, IModel } from "recognizers-text";
export default class OptionsRecognizer extends Recognizer {
    static readonly instance: OptionsRecognizer;
    private constructor();
    getBooleanModel(culture: string, fallbackToDefaultCulture?: boolean): IModel;
}
