export declare class Culture {
    static readonly English: string;
    static readonly Chinese: string;
    static readonly Spanish: string;
    static readonly Portuguese: string;
    static readonly French: string;
    static readonly supportedCultures: Array<Culture>;
    readonly cultureName: string;
    readonly cultureCode: string;
    protected constructor(cultureName: string, cultureCode: string);
    static getSupportedCultureCodes(): Array<string>;
}
export declare class CultureInfo {
    readonly code: string;
    static getCultureInfo(cultureCode: string): CultureInfo;
    constructor(cultureName: string);
}
