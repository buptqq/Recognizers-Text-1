"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const recognizers_text_1 = require("recognizers-text");
const recognizers_text_number_1 = require("recognizers-text-number");
const recognizers_text_number_with_unit_1 = require("recognizers-text-number-with-unit");
const baseDateTime_1 = require("./baseDateTime");
const baseDuration_1 = require("../baseDuration");
const constants_1 = require("../constants");
const chineseDateTime_1 = require("../../resources/chineseDateTime");
const parsers_1 = require("../parsers");
const utilities_1 = require("../utilities");
var DurationType;
(function (DurationType) {
    DurationType[DurationType["WithNumber"] = 0] = "WithNumber";
})(DurationType = exports.DurationType || (exports.DurationType = {}));
class DurationExtractorConfiguration extends recognizers_text_number_with_unit_1.ChineseNumberWithUnitExtractorConfiguration {
    constructor() {
        super(new recognizers_text_number_1.CultureInfo(recognizers_text_number_1.Culture.Chinese));
        this.extractType = constants_1.Constants.SYS_DATETIME_DURATION;
        this.suffixList = chineseDateTime_1.ChineseDateTime.DurationSuffixList;
        this.prefixList = new Map();
        this.ambiguousUnitList = chineseDateTime_1.ChineseDateTime.DurationAmbiguousUnits;
    }
}
class ChineseDurationExtractor extends baseDateTime_1.BaseDateTimeExtractor {
    constructor() {
        super(null);
        this.extractorName = constants_1.Constants.SYS_DATETIME_DURATION; // "Duration";
        this.extractor = new recognizers_text_number_with_unit_1.NumberWithUnitExtractor(new DurationExtractorConfiguration());
        this.yearRegex = recognizers_text_1.RegExpUtility.getSafeRegExp(chineseDateTime_1.ChineseDateTime.DurationYearRegex);
        this.halfSuffixRegex = recognizers_text_1.RegExpUtility.getSafeRegExp(chineseDateTime_1.ChineseDateTime.DurationHalfSuffixRegex);
    }
    extract(source, refDate) {
        if (!refDate)
            refDate = new Date();
        let referenceDate = refDate;
        let results = new Array();
        this.extractor.extract(source).forEach(result => {
            // filter
            if (recognizers_text_1.RegExpUtility.isMatch(this.yearRegex, result.text)) {
                return;
            }
            // match suffix
            let suffix = source.substr(result.start + result.length);
            let suffixMatch = recognizers_text_1.RegExpUtility.getMatches(this.halfSuffixRegex, suffix).pop();
            if (suffixMatch && suffixMatch.index === 0) {
                result.text = result.text + suffixMatch.value;
                result.length += suffixMatch.length;
            }
            results.push(result);
        });
        return results;
    }
}
exports.ChineseDurationExtractor = ChineseDurationExtractor;
class ChineseDurationParserConfiguration {
    constructor() {
        this.unitValueMap = chineseDateTime_1.ChineseDateTime.DurationUnitValueMap;
    }
}
class DurationParserConfiguration extends recognizers_text_number_with_unit_1.ChineseNumberWithUnitParserConfiguration {
    constructor() {
        super(new recognizers_text_number_1.CultureInfo(recognizers_text_number_1.Culture.Chinese));
        this.BindDictionary(chineseDateTime_1.ChineseDateTime.DurationSuffixList);
    }
}
class ChineseDurationParser extends baseDuration_1.BaseDurationParser {
    constructor() {
        let config = new ChineseDurationParserConfiguration();
        super(config);
        this.internalParser = new recognizers_text_number_with_unit_1.NumberWithUnitParser(new DurationParserConfiguration());
    }
    parse(extractorResult, referenceDate) {
        if (!referenceDate)
            referenceDate = new Date();
        let resultValue;
        if (extractorResult.type === this.parserName) {
            let innerResult = new utilities_1.DateTimeResolutionResult();
            let hasHalfSuffix = extractorResult.text.endsWith('半');
            if (hasHalfSuffix) {
                extractorResult.length--;
                extractorResult.text = extractorResult.text.substr(0, extractorResult.length);
            }
            let parserResult = this.internalParser.parse(extractorResult);
            let unitResult = parserResult.value;
            if (!unitResult) {
                return new parsers_1.DateTimeParseResult();
            }
            let unitStr = unitResult.unit;
            let numberStr = unitResult.number;
            if (hasHalfSuffix) {
                numberStr = (Number.parseFloat(numberStr) + 0.5).toString();
            }
            innerResult.timex = `P${this.isLessThanDay(unitStr) ? 'T' : ''}${numberStr}${unitStr.charAt(0)}`;
            innerResult.futureValue = Number.parseFloat(numberStr) * this.config.unitValueMap.get(unitStr);
            innerResult.pastValue = Number.parseFloat(numberStr) * this.config.unitValueMap.get(unitStr);
            innerResult.futureResolution = {};
            innerResult.futureResolution[constants_1.TimeTypeConstants.DURATION] = innerResult.futureValue.toString();
            innerResult.pastResolution = {};
            innerResult.pastResolution[constants_1.TimeTypeConstants.DURATION] = innerResult.pastValue.toString();
            innerResult.success = true;
            resultValue = innerResult;
        }
        let result = new parsers_1.DateTimeParseResult(extractorResult);
        result.value = resultValue;
        result.timexStr = resultValue ? resultValue.timex : '';
        result.resolutionStr = '';
        return result;
    }
}
exports.ChineseDurationParser = ChineseDurationParser;
//# sourceMappingURL=durationConfiguration.js.map