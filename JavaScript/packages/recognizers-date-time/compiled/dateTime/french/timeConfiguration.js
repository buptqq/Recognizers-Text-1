"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const recognizers_text_1 = require("recognizers-text");
const frenchDateTime_1 = require("../../resources/frenchDateTime");
const baseDuration_1 = require("../baseDuration");
const durationConfiguration_1 = require("./durationConfiguration");
class FrenchTimeExtractorConfiguration {
    constructor() {
        this.atRegex = recognizers_text_1.RegExpUtility.getSafeRegExp(frenchDateTime_1.FrenchDateTime.AtRegex, "gis");
        this.ishRegex = recognizers_text_1.RegExpUtility.getSafeRegExp(frenchDateTime_1.FrenchDateTime.IshRegex, "gis");
        ;
        this.timeRegexList = FrenchTimeExtractorConfiguration.getTimeRegexList();
        this.durationExtractor = new baseDuration_1.BaseDurationExtractor(new durationConfiguration_1.FrenchDurationExtractorConfiguration());
    }
    static getTimeRegexList() {
        return [
            recognizers_text_1.RegExpUtility.getSafeRegExp(frenchDateTime_1.FrenchDateTime.TimeRegex1, "gis"),
            recognizers_text_1.RegExpUtility.getSafeRegExp(frenchDateTime_1.FrenchDateTime.TimeRegex2, "gis"),
            recognizers_text_1.RegExpUtility.getSafeRegExp(frenchDateTime_1.FrenchDateTime.TimeRegex3, "gis"),
            recognizers_text_1.RegExpUtility.getSafeRegExp(frenchDateTime_1.FrenchDateTime.TimeRegex4, "gis"),
            recognizers_text_1.RegExpUtility.getSafeRegExp(frenchDateTime_1.FrenchDateTime.TimeRegex5, "gis"),
            recognizers_text_1.RegExpUtility.getSafeRegExp(frenchDateTime_1.FrenchDateTime.TimeRegex6, "gis"),
            recognizers_text_1.RegExpUtility.getSafeRegExp(frenchDateTime_1.FrenchDateTime.TimeRegex7, "gis"),
            recognizers_text_1.RegExpUtility.getSafeRegExp(frenchDateTime_1.FrenchDateTime.TimeRegex8, "gis"),
            recognizers_text_1.RegExpUtility.getSafeRegExp(frenchDateTime_1.FrenchDateTime.TimeRegex9, "gis"),
            recognizers_text_1.RegExpUtility.getSafeRegExp(frenchDateTime_1.FrenchDateTime.ConnectNumRegex, "gis")
        ];
    }
}
exports.FrenchTimeExtractorConfiguration = FrenchTimeExtractorConfiguration;
class FrenchTimeParserConfiguration {
    constructor(config) {
        this.timeTokenPrefix = frenchDateTime_1.FrenchDateTime.TimeTokenPrefix;
        this.atRegex = recognizers_text_1.RegExpUtility.getSafeRegExp(frenchDateTime_1.FrenchDateTime.AtRegex, "gis");
        this.timeRegexes = FrenchTimeExtractorConfiguration.getTimeRegexList();
        this.lessThanOneHour = recognizers_text_1.RegExpUtility.getSafeRegExp(frenchDateTime_1.FrenchDateTime.LessThanOneHour, "gis");
        this.timeSuffix = recognizers_text_1.RegExpUtility.getSafeRegExp(frenchDateTime_1.FrenchDateTime.TimeSuffix, "gis");
        this.utilityConfiguration = config.utilityConfiguration;
        this.numbers = config.numbers;
    }
    adjustByPrefix(prefix, adjust) {
        let deltaMin = 0;
        let trimedPrefix = prefix.trim().toLowerCase();
        if (trimedPrefix.endsWith("demie")) {
            deltaMin = 30;
        }
        else if (trimedPrefix.endsWith("un quart") || trimedPrefix.endsWith("quart")) {
            deltaMin = 15;
        }
        else if (trimedPrefix.endsWith("trois quarts")) {
            deltaMin = 45;
        }
        else {
            let matches = recognizers_text_1.RegExpUtility.getMatches(this.lessThanOneHour, trimedPrefix);
            if (matches.length) {
                let match = matches[0];
                let minStr = match.groups("deltamin").value;
                if (minStr) {
                    deltaMin = parseInt(minStr, 10);
                }
                else {
                    minStr = match.groups("deltaminnum").value.toLowerCase();
                    if (this.numbers.has(minStr)) {
                        deltaMin = this.numbers.get(minStr);
                    }
                }
            }
        }
        if (trimedPrefix.endsWith("à")) {
            deltaMin = -deltaMin;
        }
        adjust.min += deltaMin;
        if (adjust.min < 0) {
            adjust.min += 60;
            adjust.hour -= 1;
        }
        adjust.hasMin = true;
    }
    adjustBySuffix(suffix, adjust) {
        let trimedSuffix = suffix.trim().toLowerCase();
        let deltaHour = 0;
        let matches = recognizers_text_1.RegExpUtility.getMatches(this.timeSuffix, trimedSuffix);
        if (matches.length) {
            let match = matches[0];
            if (match.index === 0 && match.length === trimedSuffix.length) {
                let oclockStr = match.groups("heures").value;
                if (!oclockStr) {
                    let amStr = match.groups("am").value;
                    if (amStr) {
                        if (adjust.hour >= 12) {
                            deltaHour = -12;
                        }
                        adjust.hasAm = true;
                    }
                    let pmStr = match.groups("pm").value;
                    if (pmStr) {
                        if (adjust.hour < 12) {
                            deltaHour = 12;
                        }
                        adjust.hasPm = true;
                    }
                }
            }
        }
        adjust.hour = (adjust.hour + deltaHour) % 24;
    }
}
exports.FrenchTimeParserConfiguration = FrenchTimeParserConfiguration;
//# sourceMappingURL=timeConfiguration.js.map