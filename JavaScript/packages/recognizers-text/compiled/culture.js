"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
class Culture {
    constructor(cultureName, cultureCode) {
        this.cultureName = cultureName;
        this.cultureCode = cultureCode;
    }
    static getSupportedCultureCodes() {
        return Culture.supportedCultures.map(c => c.cultureCode);
    }
}
Culture.English = "en-us";
Culture.Chinese = "zh-cn";
Culture.Spanish = "es-es";
Culture.Portuguese = "pt-br";
Culture.French = "fr-fr";
Culture.supportedCultures = [
    new Culture("English", Culture.English),
    new Culture("Chinese", Culture.Chinese),
    new Culture("Spanish", Culture.Spanish),
    new Culture("Portuguese", Culture.Portuguese),
    new Culture("French", Culture.French)
];
exports.Culture = Culture;
class CultureInfo {
    static getCultureInfo(cultureCode) {
        return new CultureInfo(cultureCode);
    }
    constructor(cultureName) {
        this.code = cultureName;
    }
}
exports.CultureInfo = CultureInfo;
//# sourceMappingURL=culture.js.map