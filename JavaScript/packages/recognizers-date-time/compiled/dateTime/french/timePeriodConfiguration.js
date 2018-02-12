"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const recognizers_text_1 = require("recognizers-text");
const baseTime_1 = require("../baseTime");
const timeConfiguration_1 = require("./timeConfiguration");
const baseConfiguration_1 = require("./baseConfiguration");
const frenchDateTime_1 = require("../../resources/frenchDateTime");
class FrenchTimePeriodExtractorConfiguration {
    constructor() {
        this.singleTimeExtractor = new baseTime_1.BaseTimeExtractor(new timeConfiguration_1.FrenchTimeExtractorConfiguration());
        this.utilityConfiguration = new baseConfiguration_1.FrenchDateTimeUtilityConfiguration();
        this.simpleCasesRegex = [
            recognizers_text_1.RegExpUtility.getSafeRegExp(frenchDateTime_1.FrenchDateTime.PureNumFromTo, "gis"),
            recognizers_text_1.RegExpUtility.getSafeRegExp(frenchDateTime_1.FrenchDateTime.PureNumBetweenAnd, "gis"),
            recognizers_text_1.RegExpUtility.getSafeRegExp(frenchDateTime_1.FrenchDateTime.PmRegex, "gis"),
            recognizers_text_1.RegExpUtility.getSafeRegExp(frenchDateTime_1.FrenchDateTime.AmRegex, "gis")
        ];
        this.tillRegex = recognizers_text_1.RegExpUtility.getSafeRegExp(frenchDateTime_1.FrenchDateTime.TillRegex, "gis");
        this.timeOfDayRegex = recognizers_text_1.RegExpUtility.getSafeRegExp(frenchDateTime_1.FrenchDateTime.TimeOfDayRegex, "gis");
        this.fromRegex = recognizers_text_1.RegExpUtility.getSafeRegExp(frenchDateTime_1.FrenchDateTime.FromRegex2, "gis");
        this.connectorAndRegex = recognizers_text_1.RegExpUtility.getSafeRegExp(frenchDateTime_1.FrenchDateTime.ConnectorAndRegex, "gis");
        this.beforeRegex = recognizers_text_1.RegExpUtility.getSafeRegExp(frenchDateTime_1.FrenchDateTime.BeforeRegex2, "gis");
    }
    getFromTokenIndex(text) {
        return recognizers_text_1.RegExpUtility.getFirstMatchIndex(this.fromRegex, text);
    }
    hasConnectorToken(text) {
        return recognizers_text_1.RegExpUtility.getFirstMatchIndex(this.connectorAndRegex, text).matched;
    }
    getBetweenTokenIndex(text) {
        return recognizers_text_1.RegExpUtility.getFirstMatchIndex(this.beforeRegex, text);
    }
}
exports.FrenchTimePeriodExtractorConfiguration = FrenchTimePeriodExtractorConfiguration;
class FrenchTimePeriodParserConfiguration {
    constructor(config) {
        this.timeExtractor = config.timeExtractor;
        this.timeParser = config.timeParser;
        this.numbers = config.numbers;
        this.utilityConfiguration = config.utilityConfiguration;
        this.pureNumberFromToRegex = recognizers_text_1.RegExpUtility.getSafeRegExp(frenchDateTime_1.FrenchDateTime.PureNumFromTo, "gis");
        this.pureNumberBetweenAndRegex = recognizers_text_1.RegExpUtility.getSafeRegExp(frenchDateTime_1.FrenchDateTime.PureNumBetweenAnd, "gis");
        this.timeOfDayRegex = recognizers_text_1.RegExpUtility.getSafeRegExp(frenchDateTime_1.FrenchDateTime.TimeOfDayRegex, "gis");
    }
    getMatchedTimexRange(text) {
        let trimedText = text.trim().toLowerCase();
        if (trimedText.endsWith("s")) {
            trimedText = trimedText.substring(0, trimedText.length - 1);
        }
        let beginHour = 0;
        let endHour = 0;
        let endMin = 0;
        let timex = "";
        if (trimedText.endsWith("matinee") ||
            trimedText.endsWith("matin") ||
            trimedText.endsWith("matinée")) {
            timex = "TMO";
            beginHour = 8;
            endHour = 12;
        }
        else if (trimedText.endsWith("apres-midi") ||
            trimedText.endsWith("apres midi") ||
            trimedText.endsWith("après midi") ||
            trimedText.endsWith("après-midi")) {
            timex = "TAF";
            beginHour = 12;
            endHour = 16;
        }
        else if (trimedText.endsWith("soir") ||
            trimedText.endsWith("soiree") ||
            trimedText.endsWith("soirée")) {
            timex = "TEV";
            beginHour = 16;
            endHour = 20;
        }
        else if (trimedText === "jour" ||
            trimedText.endsWith("journee") ||
            trimedText.endsWith("journée")) {
            timex = "TDT";
            beginHour = 8;
            endHour = 18;
        }
        else if (trimedText.endsWith("nuit")) {
            timex = "TNI";
            beginHour = 20;
            endHour = 23;
            endMin = 59;
        }
        else {
            timex = null;
            return {
                matched: false,
                timex,
                beginHour,
                endHour,
                endMin
            };
        }
        return {
            matched: true,
            timex,
            beginHour,
            endHour,
            endMin
        };
    }
}
exports.FrenchTimePeriodParserConfiguration = FrenchTimePeriodParserConfiguration;
//# sourceMappingURL=timePeriodConfiguration.js.map