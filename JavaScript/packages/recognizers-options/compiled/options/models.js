"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
class OptionsModel {
    constructor(parser, extractor) {
        this.extractor = extractor;
        this.parser = parser;
    }
    parse(source) {
        let extractResults = this.extractor.extract(source);
        let parseResults = extractResults.map(r => this.parser.parse(r));
        return parseResults
            .map(o => o)
            .map(o => ({
            start: o.start,
            end: o.start + o.length - 1,
            resolution: this.getResolution(o),
            text: o.text,
            typeName: this.modelTypeName
        }));
    }
}
exports.OptionsModel = OptionsModel;
class BooleanModel extends OptionsModel {
    constructor() {
        super(...arguments);
        this.modelTypeName = 'boolean';
    }
    getResolution(sources) {
        let results = {
            value: sources.value,
            score: sources.data.score
        };
        if (sources.data.otherMatches) {
            results.otherResults = sources.data.otherMatches.map(o => ({
                text: o.text,
                value: o.value,
                score: o.data.score
            }));
        }
        return results;
    }
}
exports.BooleanModel = BooleanModel;
//# sourceMappingURL=models.js.map