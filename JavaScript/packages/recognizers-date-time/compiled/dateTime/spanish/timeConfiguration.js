"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const recognizers_text_1 = require("recognizers-text");
const spanishDateTime_1 = require("../../resources/spanishDateTime");
const baseDuration_1 = require("../baseDuration");
const durationConfiguration_1 = require("./durationConfiguration");
class SpanishTimeExtractorConfiguration {
    constructor() {
        this.atRegex = recognizers_text_1.RegExpUtility.getSafeRegExp(spanishDateTime_1.SpanishDateTime.AtRegex, "gis");
        this.ishRegex = null;
        this.timeRegexList = SpanishTimeExtractorConfiguration.getTimeRegexList();
        this.durationExtractor = new baseDuration_1.BaseDurationExtractor(new durationConfiguration_1.SpanishDurationExtractorConfiguration());
    }
    static getTimeRegexList() {
        return [
            recognizers_text_1.RegExpUtility.getSafeRegExp(spanishDateTime_1.SpanishDateTime.TimeRegex1, "gis"),
            recognizers_text_1.RegExpUtility.getSafeRegExp(spanishDateTime_1.SpanishDateTime.TimeRegex2, "gis"),
            recognizers_text_1.RegExpUtility.getSafeRegExp(spanishDateTime_1.SpanishDateTime.TimeRegex3, "gis"),
            recognizers_text_1.RegExpUtility.getSafeRegExp(spanishDateTime_1.SpanishDateTime.TimeRegex4, "gis"),
            recognizers_text_1.RegExpUtility.getSafeRegExp(spanishDateTime_1.SpanishDateTime.TimeRegex5, "gis"),
            recognizers_text_1.RegExpUtility.getSafeRegExp(spanishDateTime_1.SpanishDateTime.TimeRegex6, "gis"),
            recognizers_text_1.RegExpUtility.getSafeRegExp(spanishDateTime_1.SpanishDateTime.TimeRegex7, "gis"),
            recognizers_text_1.RegExpUtility.getSafeRegExp(spanishDateTime_1.SpanishDateTime.TimeRegex8, "gis"),
            recognizers_text_1.RegExpUtility.getSafeRegExp(spanishDateTime_1.SpanishDateTime.TimeRegex9, "gis"),
            recognizers_text_1.RegExpUtility.getSafeRegExp(spanishDateTime_1.SpanishDateTime.TimeRegex10, "gis"),
            recognizers_text_1.RegExpUtility.getSafeRegExp(spanishDateTime_1.SpanishDateTime.TimeRegex11, "gis"),
            recognizers_text_1.RegExpUtility.getSafeRegExp(spanishDateTime_1.SpanishDateTime.ConnectNumRegex, "gis")
        ];
    }
}
exports.SpanishTimeExtractorConfiguration = SpanishTimeExtractorConfiguration;
class SpanishTimeParserConfiguration {
    constructor(config) {
        this.timeTokenPrefix = spanishDateTime_1.SpanishDateTime.TimeTokenPrefix;
        this.atRegex = recognizers_text_1.RegExpUtility.getSafeRegExp(spanishDateTime_1.SpanishDateTime.AtRegex, "gis");
        this.timeRegexes = SpanishTimeExtractorConfiguration.getTimeRegexList();
        this.lessThanOneHour = recognizers_text_1.RegExpUtility.getSafeRegExp(spanishDateTime_1.SpanishDateTime.LessThanOneHour, "gis");
        this.timeSuffix = recognizers_text_1.RegExpUtility.getSafeRegExp(spanishDateTime_1.SpanishDateTime.TimeSuffix, "gis");
        this.utilityConfiguration = config.utilityConfiguration;
        this.numbers = config.numbers;
    }
    adjustByPrefix(prefix, adjust) {
        let deltaMin = 0;
        let trimedPrefix = prefix.trim().toLowerCase();
        if (trimedPrefix.startsWith("cuarto") || trimedPrefix.startsWith("y cuarto")) {
            deltaMin = 15;
        }
        else if (trimedPrefix.startsWith("menos cuarto")) {
            deltaMin = -15;
        }
        else if (trimedPrefix.startsWith("media") || trimedPrefix.startsWith("y media")) {
            deltaMin = 30;
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
        if (trimedPrefix.endsWith("pasadas") || trimedPrefix.endsWith("pasados") ||
            trimedPrefix.endsWith("pasadas las") || trimedPrefix.endsWith("pasados las") ||
            trimedPrefix.endsWith("pasadas de las") || trimedPrefix.endsWith("pasados de las")) {
            // deltaMin it's positive
        }
        else if (trimedPrefix.endsWith("para la") || trimedPrefix.endsWith("para las") ||
            trimedPrefix.endsWith("antes de la") || trimedPrefix.endsWith("antes de las")) {
            deltaMin = -deltaMin;
        }
        adjust.min += deltaMin;
        if (adjust.min < 0) {
            adjust.min += 60;
            adjust.hour -= 1;
        }
        adjust.hasMin = adjust.hasMin || adjust.min !== 0;
    }
    adjustBySuffix(suffix, adjust) {
        let trimedSuffix = suffix.trim().toLowerCase();
        this.adjustByPrefix(trimedSuffix, adjust);
        let deltaHour = 0;
        let matches = recognizers_text_1.RegExpUtility.getMatches(this.timeSuffix, trimedSuffix);
        if (matches.length) {
            let match = matches[0];
            if (match.index === 0 && match.length === trimedSuffix.length) {
                let oclockStr = match.groups("oclock").value;
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
exports.SpanishTimeParserConfiguration = SpanishTimeParserConfiguration;
//# sourceMappingURL=timeConfiguration.js.map