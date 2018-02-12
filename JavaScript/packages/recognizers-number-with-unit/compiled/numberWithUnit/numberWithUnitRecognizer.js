"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const recognizers_text_1 = require("recognizers-text");
const recognizers_text_number_1 = require("recognizers-text-number");
const models_1 = require("./models");
const extractors_1 = require("./extractors");
const parsers_1 = require("./parsers");
const currency_1 = require("./english/currency");
const temperature_1 = require("./english/temperature");
const dimension_1 = require("./english/dimension");
const age_1 = require("./english/age");
const currency_2 = require("./spanish/currency");
const temperature_2 = require("./spanish/temperature");
const dimension_2 = require("./spanish/dimension");
const age_2 = require("./spanish/age");
const currency_3 = require("./portuguese/currency");
const temperature_3 = require("./portuguese/temperature");
const dimension_3 = require("./portuguese/dimension");
const age_3 = require("./portuguese/age");
const currency_4 = require("./chinese/currency");
const temperature_4 = require("./chinese/temperature");
const dimension_4 = require("./chinese/dimension");
const age_4 = require("./chinese/age");
const currency_5 = require("./french/currency");
const temperature_5 = require("./french/temperature");
const dimension_5 = require("./french/dimension");
const age_5 = require("./french/age");
class NumberWithUnitRecognizer extends recognizers_text_1.Recognizer {
    constructor() {
        super();
        // English models
        this.registerModel("CurrencyModel", recognizers_text_number_1.Culture.English, new models_1.CurrencyModel(new Map([
            [new extractors_1.NumberWithUnitExtractor(new currency_1.EnglishCurrencyExtractorConfiguration()), new parsers_1.NumberWithUnitParser(new currency_1.EnglishCurrencyParserConfiguration())]
        ])));
        this.registerModel("TemperatureModel", recognizers_text_number_1.Culture.English, new models_1.TemperatureModel(new Map([
            [new extractors_1.NumberWithUnitExtractor(new temperature_1.EnglishTemperatureExtractorConfiguration()), new parsers_1.NumberWithUnitParser(new temperature_1.EnglishTemperatureParserConfiguration())]
        ])));
        this.registerModel("DimensionModel", recognizers_text_number_1.Culture.English, new models_1.DimensionModel(new Map([
            [new extractors_1.NumberWithUnitExtractor(new dimension_1.EnglishDimensionExtractorConfiguration()), new parsers_1.NumberWithUnitParser(new dimension_1.EnglishDimensionParserConfiguration())]
        ])));
        this.registerModel("AgeModel", recognizers_text_number_1.Culture.English, new models_1.AgeModel(new Map([
            [new extractors_1.NumberWithUnitExtractor(new age_1.EnglishAgeExtractorConfiguration()), new parsers_1.NumberWithUnitParser(new age_1.EnglishAgeParserConfiguration())]
        ])));
        // Spanish models
        this.registerModel("CurrencyModel", recognizers_text_number_1.Culture.Spanish, new models_1.CurrencyModel(new Map([
            [new extractors_1.NumberWithUnitExtractor(new currency_2.SpanishCurrencyExtractorConfiguration()), new parsers_1.NumberWithUnitParser(new currency_2.SpanishCurrencyParserConfiguration())]
        ])));
        this.registerModel("TemperatureModel", recognizers_text_number_1.Culture.Spanish, new models_1.TemperatureModel(new Map([
            [new extractors_1.NumberWithUnitExtractor(new temperature_2.SpanishTemperatureExtractorConfiguration()), new parsers_1.NumberWithUnitParser(new temperature_2.SpanishTemperatureParserConfiguration())]
        ])));
        this.registerModel("DimensionModel", recognizers_text_number_1.Culture.Spanish, new models_1.DimensionModel(new Map([
            [new extractors_1.NumberWithUnitExtractor(new dimension_2.SpanishDimensionExtractorConfiguration()), new parsers_1.NumberWithUnitParser(new dimension_2.SpanishDimensionParserConfiguration())]
        ])));
        this.registerModel("AgeModel", recognizers_text_number_1.Culture.Spanish, new models_1.AgeModel(new Map([
            [new extractors_1.NumberWithUnitExtractor(new age_2.SpanishAgeExtractorConfiguration()), new parsers_1.NumberWithUnitParser(new age_2.SpanishAgeParserConfiguration())]
        ])));
        // Portuguese models
        this.registerModel("CurrencyModel", recognizers_text_number_1.Culture.Portuguese, new models_1.CurrencyModel(new Map([
            [new extractors_1.NumberWithUnitExtractor(new currency_3.PortugueseCurrencyExtractorConfiguration()), new parsers_1.NumberWithUnitParser(new currency_3.PortugueseCurrencyParserConfiguration())]
        ])));
        this.registerModel("TemperatureModel", recognizers_text_number_1.Culture.Portuguese, new models_1.TemperatureModel(new Map([
            [new extractors_1.NumberWithUnitExtractor(new temperature_3.PortugueseTemperatureExtractorConfiguration()), new parsers_1.NumberWithUnitParser(new temperature_3.PortugueseTemperatureParserConfiguration())]
        ])));
        this.registerModel("DimensionModel", recognizers_text_number_1.Culture.Portuguese, new models_1.DimensionModel(new Map([
            [new extractors_1.NumberWithUnitExtractor(new dimension_3.PortugueseDimensionExtractorConfiguration()), new parsers_1.NumberWithUnitParser(new dimension_3.PortugueseDimensionParserConfiguration())]
        ])));
        this.registerModel("AgeModel", recognizers_text_number_1.Culture.Portuguese, new models_1.AgeModel(new Map([
            [new extractors_1.NumberWithUnitExtractor(new age_3.PortugueseAgeExtractorConfiguration()), new parsers_1.NumberWithUnitParser(new age_3.PortugueseAgeParserConfiguration())]
        ])));
        // Chinese models
        this.registerModel("CurrencyModel", recognizers_text_number_1.Culture.Chinese, new models_1.CurrencyModel(new Map([
            [new extractors_1.NumberWithUnitExtractor(new currency_4.ChineseCurrencyExtractorConfiguration()), new parsers_1.NumberWithUnitParser(new currency_4.ChineseCurrencyParserConfiguration())],
            [new extractors_1.NumberWithUnitExtractor(new currency_1.EnglishCurrencyExtractorConfiguration()), new parsers_1.NumberWithUnitParser(new currency_1.EnglishCurrencyParserConfiguration())]
        ])));
        this.registerModel("TemperatureModel", recognizers_text_number_1.Culture.Chinese, new models_1.TemperatureModel(new Map([
            [new extractors_1.NumberWithUnitExtractor(new temperature_4.ChineseTemperatureExtractorConfiguration()), new parsers_1.NumberWithUnitParser(new temperature_4.ChineseTemperatureParserConfiguration())],
            [new extractors_1.NumberWithUnitExtractor(new temperature_1.EnglishTemperatureExtractorConfiguration()), new parsers_1.NumberWithUnitParser(new temperature_1.EnglishTemperatureParserConfiguration())]
        ])));
        this.registerModel("DimensionModel", recognizers_text_number_1.Culture.Chinese, new models_1.DimensionModel(new Map([
            [new extractors_1.NumberWithUnitExtractor(new dimension_4.ChineseDimensionExtractorConfiguration()), new parsers_1.NumberWithUnitParser(new dimension_4.ChineseDimensionParserConfiguration())],
            [new extractors_1.NumberWithUnitExtractor(new dimension_1.EnglishDimensionExtractorConfiguration()), new parsers_1.NumberWithUnitParser(new dimension_1.EnglishDimensionParserConfiguration())]
        ])));
        this.registerModel("AgeModel", recognizers_text_number_1.Culture.Chinese, new models_1.AgeModel(new Map([
            [new extractors_1.NumberWithUnitExtractor(new age_4.ChineseAgeExtractorConfiguration()), new parsers_1.NumberWithUnitParser(new age_4.ChineseAgeParserConfiguration())],
            [new extractors_1.NumberWithUnitExtractor(new age_1.EnglishAgeExtractorConfiguration()), new parsers_1.NumberWithUnitParser(new age_1.EnglishAgeParserConfiguration())]
        ])));
        // French models
        this.registerModel("CurrencyModel", recognizers_text_number_1.Culture.French, new models_1.CurrencyModel(new Map([
            [new extractors_1.NumberWithUnitExtractor(new currency_5.FrenchCurrencyExtractorConfiguration()), new parsers_1.NumberWithUnitParser(new currency_5.FrenchCurrencyParserConfiguration())]
        ])));
        this.registerModel("TemperatureModel", recognizers_text_number_1.Culture.French, new models_1.TemperatureModel(new Map([
            [new extractors_1.NumberWithUnitExtractor(new temperature_5.FrenchTemperatureExtractorConfiguration()), new parsers_1.NumberWithUnitParser(new temperature_5.FrenchTemperatureParserConfiguration())]
        ])));
        this.registerModel("DimensionModel", recognizers_text_number_1.Culture.French, new models_1.DimensionModel(new Map([
            [new extractors_1.NumberWithUnitExtractor(new dimension_5.FrenchDimensionExtractorConfiguration()), new parsers_1.NumberWithUnitParser(new dimension_5.FrenchDimensionParserConfiguration())]
        ])));
        this.registerModel("AgeModel", recognizers_text_number_1.Culture.French, new models_1.AgeModel(new Map([
            [new extractors_1.NumberWithUnitExtractor(new age_5.FrenchAgeExtractorConfiguration()), new parsers_1.NumberWithUnitParser(new age_5.FrenchAgeParserConfiguration())]
        ])));
    }
    getCurrencyModel(culture, fallbackToDefaultCulture = true) {
        return this.getModel("CurrencyModel", culture, fallbackToDefaultCulture);
    }
    getTemperatureModel(culture, fallbackToDefaultCulture = true) {
        return this.getModel("TemperatureModel", culture, fallbackToDefaultCulture);
    }
    getDimensionModel(culture, fallbackToDefaultCulture = true) {
        return this.getModel("DimensionModel", culture, fallbackToDefaultCulture);
    }
    getAgeModel(culture, fallbackToDefaultCulture = true) {
        return this.getModel("AgeModel", culture, fallbackToDefaultCulture);
    }
}
NumberWithUnitRecognizer.instance = new NumberWithUnitRecognizer();
exports.default = NumberWithUnitRecognizer;
//# sourceMappingURL=numberWithUnitRecognizer.js.map