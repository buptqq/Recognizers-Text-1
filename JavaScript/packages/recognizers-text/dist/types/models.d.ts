export interface IModel {
    readonly modelTypeName: string;
    parse(query: string): Array<ModelResult>;
}
export declare class ModelResult {
    text: string;
    start: number;
    end: number;
    typeName: string;
    resolution: {
        [key: string]: any;
    };
}
export declare class ModelContainer {
    static readonly defaultCulture: string;
    private modelInstances;
    getModel(modelTypeName: string, culture: string, fallbackToDefaultCulture?: boolean): IModel;
    tryGetModel(modelTypeName: string, culture: string, fallbackToDefaultCulture?: boolean): {
        containsModel: boolean;
        model?: IModel;
    };
    containsModel(modelTypeName: string, culture: string, fallbackToDefaultCulture?: boolean): boolean;
    registerModel(modelTypeName: string, culture: string, model: IModel): void;
    registerModels(models: Map<string, IModel>, culture: string): void;
    private generateKey(modelTypeName, culture);
}
