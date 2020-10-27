export type IJSONReplacer = (this: any, key: string, value: any) => any;

export type IJSONReviver = (this: any, key: string, value: any) => any;

export type IJSONTypes = boolean | number | string | IJSONTypes[] | {[key: string]: IJSONTypes};
