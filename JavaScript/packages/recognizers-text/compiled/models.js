"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const culture_1 = require("./culture");
class ModelResult {
}
exports.ModelResult = ModelResult;
class ModelContainer {
    constructor() {
        this.modelInstances = new Map();
    }
    getModel(modelTypeName, culture, fallbackToDefaultCulture = true) {
        let result = this.tryGetModel(modelTypeName, culture, fallbackToDefaultCulture);
        if (!result.containsModel) {
            throw new Error(`No IModel instance for ${culture}-${modelTypeName}`);
        }
        return result.model;
    }
    tryGetModel(modelTypeName, culture, fallbackToDefaultCulture = true) {
        let model;
        let ret = true;
        let key = this.generateKey(modelTypeName, culture);
        if (!this.modelInstances.has(key)) {
            if (fallbackToDefaultCulture) {
                culture = ModelContainer.defaultCulture;
                key = this.generateKey(modelTypeName, culture);
            }
            if (!this.modelInstances.has(key)) {
                ret = false;
            }
        }
        if (ret) {
            return { containsModel: true, model: this.modelInstances.get(key) };
        }
        return { containsModel: false };
    }
    containsModel(modelTypeName, culture, fallbackToDefaultCulture = true) {
        return this.tryGetModel(modelTypeName, culture, fallbackToDefaultCulture).containsModel;
    }
    registerModel(modelTypeName, culture, model) {
        let key = this.generateKey(modelTypeName, culture);
        if (this.modelInstances.has(key)) {
            throw new Error(`${culture}-${modelTypeName} has been registered.`);
        }
        this.modelInstances.set(key, model);
    }
    registerModels(models, culture) {
        for (let key in models.keys()) {
            let model = models.get(key);
            this.registerModel(key, culture, model);
        }
    }
    generateKey(modelTypeName, culture) {
        return `${culture.toLowerCase()}-${modelTypeName}`;
    }
}
ModelContainer.defaultCulture = culture_1.Culture.English;
exports.ModelContainer = ModelContainer;
//# sourceMappingURL=models.js.map