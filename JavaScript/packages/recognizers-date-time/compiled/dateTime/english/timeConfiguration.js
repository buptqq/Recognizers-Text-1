"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const recognizers_text_1 = require("recognizers-text");
const englishDateTime_1 = require("../../resources/englishDateTime");
class EnglishTimeExtractorConfiguration {
    constructor() {
        this.timeRegexList = EnglishTimeExtractorConfiguration.timeRegexList;
        this.atRegex = EnglishTimeExtractorConfiguration.atRegex;
        this.ishRegex = EnglishTimeExtractorConfiguration.ishRegex;
    }
}
EnglishTimeExtractorConfiguration.timeRegexList = [
    // (three min past)? seven|7|(seven thirty) pm
    recognizers_text_1.RegExpUtility.getSafeRegExp(englishDateTime_1.EnglishDateTime.TimeRegex1, "gis"),
    // (three min past)? 3:00(:00)? (pm)?
    recognizers_text_1.RegExpUtility.getSafeRegExp(englishDateTime_1.EnglishDateTime.TimeRegex2, "gis"),
    // (three min past)? 3.00 (pm)?
    recognizers_text_1.RegExpUtility.getSafeRegExp(englishDateTime_1.EnglishDateTime.TimeRegex3, "gis"),
    // (three min past) (five thirty|seven|7|7:00(:00)?) (pm)? (in the night)
    recognizers_text_1.RegExpUtility.getSafeRegExp(englishDateTime_1.EnglishDateTime.TimeRegex4, "gis"),
    // (three min past) (five thirty|seven|7|7:00(:00)?) (pm)?
    recognizers_text_1.RegExpUtility.getSafeRegExp(englishDateTime_1.EnglishDateTime.TimeRegex5, "gis"),
    // (five thirty|seven|7|7:00(:00)?) (pm)? (in the night)
    recognizers_text_1.RegExpUtility.getSafeRegExp(englishDateTime_1.EnglishDateTime.TimeRegex6, "gis"),
    // (in the night) at (five thirty|seven|7|7:00(:00)?) (pm)?
    recognizers_text_1.RegExpUtility.getSafeRegExp(englishDateTime_1.EnglishDateTime.TimeRegex7, "gis"),
    // (in the night) (five thirty|seven|7|7:00(:00)?) (pm)?
    recognizers_text_1.RegExpUtility.getSafeRegExp(englishDateTime_1.EnglishDateTime.TimeRegex8, "gis"),
    recognizers_text_1.RegExpUtility.getSafeRegExp(englishDateTime_1.EnglishDateTime.TimeRegex9, "gis"),
    // 340pm
    recognizers_text_1.RegExpUtility.getSafeRegExp(englishDateTime_1.EnglishDateTime.ConnectNumRegex, "gis")
];
EnglishTimeExtractorConfiguration.atRegex = recognizers_text_1.RegExpUtility.getSafeRegExp(englishDateTime_1.EnglishDateTime.AtRegex, "gis");
EnglishTimeExtractorConfiguration.lessThanOneHour = recognizers_text_1.RegExpUtility.getSafeRegExp(englishDateTime_1.EnglishDateTime.LessThanOneHour, "gis");
EnglishTimeExtractorConfiguration.timeSuffix = recognizers_text_1.RegExpUtility.getSafeRegExp(englishDateTime_1.EnglishDateTime.TimeSuffix, "gis");
EnglishTimeExtractorConfiguration.timeSuffixFull = recognizers_text_1.RegExpUtility.getSafeRegExp(englishDateTime_1.EnglishDateTime.TimeSuffixFull, "gis");
EnglishTimeExtractorConfiguration.ishRegex = recognizers_text_1.RegExpUtility.getSafeRegExp(englishDateTime_1.EnglishDateTime.IshRegex, "gis");
exports.EnglishTimeExtractorConfiguration = EnglishTimeExtractorConfiguration;
class EnglishTimeParserConfiguration {
    constructor(config) {
        this.timeTokenPrefix = englishDateTime_1.EnglishDateTime.TimeTokenPrefix;
        this.atRegex = EnglishTimeExtractorConfiguration.atRegex;
        this.timeRegexes = EnglishTimeExtractorConfiguration.timeRegexList;
        this.numbers = config.numbers;
        this.lunchRegex = recognizers_text_1.RegExpUtility.getSafeRegExp(englishDateTime_1.EnglishDateTime.LunchRegex);
        this.timeSuffixFull = recognizers_text_1.RegExpUtility.getSafeRegExp(englishDateTime_1.EnglishDateTime.TimeSuffixFull);
        this.nightRegex = recognizers_text_1.RegExpUtility.getSafeRegExp(englishDateTime_1.EnglishDateTime.NightRegex);
        this.utilityConfiguration = config.utilityConfiguration;
    }
    adjustByPrefix(prefix, adjust) {
        let deltaMin = 0;
        let trimmedPrefix = prefix.trim().toLowerCase();
        if (trimmedPrefix.startsWith("half")) {
            deltaMin = 30;
        }
        else if (trimmedPrefix.startsWith("a quarter") || trimmedPrefix.startsWith("quarter")) {
            deltaMin = 15;
        }
        else if (trimmedPrefix.startsWith("three quarter")) {
            deltaMin = 45;
        }
        else {
            let match = recognizers_text_1.RegExpUtility.getMatches(EnglishTimeExtractorConfiguration.lessThanOneHour, trimmedPrefix);
            let minStr = match[0].groups("deltamin").value;
            if (minStr) {
                deltaMin = Number.parseInt(minStr, 10);
            }
            else {
                minStr = match[0].groups("deltaminnum").value.toLowerCase();
                deltaMin = this.numbers.get(minStr);
            }
        }
        if (trimmedPrefix.endsWith("to")) {
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
        let trimmedSuffix = suffix.trim().toLowerCase();
        let deltaHour = 0;
        let matches = recognizers_text_1.RegExpUtility.getMatches(EnglishTimeExtractorConfiguration.timeSuffixFull, trimmedSuffix);
        if (matches.length > 0 && matches[0].index === 0 && matches[0].length === trimmedSuffix.length) {
            let oclockStr = matches[0].groups("oclock").value;
            if (!oclockStr) {
                let amStr = matches[0].groups("am").value;
                if (amStr) {
                    if (adjust.hour >= 12) {
                        deltaHour = -12;
                    }
                    else {
                        adjust.hasAm = true;
                    }
                }
                let pmStr = matches[0].groups("pm").value;
                if (pmStr) {
                    if (adjust.hour < 12) {
                        deltaHour = 12;
                    }
                    if (recognizers_text_1.RegExpUtility.getMatches(this.lunchRegex, pmStr).length > 0) {
                        // for hour>=10, <12
                        if (adjust.hour >= 10 && adjust.hour <= 12) {
                            deltaHour = 0;
                            if (adjust.hour === 12) {
                                adjust.hasPm = true;
                            }
                            else {
                                adjust.hasAm = true;
                            }
                        }
                        else {
                            adjust.hasPm = true;
                        }
                    }
                    else if (recognizers_text_1.RegExpUtility.getMatches(this.nightRegex, pmStr).length > 0) {
                        // for hour <=3 or == 12, we treat it as am, for example 1 in the night (midnight) == 1am
                        if (adjust.hour <= 3 || adjust.hour === 12) {
                            if (adjust.hour === 12) {
                                adjust.hour = 0;
                            }
                            deltaHour = 0;
                            adjust.hasAm = true;
                        }
                        else {
                            adjust.hasPm = true;
                        }
                    }
                    else {
                        adjust.hasPm = true;
                    }
                }
            }
        }
        adjust.hour = (adjust.hour + deltaHour) % 24;
    }
}
exports.EnglishTimeParserConfiguration = EnglishTimeParserConfiguration;
//# sourceMappingURL=timeConfiguration.js.map