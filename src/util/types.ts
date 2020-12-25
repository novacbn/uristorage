export type IJSONReplacer = (this: any, key: string, value: any) => any;

export type IJSONReviver = (this: any, key: string, value: any) => any;

export type IJSONArray = IJSONValue[];

export type IJSONObject = {[key: string]: IJSONValue};

export type IJSONValue =
    | boolean
    | null
    | number
    | object
    | string
    | undefined
    | IJSONArray
    | IJSONObject;
