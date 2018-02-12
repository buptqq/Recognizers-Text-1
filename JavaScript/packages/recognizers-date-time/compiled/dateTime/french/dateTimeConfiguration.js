"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const recognizers_text_1 = require("recognizers-text");
const baseDate_1 = require("../baseDate");
const baseTime_1 = require("../baseTime");
const baseDuration_1 = require("../baseDuration");
const dateConfiguration_1 = require("./dateConfiguration");
const durationConfiguration_1 = require("./durationConfiguration");
const baseConfiguration_1 = require("./baseConfiguration");
const frenchDateTime_1 = require("../../resources/frenchDateTime");
const timeConfiguration_1 = require("./timeConfiguration");
class FrenchDateTimeExtractorConfiguration {
    constructor() {
        this.prepositionRegex = recognizers_text_1.RegExpUtility.getSafeRegExp(frenchDateTime_1.FrenchDateTime.PrepositionRegex, "gis");
        this.nowRegex = recognizers_text_1.RegExpUtility.getSafeRegExp(frenchDateTime_1.FrenchDateTime.NowRegex, "gis");
        this.suffixRegex = recognizers_text_1.RegExpUtility.getSafeRegExp(frenchDateTime_1.FrenchDateTime.SuffixRegex, "gis");
        this.timeOfDayRegex = recognizers_text_1.RegExpUtility.getSafeRegExp(frenchDateTime_1.FrenchDateTime.TimeOfDayRegex, "gis");
        this.specificTimeOfDayRegex = recognizers_text_1.RegExpUtility.getSafeRegExp(frenchDateTime_1.FrenchDateTime.SpecificTimeOfDayRegex, "gis");
        this.timeOfTodayAfterRegex = recognizers_text_1.RegExpUtility.getSafeRegExp(frenchDateTime_1.FrenchDateTime.TimeOfTodayAfterRegex, "gis");
        this.timeOfTodayBeforeRegex = recognizers_text_1.RegExpUtility.getSafeRegExp(frenchDateTime_1.FrenchDateTime.TimeOfTodayBeforeRegex, "gis");
        this.simpleTimeOfTodayAfterRegex = recognizers_text_1.RegExpUtility.getSafeRegExp(frenchDateTime_1.FrenchDateTime.SimpleTimeOfTodayAfterRegex, "gis");
        this.simpleTimeOfTodayBeforeRegex = recognizers_text_1.RegExpUtility.getSafeRegExp(frenchDateTime_1.FrenchDateTime.SimpleTimeOfTodayBeforeRegex, "gis");
        this.theEndOfRegex = recognizers_text_1.RegExpUtility.getSafeRegExp(frenchDateTime_1.FrenchDateTime.TheEndOfRegex, "gis");
        this.unitRegex = recognizers_text_1.RegExpUtility.getSafeRegExp(frenchDateTime_1.FrenchDateTime.TimeUnitRegex, "gis");
        this.connectorRegex = recognizers_text_1.RegExpUtility.getSafeRegExp(frenchDateTime_1.FrenchDateTime.ConnectorRegex, "gis");
        this.nightRegex = recognizers_text_1.RegExpUtility.getSafeRegExp(frenchDateTime_1.FrenchDateTime.NightRegex, "gis");
        this.datePointExtractor = new baseDate_1.BaseDateExtractor(new dateConfiguration_1.FrenchDateExtractorConfiguration());
        this.timePointExtractor = new baseTime_1.BaseTimeExtractor(new timeConfiguration_1.FrenchTimeExtractorConfiguration());
        this.durationExtractor = new baseDuration_1.BaseDurationExtractor(new durationConfiguration_1.FrenchDurationExtractorConfiguration());
        this.utilityConfiguration = new baseConfiguration_1.FrenchDateTimeUtilityConfiguration();
    }
    isConnectorToken(source) {
        return (source === "" || source === "," ||
            recognizers_text_1.RegExpUtility.getFirstMatchIndex(this.prepositionRegex, source).matched ||
            source === "t" ||
            source === "pour" ||
            source === "vers");
    }
}
exports.FrenchDateTimeExtractorConfiguration = FrenchDateTimeExtractorConfiguration;
class FrenchDateTimeParserConfiguration {
    constructor(config) {
        this.tokenBeforeDate = frenchDateTime_1.FrenchDateTime.TokenBeforeDate;
        this.tokenBeforeTime = frenchDateTime_1.FrenchDateTime.TokenBeforeTime;
        this.nowRegex = recognizers_text_1.RegExpUtility.getSafeRegExp(frenchDateTime_1.FrenchDateTime.NowRegex, "gis");
        this.amTimeRegex = recognizers_text_1.RegExpUtility.getSafeRegExp(frenchDateTime_1.FrenchDateTime.AMTimeRegex, "gis");
        this.pmTimeRegex = recognizers_text_1.RegExpUtility.getSafeRegExp(frenchDateTime_1.FrenchDateTime.PMTimeRegex, "gis");
        this.simpleTimeOfTodayAfterRegex = recognizers_text_1.RegExpUtility.getSafeRegExp(frenchDateTime_1.FrenchDateTime.SimpleTimeOfTodayAfterRegex, "gis");
        this.simpleTimeOfTodayBeforeRegex = recognizers_text_1.RegExpUtility.getSafeRegExp(frenchDateTime_1.FrenchDateTime.SimpleTimeOfTodayBeforeRegex, "gis");
        this.specificTimeOfDayRegex = recognizers_text_1.RegExpUtility.getSafeRegExp(frenchDateTime_1.FrenchDateTime.SpecificTimeOfDayRegex, "gis");
        this.theEndOfRegex = recognizers_text_1.RegExpUtility.getSafeRegExp(frenchDateTime_1.FrenchDateTime.TheEndOfRegex, "gis");
        this.unitRegex = recognizers_text_1.RegExpUtility.getSafeRegExp(frenchDateTime_1.FrenchDateTime.TimeUnitRegex, "gis");
        this.dateExtractor = config.dateExtractor;
        this.timeExtractor = config.timeExtractor;
        this.dateParser = config.dateParser;
        this.timeParser = config.timeParser;
        this.numbers = config.numbers;
        this.cardinalExtractor = config.cardinalExtractor;
        this.numberParser = config.numberParser;
        this.durationExtractor = config.durationExtractor;
        this.durationParser = config.durationParser;
        this.unitMap = config.unitMap;
        this.utilityConfiguration = config.utilityConfiguration;
    }
    haveAmbiguousToken(text, matchedText) {
        return false;
    }
    getMatchedNowTimex(text) {
        let trimedText = text.trim().toLowerCase();
        let timex = "";
        if (trimedText.endsWith("maintenant")) {
            timex = "PRESENT_REF";
        }
        else if (trimedText === "récemment" ||
            trimedText === "précédemment" ||
            trimedText === "auparavant") {
            timex = "PAST_REF";
        }
        else if (trimedText === "dès que possible" ||
            trimedText === "dqp") {
            timex = "FUTURE_REF";
        }
        else {
            return {
                matched: false,
                timex: null
            };
        }
        return {
            matched: true,
            timex: timex
        };
    }
    getSwiftDay(text) {
        let trimedText = text.trim().toLowerCase();
        let swift = 0;
        if (trimedText.startsWith("prochain") ||
            trimedText.endsWith("prochain") ||
            trimedText.startsWith("prochaine") ||
            trimedText.endsWith("prochaine")) {
            swift = 1;
        }
        else if (trimedText.startsWith("dernier") ||
            trimedText.startsWith("dernière") ||
            trimedText.endsWith("dernier") ||
            trimedText.endsWith("dernière")) {
            swift = -1;
        }
        return swift;
    }
    getHour(text, hour) {
        let trimedText = text.trim().toLowerCase();
        let result = hour;
        // TODO: Replace with a regex
        if (trimedText.endsWith("matin") && hour >= 12) {
            result -= 12;
        }
        else if (!trimedText.endsWith("matin") && hour < 12) {
            result += 12;
        }
        return result;
    }
}
exports.FrenchDateTimeParserConfiguration = FrenchDateTimeParserConfiguration;
//# sourceMappingURL=dateTimeConfiguration.js.map