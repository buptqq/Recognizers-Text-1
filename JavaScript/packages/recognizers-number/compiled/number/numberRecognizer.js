"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const recognizers_text_1 = require("recognizers-text");
const culture_1 = require("../culture");
const models_1 = require("./models");
const agnosticNumberParser_1 = require("./agnosticNumberParser");
const parserConfiguration_1 = require("./english/parserConfiguration");
const parserConfiguration_2 = require("./spanish/parserConfiguration");
const parserConfiguration_3 = require("./portuguese/parserConfiguration");
const parserConfiguration_4 = require("./french/parserConfiguration");
const parserConfiguration_5 = require("./chinese/parserConfiguration");
const extractors_1 = require("./english/extractors");
const extractors_2 = require("./spanish/extractors");
const extractors_3 = require("./portuguese/extractors");
const extractors_4 = require("./french/extractors");
const extractors_5 = require("./chinese/extractors");
class NumberRecognizer extends recognizers_text_1.Recognizer {
    constructor() {
        super();
        // English models
        this.registerModel("NumberModel", culture_1.Culture.English, new models_1.NumberModel(agnosticNumberParser_1.AgnosticNumberParserFactory.getParser(agnosticNumberParser_1.AgnosticNumberParserType.Number, new parserConfiguration_1.EnglishNumberParserConfiguration()), new extractors_1.EnglishNumberExtractor(models_1.NumberMode.PureNumber)));
        this.registerModel("OrdinalModel", culture_1.Culture.English, new models_1.OrdinalModel(agnosticNumberParser_1.AgnosticNumberParserFactory.getParser(agnosticNumberParser_1.AgnosticNumberParserType.Ordinal, new parserConfiguration_1.EnglishNumberParserConfiguration()), new extractors_1.EnglishOrdinalExtractor()));
        this.registerModel("PercentModel", culture_1.Culture.English, new models_1.PercentModel(agnosticNumberParser_1.AgnosticNumberParserFactory.getParser(agnosticNumberParser_1.AgnosticNumberParserType.Percentage, new parserConfiguration_1.EnglishNumberParserConfiguration()), new extractors_1.EnglishPercentageExtractor()));
        // Spanish models
        this.registerModel("NumberModel", culture_1.Culture.Spanish, new models_1.NumberModel(agnosticNumberParser_1.AgnosticNumberParserFactory.getParser(agnosticNumberParser_1.AgnosticNumberParserType.Number, new parserConfiguration_2.SpanishNumberParserConfiguration()), new extractors_2.SpanishNumberExtractor(models_1.NumberMode.PureNumber)));
        this.registerModel("OrdinalModel", culture_1.Culture.Spanish, new models_1.OrdinalModel(agnosticNumberParser_1.AgnosticNumberParserFactory.getParser(agnosticNumberParser_1.AgnosticNumberParserType.Ordinal, new parserConfiguration_2.SpanishNumberParserConfiguration()), new extractors_2.SpanishOrdinalExtractor()));
        this.registerModel("PercentModel", culture_1.Culture.Spanish, new models_1.PercentModel(agnosticNumberParser_1.AgnosticNumberParserFactory.getParser(agnosticNumberParser_1.AgnosticNumberParserType.Percentage, new parserConfiguration_2.SpanishNumberParserConfiguration()), new extractors_2.SpanishPercentageExtractor()));
        // Portuguese models
        this.registerModel("NumberModel", culture_1.Culture.Portuguese, new models_1.NumberModel(agnosticNumberParser_1.AgnosticNumberParserFactory.getParser(agnosticNumberParser_1.AgnosticNumberParserType.Number, new parserConfiguration_3.PortugueseNumberParserConfiguration()), new extractors_3.PortugueseNumberExtractor(models_1.NumberMode.PureNumber)));
        this.registerModel("OrdinalModel", culture_1.Culture.Portuguese, new models_1.OrdinalModel(agnosticNumberParser_1.AgnosticNumberParserFactory.getParser(agnosticNumberParser_1.AgnosticNumberParserType.Ordinal, new parserConfiguration_3.PortugueseNumberParserConfiguration()), new extractors_3.PortugueseOrdinalExtractor()));
        this.registerModel("PercentModel", culture_1.Culture.Portuguese, new models_1.PercentModel(agnosticNumberParser_1.AgnosticNumberParserFactory.getParser(agnosticNumberParser_1.AgnosticNumberParserType.Percentage, new parserConfiguration_3.PortugueseNumberParserConfiguration()), new extractors_3.PortuguesePercentageExtractor()));
        // Chinese models
        this.registerModel("NumberModel", culture_1.Culture.Chinese, new models_1.NumberModel(agnosticNumberParser_1.AgnosticNumberParserFactory.getParser(agnosticNumberParser_1.AgnosticNumberParserType.Number, new parserConfiguration_5.ChineseNumberParserConfiguration()), new extractors_5.ChineseNumberExtractor()));
        this.registerModel("OrdinalModel", culture_1.Culture.Chinese, new models_1.OrdinalModel(agnosticNumberParser_1.AgnosticNumberParserFactory.getParser(agnosticNumberParser_1.AgnosticNumberParserType.Ordinal, new parserConfiguration_5.ChineseNumberParserConfiguration()), new extractors_5.ChineseOrdinalExtractor()));
        this.registerModel("PercentModel", culture_1.Culture.Chinese, new models_1.PercentModel(agnosticNumberParser_1.AgnosticNumberParserFactory.getParser(agnosticNumberParser_1.AgnosticNumberParserType.Percentage, new parserConfiguration_5.ChineseNumberParserConfiguration()), new extractors_5.ChinesePercentageExtractor()));
        // French models
        this.registerModel("NumberModel", culture_1.Culture.French, new models_1.NumberModel(agnosticNumberParser_1.AgnosticNumberParserFactory.getParser(agnosticNumberParser_1.AgnosticNumberParserType.Number, new parserConfiguration_4.FrenchNumberParserConfiguration()), new extractors_4.FrenchNumberExtractor(models_1.NumberMode.PureNumber)));
        this.registerModel("OrdinalModel", culture_1.Culture.French, new models_1.OrdinalModel(agnosticNumberParser_1.AgnosticNumberParserFactory.getParser(agnosticNumberParser_1.AgnosticNumberParserType.Ordinal, new parserConfiguration_4.FrenchNumberParserConfiguration()), new extractors_4.FrenchOrdinalExtractor()));
        this.registerModel("PercentModel", culture_1.Culture.French, new models_1.PercentModel(agnosticNumberParser_1.AgnosticNumberParserFactory.getParser(agnosticNumberParser_1.AgnosticNumberParserType.Percentage, new parserConfiguration_4.FrenchNumberParserConfiguration()), new extractors_4.FrenchPercentageExtractor()));
    }
    getNumberModel(culture, fallbackToDefaultCulture = true) {
        return this.getModel("NumberModel", culture, fallbackToDefaultCulture);
    }
    getOrdinalModel(culture, fallbackToDefaultCulture = true) {
        return this.getModel("OrdinalModel", culture, fallbackToDefaultCulture);
    }
    getPercentageModel(culture, fallbackToDefaultCulture = true) {
        return this.getModel("PercentModel", culture, fallbackToDefaultCulture);
    }
}
NumberRecognizer.instance = new NumberRecognizer();
exports.default = NumberRecognizer;
//# sourceMappingURL=numberRecognizer.js.map