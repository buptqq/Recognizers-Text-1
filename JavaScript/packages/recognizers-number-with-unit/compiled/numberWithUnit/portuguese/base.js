"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const recognizers_text_number_1 = require("recognizers-text-number");
const parsers_1 = require("../parsers");
const portugueseNumericWithUnit_1 = require("../../resources/portugueseNumericWithUnit");
class PortugueseNumberWithUnitExtractorConfiguration {
    constructor(ci) {
        this.cultureInfo = ci;
        this.unitNumExtractor = new recognizers_text_number_1.PortugueseNumberExtractor();
        this.buildPrefix = portugueseNumericWithUnit_1.PortugueseNumericWithUnit.BuildPrefix;
        this.buildSuffix = portugueseNumericWithUnit_1.PortugueseNumericWithUnit.BuildSuffix;
        this.connectorToken = portugueseNumericWithUnit_1.PortugueseNumericWithUnit.ConnectorToken;
    }
}
exports.PortugueseNumberWithUnitExtractorConfiguration = PortugueseNumberWithUnitExtractorConfiguration;
class PortugueseNumberWithUnitParserConfiguration extends parsers_1.BaseNumberWithUnitParserConfiguration {
    constructor(ci) {
        super(ci);
        this.internalNumberExtractor = new recognizers_text_number_1.PortugueseNumberExtractor(recognizers_text_number_1.NumberMode.Default);
        this.internalNumberParser = recognizers_text_number_1.AgnosticNumberParserFactory.getParser(recognizers_text_number_1.AgnosticNumberParserType.Number, new recognizers_text_number_1.PortugueseNumberParserConfiguration());
        this.connectorToken = portugueseNumericWithUnit_1.PortugueseNumericWithUnit.ConnectorToken;
    }
}
exports.PortugueseNumberWithUnitParserConfiguration = PortugueseNumberWithUnitParserConfiguration;
//# sourceMappingURL=base.js.map