export declare type IJSONReplacer = (this: any, key: string, value: any) => any;
export declare type IJSONReviver = (this: any, key: string, value: any) => any;
export declare type IJSONTypes = boolean | number | string | IJSONTypes[] | {
    [key: string]: IJSONTypes;
};
