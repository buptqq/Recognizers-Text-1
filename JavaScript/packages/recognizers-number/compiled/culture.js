"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const recognizers_text_1 = require("recognizers-text");
const trimEnd = require("lodash.trimend");
const bignumber_js_1 = require("bignumber.js");
const models_1 = require("./number/models");
class Culture extends recognizers_text_1.Culture {
    constructor(cultureName, cultureCode, longFormat) {
        super(cultureName, cultureCode);
        this.longFormat = longFormat;
    }
}
Culture.supportedCultures = [
    new Culture("English", Culture.English, new models_1.LongFormatType(',', '.')),
    new Culture("Chinese", Culture.Chinese, null),
    new Culture("Spanish", Culture.Spanish, new models_1.LongFormatType('.', ',')),
    new Culture("Portuguese", Culture.Portuguese, new models_1.LongFormatType('.', ',')),
    new Culture("French", Culture.French, new models_1.LongFormatType('.', ','))
];
exports.Culture = Culture;
class CultureInfo extends recognizers_text_1.CultureInfo {
    format(value) {
        let bigNumber = new bignumber_js_1.BigNumber(value);
        let s;
        if (bigNumber.decimalPlaces()) {
            s = bigNumber.toDigits(15, bignumber_js_1.BigNumber.ROUND_HALF_UP).toString();
        }
        else {
            s = bigNumber.toString().toUpperCase();
        }
        if (s.indexOf('.') > -1) {
            // trim leading 0 from decimal places
            s = trimEnd(s, '0');
        }
        if (s.indexOf('e-') > -1) {
            // mimic .NET behavior by adding leading 0 to exponential. E.g.: 1E-07
            let p = s.split('e-');
            p[1] = p[1].length === 1 ? ('0' + p[1]) : p[1];
            s = p.join('E-');
        }
        // TODO: Use BigNumber.toFormat instead
        let culture = Culture.supportedCultures.find(c => c.cultureCode === this.code);
        if (culture && culture.longFormat) {
            return s
                .split(',')
                .map(t => t.split('.').join(culture.longFormat.decimalsMark))
                .join(culture.longFormat.thousandsMark);
        }
        return s;
    }
}
exports.CultureInfo = CultureInfo;
//# sourceMappingURL=culture.js.map