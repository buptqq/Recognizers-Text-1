"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const recognizers_text_number_1 = require("recognizers-text-number");
const parsers_1 = require("../parsers");
const frenchNumericWithUnit_1 = require("../../resources/frenchNumericWithUnit");
class FrenchNumberWithUnitExtractorConfiguration {
    constructor(ci) {
        this.cultureInfo = ci;
        this.unitNumExtractor = new recognizers_text_number_1.FrenchNumberExtractor();
        this.buildPrefix = frenchNumericWithUnit_1.FrenchNumericWithUnit.BuildPrefix;
        this.buildSuffix = frenchNumericWithUnit_1.FrenchNumericWithUnit.BuildSuffix;
        this.connectorToken = frenchNumericWithUnit_1.FrenchNumericWithUnit.ConnectorToken;
    }
}
exports.FrenchNumberWithUnitExtractorConfiguration = FrenchNumberWithUnitExtractorConfiguration;
class FrenchNumberWithUnitParserConfiguration extends parsers_1.BaseNumberWithUnitParserConfiguration {
    constructor(ci) {
        super(ci);
        this.internalNumberExtractor = new recognizers_text_number_1.FrenchNumberExtractor(recognizers_text_number_1.NumberMode.Default);
        this.internalNumberParser = recognizers_text_number_1.AgnosticNumberParserFactory.getParser(recognizers_text_number_1.AgnosticNumberParserType.Number, new recognizers_text_number_1.FrenchNumberParserConfiguration());
        this.connectorToken = frenchNumericWithUnit_1.FrenchNumericWithUnit.ConnectorToken;
    }
}
exports.FrenchNumberWithUnitParserConfiguration = FrenchNumberWithUnitParserConfiguration;
//# sourceMappingURL=base.js.map