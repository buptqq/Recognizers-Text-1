"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const recognizers_text_number_1 = require("recognizers-text-number");
const parsers_1 = require("../parsers");
const spanishNumericWithUnit_1 = require("../../resources/spanishNumericWithUnit");
class SpanishNumberWithUnitExtractorConfiguration {
    constructor(ci) {
        this.cultureInfo = ci;
        this.unitNumExtractor = new recognizers_text_number_1.SpanishNumberExtractor();
        this.buildPrefix = spanishNumericWithUnit_1.SpanishNumericWithUnit.BuildPrefix;
        this.buildSuffix = spanishNumericWithUnit_1.SpanishNumericWithUnit.BuildSuffix;
        this.connectorToken = spanishNumericWithUnit_1.SpanishNumericWithUnit.ConnectorToken;
    }
}
exports.SpanishNumberWithUnitExtractorConfiguration = SpanishNumberWithUnitExtractorConfiguration;
class SpanishNumberWithUnitParserConfiguration extends parsers_1.BaseNumberWithUnitParserConfiguration {
    constructor(ci) {
        super(ci);
        this.internalNumberExtractor = new recognizers_text_number_1.SpanishNumberExtractor(recognizers_text_number_1.NumberMode.Default);
        this.internalNumberParser = recognizers_text_number_1.AgnosticNumberParserFactory.getParser(recognizers_text_number_1.AgnosticNumberParserType.Number, new recognizers_text_number_1.SpanishNumberParserConfiguration());
        this.connectorToken = spanishNumericWithUnit_1.SpanishNumericWithUnit.ConnectorToken;
    }
}
exports.SpanishNumberWithUnitParserConfiguration = SpanishNumberWithUnitParserConfiguration;
//# sourceMappingURL=base.js.map