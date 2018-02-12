"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const recognizers_text_1 = require("recognizers-text");
const baseSet_1 = require("../baseSet");
const parsers_1 = require("../parsers");
const constants_1 = require("../constants");
const durationConfiguration_1 = require("./durationConfiguration");
const timeConfiguration_1 = require("./timeConfiguration");
const dateConfiguration_1 = require("./dateConfiguration");
const dateTimeConfiguration_1 = require("./dateTimeConfiguration");
const utilities_1 = require("../utilities");
const chineseDateTime_1 = require("../../resources/chineseDateTime");
class ChineseSetExtractorConfiguration {
    constructor() {
        this.eachUnitRegex = recognizers_text_1.RegExpUtility.getSafeRegExp(chineseDateTime_1.ChineseDateTime.SetEachUnitRegex);
        this.durationExtractor = new durationConfiguration_1.ChineseDurationExtractor();
        this.lastRegex = recognizers_text_1.RegExpUtility.getSafeRegExp(chineseDateTime_1.ChineseDateTime.SetLastRegex);
        this.eachPrefixRegex = recognizers_text_1.RegExpUtility.getSafeRegExp(chineseDateTime_1.ChineseDateTime.SetEachPrefixRegex);
        this.timeExtractor = new timeConfiguration_1.ChineseTimeExtractor();
        this.beforeEachDayRegex = recognizers_text_1.RegExpUtility.getSafeRegExp(chineseDateTime_1.ChineseDateTime.SetEachDayRegex);
        this.eachDayRegex = recognizers_text_1.RegExpUtility.getSafeRegExp(chineseDateTime_1.ChineseDateTime.SetEachDayRegex);
        this.dateExtractor = new dateConfiguration_1.ChineseDateExtractor();
        this.dateTimeExtractor = new dateTimeConfiguration_1.ChineseDateTimeExtractor();
    }
}
class ChineseSetExtractor extends baseSet_1.BaseSetExtractor {
    constructor() {
        super(new ChineseSetExtractorConfiguration());
    }
    extract(source, refDate) {
        if (!refDate)
            refDate = new Date();
        let referenceDate = refDate;
        let tokens = new Array()
            .concat(super.matchEachUnit(source))
            .concat(super.matchEachDuration(source, referenceDate))
            .concat(this.matchEachSpecific(this.config.timeExtractor, this.config.eachDayRegex, source, referenceDate))
            .concat(this.matchEachSpecific(this.config.dateExtractor, this.config.eachPrefixRegex, source, referenceDate))
            .concat(this.matchEachSpecific(this.config.dateTimeExtractor, this.config.eachPrefixRegex, source, referenceDate));
        let result = utilities_1.Token.mergeAllTokens(tokens, source, this.extractorName);
        return result;
    }
    matchEachSpecific(extractor, eachRegex, source, refDate) {
        let ret = [];
        extractor.extract(source, refDate).forEach(er => {
            let beforeStr = source.substr(0, er.start);
            let beforeMatch = recognizers_text_1.RegExpUtility.getMatches(eachRegex, beforeStr).pop();
            if (beforeMatch) {
                ret.push(new utilities_1.Token(beforeMatch.index, er.start + er.length));
            }
        });
        return ret;
    }
}
exports.ChineseSetExtractor = ChineseSetExtractor;
class ChineseSetParserConfiguration {
    constructor() {
        this.dateExtractor = new dateConfiguration_1.ChineseDateExtractor();
        this.timeExtractor = new timeConfiguration_1.ChineseTimeExtractor();
        this.durationExtractor = new durationConfiguration_1.ChineseDurationExtractor();
        this.dateTimeExtractor = new dateTimeConfiguration_1.ChineseDateTimeExtractor();
        this.dateParser = new dateConfiguration_1.ChineseDateParser();
        this.timeParser = new timeConfiguration_1.ChineseTimeParser();
        this.durationParser = new durationConfiguration_1.ChineseDurationParser();
        this.dateTimeParser = new dateTimeConfiguration_1.ChineseDateTimeParser();
        this.unitMap = chineseDateTime_1.ChineseDateTime.ParserConfigurationUnitMap;
        this.eachUnitRegex = recognizers_text_1.RegExpUtility.getSafeRegExp(chineseDateTime_1.ChineseDateTime.SetEachUnitRegex);
        this.eachDayRegex = recognizers_text_1.RegExpUtility.getSafeRegExp(chineseDateTime_1.ChineseDateTime.SetEachDayRegex);
        this.eachPrefixRegex = recognizers_text_1.RegExpUtility.getSafeRegExp(chineseDateTime_1.ChineseDateTime.SetEachPrefixRegex);
    }
    getMatchedDailyTimex(text) {
        return null;
    }
    getMatchedUnitTimex(source) {
        let timex = '';
        if (source === '天' || source === '日')
            timex = 'P1D';
        else if (source === '周' || source === '星期')
            timex = 'P1W';
        else if (source === '月')
            timex = 'P1M';
        else if (source === '年')
            timex = 'P1Y';
        return { matched: timex !== '', timex: timex };
    }
}
class ChineseSetParser extends baseSet_1.BaseSetParser {
    constructor() {
        let config = new ChineseSetParserConfiguration();
        super(config);
    }
    parse(er, referenceDate) {
        if (!referenceDate)
            referenceDate = new Date();
        let value = null;
        if (er.type === baseSet_1.BaseSetParser.ParserName) {
            let innerResult = this.parseEachUnit(er.text);
            if (!innerResult.success) {
                innerResult = this.parseEachDuration(er.text, referenceDate);
            }
            if (!innerResult.success) {
                innerResult = this.parserTimeEveryday(er.text, referenceDate);
            }
            if (!innerResult.success) {
                innerResult = this.parseEach(this.config.dateTimeExtractor, this.config.dateTimeParser, er.text, referenceDate);
            }
            if (!innerResult.success) {
                innerResult = this.parseEach(this.config.dateExtractor, this.config.dateParser, er.text, referenceDate);
            }
            if (innerResult.success) {
                innerResult.futureResolution = {};
                innerResult.futureResolution[constants_1.TimeTypeConstants.SET] = innerResult.futureValue;
                innerResult.pastResolution = {};
                innerResult.pastResolution[constants_1.TimeTypeConstants.SET] = innerResult.pastValue;
                value = innerResult;
            }
        }
        let ret = new parsers_1.DateTimeParseResult(er);
        ret.value = value,
            ret.timexStr = value === null ? "" : value.timex,
            ret.resolutionStr = "";
        return ret;
    }
    parseEachUnit(text) {
        let ret = new utilities_1.DateTimeResolutionResult();
        // handle "each month"
        let match = recognizers_text_1.RegExpUtility.getMatches(this.config.eachUnitRegex, text).pop();
        if (!match || match.length !== text.length)
            return ret;
        let sourceUnit = match.groups("unit").value;
        if (recognizers_text_1.StringUtility.isNullOrEmpty(sourceUnit) || !this.config.unitMap.has(sourceUnit))
            return ret;
        let getMatchedUnitTimex = this.config.getMatchedUnitTimex(sourceUnit);
        if (!getMatchedUnitTimex.matched)
            return ret;
        ret.timex = getMatchedUnitTimex.timex;
        ret.futureValue = "Set: " + ret.timex;
        ret.pastValue = "Set: " + ret.timex;
        ret.success = true;
        return ret;
    }
    parserTimeEveryday(text, refDate) {
        let result = new utilities_1.DateTimeResolutionResult();
        let ers = this.config.timeExtractor.extract(text, refDate);
        if (ers.length !== 1)
            return result;
        let er = ers[0];
        let beforeStr = text.substr(0, er.start);
        let match = recognizers_text_1.RegExpUtility.getMatches(this.config.eachDayRegex, beforeStr).pop();
        if (!match)
            return result;
        let pr = this.config.timeParser.parse(er);
        result.timex = pr.timexStr;
        result.futureValue = "Set: " + result.timex;
        result.pastValue = "Set: " + result.timex;
        result.success = true;
        return result;
    }
    parseEach(extractor, parser, text, refDate) {
        let result = new utilities_1.DateTimeResolutionResult();
        let ers = extractor.extract(text, refDate);
        if (ers.length !== 1)
            return result;
        let er = ers[0];
        let beforeStr = text.substr(0, er.start);
        let match = recognizers_text_1.RegExpUtility.getMatches(this.config.eachPrefixRegex, beforeStr).pop();
        if (!match)
            return result;
        let timex = parser.parse(er).timexStr;
        result.timex = timex;
        result.futureValue = `Set: ${timex}`;
        result.pastValue = `Set: ${timex}`;
        result.success = true;
        return result;
    }
}
exports.ChineseSetParser = ChineseSetParser;
//# sourceMappingURL=setConfiguration.js.map