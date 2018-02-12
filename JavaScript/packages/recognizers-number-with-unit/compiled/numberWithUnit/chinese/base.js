"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const recognizers_text_number_1 = require("recognizers-text-number");
const parsers_1 = require("../parsers");
const chineseNumericWithUnit_1 = require("../../resources/chineseNumericWithUnit");
class ChineseNumberWithUnitExtractorConfiguration {
    constructor(ci) {
        this.cultureInfo = ci;
        this.unitNumExtractor = new recognizers_text_number_1.ChineseNumberExtractor(recognizers_text_number_1.ChineseNumberMode.ExtractAll);
        this.buildPrefix = chineseNumericWithUnit_1.ChineseNumericWithUnit.BuildPrefix;
        this.buildSuffix = chineseNumericWithUnit_1.ChineseNumericWithUnit.BuildSuffix;
        this.connectorToken = chineseNumericWithUnit_1.ChineseNumericWithUnit.ConnectorToken;
    }
}
exports.ChineseNumberWithUnitExtractorConfiguration = ChineseNumberWithUnitExtractorConfiguration;
class ChineseNumberWithUnitParserConfiguration extends parsers_1.BaseNumberWithUnitParserConfiguration {
    constructor(ci) {
        super(ci);
        this.internalNumberExtractor = new recognizers_text_number_1.ChineseNumberExtractor(recognizers_text_number_1.ChineseNumberMode.Default);
        this.internalNumberParser = recognizers_text_number_1.AgnosticNumberParserFactory.getParser(recognizers_text_number_1.AgnosticNumberParserType.Number, new recognizers_text_number_1.ChineseNumberParserConfiguration());
        this.connectorToken = '';
    }
}
exports.ChineseNumberWithUnitParserConfiguration = ChineseNumberWithUnitParserConfiguration;
//# sourceMappingURL=base.js.map