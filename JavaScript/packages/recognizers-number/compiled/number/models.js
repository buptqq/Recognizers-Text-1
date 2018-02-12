"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var NumberMode;
(function (NumberMode) {
    // Default is for unit and datetime
    NumberMode[NumberMode["Default"] = 0] = "Default";
    // Add 67.5 billion & million support.
    NumberMode[NumberMode["Currency"] = 1] = "Currency";
    // Don't extract number from cases like 16ml
    NumberMode[NumberMode["PureNumber"] = 2] = "PureNumber";
})(NumberMode = exports.NumberMode || (exports.NumberMode = {}));
class LongFormatType {
    constructor(thousandsMark, decimalsMark) {
        this.thousandsMark = thousandsMark;
        this.decimalsMark = decimalsMark;
    }
}
// Reference : https://www.wikiwand.com/en/Decimal_mark
// Value : 1234567.89
// 1,234,567
LongFormatType.integerNumComma = new LongFormatType(',', '\0');
// 1.234.567
LongFormatType.integerNumDot = new LongFormatType('.', '\0');
// 1 234 567
LongFormatType.integerNumBlank = new LongFormatType(' ', '\0');
// 1'234'567
LongFormatType.integerNumQuote = new LongFormatType('\'', '\0');
// 1,234,567.89
LongFormatType.doubleNumCommaDot = new LongFormatType(',', '.');
// 1,234,567·89
LongFormatType.doubleNumCommaCdot = new LongFormatType(',', '·');
// 1 234 567,89
LongFormatType.doubleNumBlankComma = new LongFormatType(' ', ',');
// 1 234 567.89
LongFormatType.doubleNumBlankDot = new LongFormatType(' ', '.');
// 1.234.567,89
LongFormatType.doubleNumDotComma = new LongFormatType('.', ',');
// 1'234'567,89
LongFormatType.doubleNumQuoteComma = new LongFormatType('\'', ',');
exports.LongFormatType = LongFormatType;
class AbstractNumberModel {
    constructor(parser, extractor) {
        this.extractor = extractor;
        this.parser = parser;
    }
    parse(query) {
        let extractResults = this.extractor.extract(query);
        let parseNums = extractResults.map(r => this.parser.parse(r));
        //add by qiuqian,2018.2.11,debugger
        //console.log(parseNums[0].data);
        //console.log("extractResults : ",extractResults);
        //console.log("parseNums : ",parseNums);
        return parseNums
            .map(o => o)
            .map(o => ({
            start: o.start,
            end: o.start + o.length - 1,
            resolution: { value: o.resolutionStr },
            text: o.text,
            typeName: this.modelTypeName
        }));
    }
}
exports.AbstractNumberModel = AbstractNumberModel;
class NumberModel extends AbstractNumberModel {
    constructor() {
        super(...arguments);
        this.modelTypeName = "number";
    }
}
exports.NumberModel = NumberModel;
class OrdinalModel extends AbstractNumberModel {
    constructor() {
        super(...arguments);
        this.modelTypeName = "ordinal";
    }
}
exports.OrdinalModel = OrdinalModel;
class PercentModel extends AbstractNumberModel {
    constructor() {
        super(...arguments);
        this.modelTypeName = "percentage";
    }
}
exports.PercentModel = PercentModel;
//# sourceMappingURL=models.js.map