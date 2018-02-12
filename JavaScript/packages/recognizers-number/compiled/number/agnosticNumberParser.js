"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const parsers_1 = require("./parsers");
const culture_1 = require("../culture");
const constants_1 = require("./constants");
const parsers_2 = require("./chinese/parsers");
var AgnosticNumberParserType;
(function (AgnosticNumberParserType) {
    AgnosticNumberParserType[AgnosticNumberParserType["Cardinal"] = 0] = "Cardinal";
    AgnosticNumberParserType[AgnosticNumberParserType["Double"] = 1] = "Double";
    AgnosticNumberParserType[AgnosticNumberParserType["Fraction"] = 2] = "Fraction";
    AgnosticNumberParserType[AgnosticNumberParserType["Integer"] = 3] = "Integer";
    AgnosticNumberParserType[AgnosticNumberParserType["Number"] = 4] = "Number";
    AgnosticNumberParserType[AgnosticNumberParserType["Ordinal"] = 5] = "Ordinal";
    AgnosticNumberParserType[AgnosticNumberParserType["Percentage"] = 6] = "Percentage";
})(AgnosticNumberParserType = exports.AgnosticNumberParserType || (exports.AgnosticNumberParserType = {}));
class AgnosticNumberParserFactory {
    static getParser(type, languageConfiguration) {
        let isChinese = languageConfiguration.cultureInfo.code.toLowerCase() === culture_1.Culture.Chinese;
        let parser;
        if (isChinese) {
            parser = new parsers_2.ChineseNumberParser(languageConfiguration);
            // console.log(parser);
        }
        else {
            parser = new parsers_1.BaseNumberParser(languageConfiguration);
        }
        switch (type) {
            case AgnosticNumberParserType.Cardinal:
                parser.supportedTypes = [constants_1.Constants.SYS_NUM_CARDINAL, constants_1.Constants.SYS_NUM_INTEGER, constants_1.Constants.SYS_NUM_DOUBLE];
                break;
            case AgnosticNumberParserType.Double:
                parser.supportedTypes = [constants_1.Constants.SYS_NUM_DOUBLE];
                break;
            case AgnosticNumberParserType.Fraction:
                parser.supportedTypes = [constants_1.Constants.SYS_NUM_FRACTION];
                break;
            case AgnosticNumberParserType.Integer:
                parser.supportedTypes = [constants_1.Constants.SYS_NUM_INTEGER];
                break;
            case AgnosticNumberParserType.Ordinal:
                parser.supportedTypes = [constants_1.Constants.SYS_NUM_ORDINAL];
                break;
            case AgnosticNumberParserType.Percentage:
                if (!isChinese) {
                    parser = new parsers_1.BasePercentageParser(languageConfiguration);
                }
                break;
        }
        return parser;
    }
}
exports.AgnosticNumberParserFactory = AgnosticNumberParserFactory;
//# sourceMappingURL=agnosticNumberParser.js.map