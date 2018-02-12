export declare namespace BaseNumbers {
    const NumberReplaceToken = "@builtin.num";
    const IntegerRegexDefinition: (placeholder: string, thousandsmark: string) => string;
    const DoubleRegexDefinition: (placeholder: string, thousandsmark: string, decimalmark: string) => string;
    const PlaceHolderDefault = "\\\\D|\\\\b";
}
