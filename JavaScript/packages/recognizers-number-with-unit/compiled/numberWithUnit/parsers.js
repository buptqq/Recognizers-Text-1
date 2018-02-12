"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const recognizers_text_1 = require("recognizers-text");
const last = require("lodash.last");
class UnitValue {
    constructor() {
        this.number = "";
        this.unit = "";
    }
}
exports.UnitValue = UnitValue;
class NumberWithUnitParser {
    constructor(config) {
        this.config = config;
    }
    parse(extResult) {
        let ret = new recognizers_text_1.ParseResult(extResult);
        let numberResult;
        if (extResult.data && typeof extResult.data === "object") {
            numberResult = extResult.data;
        }
        else {
            numberResult = { start: -1, length: 0, text: null, type: null };
        }
        // key contains units
        let key = extResult.text;
        let unitKeyBuild = '';
        let unitKeys = new Array();
        for (let i = 0; i <= key.length; i++) {
            if (i === key.length) {
                if (unitKeyBuild.length !== 0) {
                    this.addIfNotContained(unitKeys, unitKeyBuild.trim());
                }
            }
            else if (i === numberResult.start) {
                if (unitKeyBuild.length !== 0) {
                    this.addIfNotContained(unitKeys, unitKeyBuild.trim());
                    unitKeyBuild = '';
                }
                let o = numberResult.start + numberResult.length - 1;
                if (o !== null && !isNaN(o)) {
                    i = o;
                }
            }
            else {
                unitKeyBuild += key[i];
            }
        }
        /* Unit type depends on last unit in suffix.*/
        let lastUnit = last(unitKeys).toLowerCase();
        if (this.config.connectorToken && this.config.connectorToken.length && lastUnit.indexOf(this.config.connectorToken) === 0) {
            lastUnit = lastUnit.substring(this.config.connectorToken.length).trim();
        }
        if (key && key.length && (this.config.unitMap !== null) && this.config.unitMap.has(lastUnit)) {
            let unitValue = this.config.unitMap.get(lastUnit);
            let numValue = numberResult.text && numberResult.text.length
                ? this.config.internalNumberParser.parse(numberResult)
                : null;
            let resolutionStr = numValue ? numValue.resolutionStr : null;
            ret.value =
                {
                    number: resolutionStr,
                    unit: unitValue
                };
            ret.resolutionStr = (`${resolutionStr} ${unitValue}`).trim();
        }
        return ret;
    }
    addIfNotContained(keys, newKey) {
        if (!keys.some(key => key.includes(newKey))) {
            keys.push(newKey);
        }
    }
}
exports.NumberWithUnitParser = NumberWithUnitParser;
class BaseNumberWithUnitParserConfiguration {
    constructor(cultureInfo) {
        this.cultureInfo = cultureInfo;
        this.unitMap = new Map();
    }
    BindDictionary(dictionary) {
        if (!dictionary)
            return;
        for (let key of dictionary.keys()) {
            let value = dictionary.get(key);
            if (!key || key.length === 0) {
                continue;
            }
            let values = value.trim().split('|');
            values.forEach(token => {
                if (!token || token.length === 0 || this.unitMap.has(token)) {
                    return;
                }
                this.unitMap.set(token, key);
            });
        }
    }
}
exports.BaseNumberWithUnitParserConfiguration = BaseNumberWithUnitParserConfiguration;
//# sourceMappingURL=parsers.js.map