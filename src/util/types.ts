export type IJSONReplacer = (this: any, key: string, value: any) => any;

export type IJSONReviver = (this: any, key: string, value: any) => any;

export type IJSONArray = IJSONValue[];

export type IJSONObject = {[key: string]: IJSONValue};

export type IJSONValue = boolean | number | string | undefined | IJSONArray | IJSONObject;
