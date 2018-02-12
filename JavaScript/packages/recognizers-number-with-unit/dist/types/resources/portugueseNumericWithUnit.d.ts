export declare namespace PortugueseNumericWithUnit {
    const AgeSuffixList: ReadonlyMap<string, string>;
    const AreaSuffixList: ReadonlyMap<string, string>;
    const CurrencySuffixList: ReadonlyMap<string, string>;
    const CurrencyPrefixList: ReadonlyMap<string, string>;
    const AmbiguousCurrencyUnitList: string[];
    const InformationSuffixList: ReadonlyMap<string, string>;
    const AmbiguousDimensionUnitList: string[];
    const BuildPrefix = "(?<=(\\s|^|\\P{L}))";
    const BuildSuffix = "(?=(\\s|\\P{L}|$))";
    const ConnectorToken = "de";
    const LenghtSuffixList: ReadonlyMap<string, string>;
    const AmbiguousLengthUnitList: string[];
    const SpeedSuffixList: ReadonlyMap<string, string>;
    const AmbiguousSpeedUnitList: string[];
    const TemperatureSuffixList: ReadonlyMap<string, string>;
    const VolumeSuffixList: ReadonlyMap<string, string>;
    const WeightSuffixList: ReadonlyMap<string, string>;
}