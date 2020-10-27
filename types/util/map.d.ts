export declare class ImmutableMap<T> extends Map<string, T> {
    clone: (value: T) => T;
    entries(): IterableIterator<[string, T]>;
    forEach(callback: (value: T, key: string, map: Map<string, T>) => void, thisArg?: any): void;
    get(key: string): T | undefined;
    set(key: string, value: T): this;
    values(): IterableIterator<T>;
}
