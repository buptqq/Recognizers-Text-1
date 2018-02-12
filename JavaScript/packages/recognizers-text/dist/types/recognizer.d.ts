import { IModel } from "./models";
export interface IRecognizer {
    getModel(modelTypeName: string, culture: string, fallbackToDefaultCulture: boolean): void;
    tryGetModel(modelTypeName: string, culture: string, fallbackToDefaultCulture: boolean): {
        containsModel: boolean;
        model?: IModel;
    };
    containsModel(modelTypeName: string, culture: string, fallbackToDefaultCulture: boolean): boolean;
}
export declare abstract class Recognizer implements IRecognizer {
    private readonly modelContainer;
    getModel(modelTypeName: string, culture: string, fallbackToDefaultCulture?: boolean): IModel;
    tryGetModel(modelTypeName: string, culture: string, fallbackToDefaultCulture?: boolean): {
        containsModel: boolean;
        model?: IModel;
    };
    containsModel(modelTypeName: string, culture: string, fallbackToDefaultCulture?: boolean): boolean;
    registerModel(modelTypeName: string, culture: string, model: IModel): void;
    registerModels(models: Map<string, IModel>, culture: string): void;
}
