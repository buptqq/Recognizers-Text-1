"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const recognizers_text_1 = require("recognizers-text");
var CompositeEntityType;
(function (CompositeEntityType) {
    CompositeEntityType[CompositeEntityType["Age"] = 0] = "Age";
    CompositeEntityType[CompositeEntityType["Currency"] = 1] = "Currency";
    CompositeEntityType[CompositeEntityType["Dimension"] = 2] = "Dimension";
    CompositeEntityType[CompositeEntityType["Temperature"] = 3] = "Temperature";
})(CompositeEntityType = exports.CompositeEntityType || (exports.CompositeEntityType = {}));
class AbstractNumberWithUnitModel {
    constructor(extractorParsersMap) {
        this.extractorParsersMap = extractorParsersMap;
    }
    parse(query) {
        query = recognizers_text_1.FormatUtility.preProcess(query, false);
        let extractionResults = new Array();
        for (let kv of this.extractorParsersMap.entries()) {
            let extractor = kv[0];
            let parser = kv[1];
            let extractResults = extractor.extract(query);
            let parseResults = extractResults.map(r => parser.parse(r))
                .filter(o => o.value !== null);
            let modelResults = parseResults.map(o => ({
                start: o.start,
                end: o.start + o.length - 1,
                resolution: this.getResolution(o.value),
                text: o.text,
                typeName: this.modelTypeName
            }));
            modelResults.forEach(result => {
                let bAdd = true;
                extractionResults.forEach(extractionResult => {
                    if (extractionResult.start === result.start && extractionResult.end === result.end) {
                        bAdd = false;
                    }
                });
                if (bAdd) {
                    extractionResults.push(result);
                }
            });
        }
        return extractionResults;
    }
    getResolution(data) {
        if (typeof data === 'undefined')
            return null;
        return typeof data === "string"
            ? { value: data.toString() }
            : { value: data.number, unit: data.unit };
    }
}
exports.AbstractNumberWithUnitModel = AbstractNumberWithUnitModel;
class AgeModel extends AbstractNumberWithUnitModel {
    constructor() {
        super(...arguments);
        this.modelTypeName = "age";
    }
}
exports.AgeModel = AgeModel;
class CurrencyModel extends AbstractNumberWithUnitModel {
    constructor() {
        super(...arguments);
        this.modelTypeName = "currency";
    }
}
exports.CurrencyModel = CurrencyModel;
class DimensionModel extends AbstractNumberWithUnitModel {
    constructor() {
        super(...arguments);
        this.modelTypeName = "dimension";
    }
}
exports.DimensionModel = DimensionModel;
class TemperatureModel extends AbstractNumberWithUnitModel {
    constructor() {
        super(...arguments);
        this.modelTypeName = "temperature";
    }
}
exports.TemperatureModel = TemperatureModel;
//# sourceMappingURL=models.js.map