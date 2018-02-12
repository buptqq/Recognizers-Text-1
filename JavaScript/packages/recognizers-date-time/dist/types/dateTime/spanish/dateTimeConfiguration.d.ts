import { IDateTimeExtractorConfiguration, IDateTimeParserConfiguration, IDateTimeExtractor } from "../baseDateTime";
import { BaseNumberExtractor, BaseNumberParser } from "recognizers-text-number";
import { BaseDateParser } from "../baseDate";
import { BaseTimeParser } from "../baseTime";
import { BaseDurationParser } from "../baseDuration";
import { IDateTimeUtilityConfiguration } from "../utilities";
import { ICommonDateTimeParserConfiguration } from "../parsers";
export declare class SpanishDateTimeExtractorConfiguration implements IDateTimeExtractorConfiguration {
    readonly datePointExtractor: IDateTimeExtractor;
    readonly timePointExtractor: IDateTimeExtractor;
    readonly durationExtractor: IDateTimeExtractor;
    readonly suffixRegex: RegExp;
    readonly nowRegex: RegExp;
    readonly timeOfTodayAfterRegex: RegExp;
    readonly timeOfDayRegex: RegExp;
    readonly specificTimeOfDayRegex: RegExp;
    readonly simpleTimeOfTodayAfterRegex: RegExp;
    readonly nightRegex: RegExp;
    readonly timeOfTodayBeforeRegex: RegExp;
    readonly simpleTimeOfTodayBeforeRegex: RegExp;
    readonly theEndOfRegex: RegExp;
    readonly unitRegex: RegExp;
    readonly utilityConfiguration: IDateTimeUtilityConfiguration;
    readonly prepositionRegex: RegExp;
    readonly connectorRegex: RegExp;
    constructor();
    isConnectorToken(source: string): boolean;
}
export declare class SpanishDateTimeParserConfiguration implements IDateTimeParserConfiguration {
    readonly tokenBeforeDate: string;
    readonly tokenBeforeTime: string;
    readonly dateExtractor: IDateTimeExtractor;
    readonly timeExtractor: IDateTimeExtractor;
    readonly dateParser: BaseDateParser;
    readonly timeParser: BaseTimeParser;
    readonly cardinalExtractor: BaseNumberExtractor;
    readonly numberParser: BaseNumberParser;
    readonly durationExtractor: IDateTimeExtractor;
    readonly durationParser: BaseDurationParser;
    readonly nowRegex: RegExp;
    readonly amTimeRegex: RegExp;
    readonly pmTimeRegex: RegExp;
    readonly simpleTimeOfTodayAfterRegex: RegExp;
    readonly simpleTimeOfTodayBeforeRegex: RegExp;
    readonly specificTimeOfDayRegex: RegExp;
    readonly theEndOfRegex: RegExp;
    readonly unitRegex: RegExp;
    readonly unitMap: ReadonlyMap<string, string>;
    readonly numbers: ReadonlyMap<string, number>;
    readonly utilityConfiguration: IDateTimeUtilityConfiguration;
    readonly nextPrefixRegex: RegExp;
    readonly pastPrefixRegex: RegExp;
    constructor(config: ICommonDateTimeParserConfiguration);
    haveAmbiguousToken(text: string, matchedText: string): boolean;
    getMatchedNowTimex(text: string): {
        matched: boolean;
        timex: string;
    };
    getSwiftDay(text: string): number;
    getHour(text: string, hour: number): number;
}