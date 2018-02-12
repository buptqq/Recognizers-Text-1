"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const recognizers_text_1 = require("recognizers-text");
class DateTimeModelResult extends recognizers_text_1.ModelResult {
}
exports.DateTimeModelResult = DateTimeModelResult;
class DateTimeModel {
    constructor(parser, extractor) {
        this.modelTypeName = "datetime";
        this.extractor = extractor;
        this.parser = parser;
    }
    parse(query, referenceDate = new Date()) {
        query = recognizers_text_1.FormatUtility.preProcess(query);
        let extractResults = this.extractor.extract(query, referenceDate);
        let parseDates = new Array();
        for (let result of extractResults) {
            let parseResult = this.parser.parse(result, referenceDate);
            if (Array.isArray(parseResult.value)) {
                parseDates.push(...parseResult.value);
            }
            else {
                parseDates.push(parseResult);
            }
        }
        return parseDates
            .map(o => ({
            start: o.start,
            end: o.start + o.length - 1,
            resolution: o.value,
            text: o.text,
            typeName: o.type
        }));
    }
}
exports.DateTimeModel = DateTimeModel;
//# sourceMappingURL=models.js.map