"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const recognizers_text_1 = require("recognizers-text");
const baseDateTime_1 = require("../resources/baseDateTime");
class DateTimeParseResult extends recognizers_text_1.ParseResult {
}
exports.DateTimeParseResult = DateTimeParseResult;
class BaseDateParserConfiguration {
    constructor() {
        this.dayOfMonth = baseDateTime_1.BaseDateTime.DayOfMonthDictionary;
    }
}
exports.BaseDateParserConfiguration = BaseDateParserConfiguration;
//# sourceMappingURL=parsers.js.map