export declare namespace EnglishNumericWithUnit {
    const AgeSuffixList: ReadonlyMap<string, string>;
    const AreaSuffixList: ReadonlyMap<string, string>;
    const CurrencySuffixList: ReadonlyMap<string, string>;
    const CurrencyPrefixList: ReadonlyMap<string, string>;
    const AmbiguousCurrencyUnitList: string[];
    const InformationSuffixList: ReadonlyMap<string, string>;
    const AmbiguousDimensionUnitList: string[];
    const BuildPrefix = "(?<=(\\s|^|\\W))";
    const BuildSuffix = "(?=(\\s|\\W|$))";
    const LenghtSuffixList: ReadonlyMap<string, string>;
    const AmbiguousLengthUnitList: string[];
    const SpeedSuffixList: ReadonlyMap<string, string>;
    const TemperatureSuffixList: ReadonlyMap<string, string>;
    const AmbiguousTemperatureUnitList: string[];
    const VolumeSuffixList: ReadonlyMap<string, string>;
    const AmbiguousVolumeUnitList: string[];
    const WeightSuffixList: ReadonlyMap<string, string>;
    const AmbiguousWeightUnitList: string[];
}
