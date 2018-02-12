import { IModel, Recognizer } from "recognizers-text";
export default class NumberWithUnitRecognizer extends Recognizer {
    static readonly instance: NumberWithUnitRecognizer;
    private constructor();
    getCurrencyModel(culture: string, fallbackToDefaultCulture?: boolean): IModel;
    getTemperatureModel(culture: string, fallbackToDefaultCulture?: boolean): IModel;
    getDimensionModel(culture: string, fallbackToDefaultCulture?: boolean): IModel;
    getAgeModel(culture: string, fallbackToDefaultCulture?: boolean): IModel;
}
