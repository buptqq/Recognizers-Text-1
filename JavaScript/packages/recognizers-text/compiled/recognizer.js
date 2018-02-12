"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const models_1 = require("./models");
class Recognizer {
    constructor() {
        this.modelContainer = new models_1.ModelContainer();
    }
    getModel(modelTypeName, culture, fallbackToDefaultCulture = true) {
        return this.modelContainer.getModel(modelTypeName, culture, fallbackToDefaultCulture);
    }
    tryGetModel(modelTypeName, culture, fallbackToDefaultCulture = true) {
        return this.modelContainer.tryGetModel(modelTypeName, culture, fallbackToDefaultCulture);
    }
    containsModel(modelTypeName, culture, fallbackToDefaultCulture = true) {
        return this.modelContainer.containsModel(modelTypeName, culture, fallbackToDefaultCulture);
    }
    registerModel(modelTypeName, culture, model) {
        this.modelContainer.registerModel(modelTypeName, culture, model);
    }
    registerModels(models, culture) {
        this.modelContainer.registerModels(models, culture);
    }
}
exports.Recognizer = Recognizer;
//# sourceMappingURL=recognizer.js.map