"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const recognizers_text_1 = require("recognizers-text");
const models_1 = require("./models");
const extractors_1 = require("./extractors");
const parsers_1 = require("./parsers");
const boolean_1 = require("./english/boolean");
class OptionsRecognizer extends recognizers_text_1.Recognizer {
    constructor() {
        super();
        // English models
        this.registerModel("BooleanModel", recognizers_text_1.Culture.English, new models_1.BooleanModel(new parsers_1.BooleanParser(), new extractors_1.BooleanExtractor(new boolean_1.EnglishBooleanExtractorConfiguration())));
    }
    getBooleanModel(culture, fallbackToDefaultCulture = true) {
        return this.getModel("BooleanModel", culture, fallbackToDefaultCulture);
    }
}
OptionsRecognizer.instance = new OptionsRecognizer();
exports.default = OptionsRecognizer;
//# sourceMappingURL=optionsRecognizer.js.map