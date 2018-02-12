import { ITimePeriodExtractorConfiguration, ITimePeriodParserConfiguration } from "../baseTimePeriod";
import { BaseTimeParser } from "../baseTime";
import { ICommonDateTimeParserConfiguration } from "../parsers";
import { IDateTimeUtilityConfiguration } from "../utilities";
import { IDateTimeExtractor } from "../baseDateTime";
export declare class EnglishTimePeriodExtractorConfiguration implements ITimePeriodExtractorConfiguration {
    readonly simpleCasesRegex: RegExp[];
    readonly tillRegex: RegExp;
    readonly timeOfDayRegex: RegExp;
    readonly singleTimeExtractor: IDateTimeExtractor;
    constructor();
    getFromTokenIndex(source: string): {
        matched: boolean;
        index: number;
    };
    getBetweenTokenIndex(source: string): {
        matched: boolean;
        index: number;
    };
    hasConnectorToken(source: string): boolean;
}
export declare class EnglishTimePeriodParserConfiguration implements ITimePeriodParserConfiguration {
    timeExtractor: IDateTimeExtractor;
    timeParser: BaseTimeParser;
    pureNumberFromToRegex: RegExp;
    pureNumberBetweenAndRegex: RegExp;
    timeOfDayRegex: RegExp;
    numbers: ReadonlyMap<string, number>;
    utilityConfiguration: IDateTimeUtilityConfiguration;
    constructor(config: ICommonDateTimeParserConfiguration);
    getMatchedTimexRange(text: string): {
        matched: boolean;
        timex: string;
        beginHour: number;
        endHour: number;
        endMin: number;
    };
}
