"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const recognizers_text_1 = require("recognizers-text");
const recognizers_text_number_1 = require("recognizers-text-number");
const models_1 = require("./models");
const baseMerged_1 = require("./baseMerged");
const baseConfiguration_1 = require("./english/baseConfiguration");
const mergedConfiguration_1 = require("./english/mergedConfiguration");
const mergedConfiguration_2 = require("./spanish/mergedConfiguration");
const mergedConfiguration_3 = require("./french/mergedConfiguration");
const mergedConfiguration_4 = require("./chinese/mergedConfiguration");
var DateTimeOptions;
(function (DateTimeOptions) {
    DateTimeOptions[DateTimeOptions["None"] = 0] = "None";
    DateTimeOptions[DateTimeOptions["SkipFromToMerge"] = 1] = "SkipFromToMerge";
    DateTimeOptions[DateTimeOptions["SplitDateAndTime"] = 2] = "SplitDateAndTime";
    DateTimeOptions[DateTimeOptions["Calendar"] = 4] = "Calendar";
})(DateTimeOptions = exports.DateTimeOptions || (exports.DateTimeOptions = {}));
class DateTimeRecognizer extends recognizers_text_1.Recognizer {
    constructor(options) {
        super();
        // English models
        this.registerModel("DateTimeModel", recognizers_text_number_1.Culture.English, new models_1.DateTimeModel(new baseMerged_1.BaseMergedParser(new mergedConfiguration_1.EnglishMergedParserConfiguration(new baseConfiguration_1.EnglishCommonDateTimeParserConfiguration()), options), new baseMerged_1.BaseMergedExtractor(new mergedConfiguration_1.EnglishMergedExtractorConfiguration(), options)));
        // Spanish models
        this.registerModel("DateTimeModel", recognizers_text_number_1.Culture.Spanish, new models_1.DateTimeModel(new baseMerged_1.BaseMergedParser(new mergedConfiguration_2.SpanishMergedParserConfiguration(), options), new baseMerged_1.BaseMergedExtractor(new mergedConfiguration_2.SpanishMergedExtractorConfiguration(), options)));
        // Chinese models
        this.registerModel("DateTimeModel", recognizers_text_number_1.Culture.Chinese, new models_1.DateTimeModel(new mergedConfiguration_4.ChineseFullMergedParser(), new mergedConfiguration_4.ChineseMergedExtractor(options)));
        // French models
        this.registerModel("DateTimeModel", recognizers_text_number_1.Culture.French, new models_1.DateTimeModel(new baseMerged_1.BaseMergedParser(new mergedConfiguration_3.FrenchMergedParserConfiguration(), options), new baseMerged_1.BaseMergedExtractor(new mergedConfiguration_3.FrenchMergedExtractorConfiguration(), options)));
    }
    getDateTimeModel(culture = "", fallbackToDefaultCulture = true) {
        return this.getModel("DateTimeModel", culture, fallbackToDefaultCulture);
    }
    static getSingleCultureInstance(cultureCode, options = DateTimeOptions.None) {
        return new DateTimeRecognizer(options);
    }
}
DateTimeRecognizer.instance = new DateTimeRecognizer(DateTimeOptions.None);
exports.default = DateTimeRecognizer;
//# sourceMappingURL=dateTimeRecognizer.js.map