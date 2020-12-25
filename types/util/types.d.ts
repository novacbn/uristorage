export declare type IJSONReplacer = (this: any, key: string, value: any) => any;
export declare type IJSONReviver = (this: any, key: string, value: any) => any;
export declare type IJSONArray = IJSONValue[];
export declare type IJSONObject = {
    [key: string]: IJSONValue;
};
export declare type IJSONValue = boolean | null | number | object | string | undefined | IJSONArray | IJSONObject;
