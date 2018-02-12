"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const recognizers_text_number_1 = require("recognizers-text-number");
const parsers_1 = require("../parsers");
const englishNumericWithUnit_1 = require("../../resources/englishNumericWithUnit");
class EnglishNumberWithUnitExtractorConfiguration {
    constructor(ci) {
        this.cultureInfo = ci;
        this.unitNumExtractor = new recognizers_text_number_1.EnglishNumberExtractor();
        this.buildPrefix = englishNumericWithUnit_1.EnglishNumericWithUnit.BuildPrefix;
        this.buildSuffix = englishNumericWithUnit_1.EnglishNumericWithUnit.BuildSuffix;
        this.connectorToken = '';
    }
}
exports.EnglishNumberWithUnitExtractorConfiguration = EnglishNumberWithUnitExtractorConfiguration;
class EnglishNumberWithUnitParserConfiguration extends parsers_1.BaseNumberWithUnitParserConfiguration {
    constructor(ci) {
        super(ci);
        this.internalNumberExtractor = new recognizers_text_number_1.EnglishNumberExtractor(recognizers_text_number_1.NumberMode.Default);
        this.internalNumberParser = recognizers_text_number_1.AgnosticNumberParserFactory.getParser(recognizers_text_number_1.AgnosticNumberParserType.Number, new recognizers_text_number_1.EnglishNumberParserConfiguration());
        this.connectorToken = '';
    }
}
exports.EnglishNumberWithUnitParserConfiguration = EnglishNumberWithUnitParserConfiguration;
//# sourceMappingURL=base.js.map