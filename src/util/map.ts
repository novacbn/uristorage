export class ImmutableMap<T> extends Map<string, T> {
    clone = (value: T): T => {
        throw new Error("bad dispatch to 'clone' (not implemented)");
    };

    entries(): IterableIterator<[string, T]> {
        const {clone} = this;

        let entries = Array.from(super.entries());
        entries = entries.map(([key, value], index) => [key, clone(value)]);

        return entries[Symbol.iterator]();
    }

    forEach(callback: (value: T, key: string, map: Map<string, T>) => void, thisArg?: any): void {
        for (const entry of this) {
            const [key, value] = entry;

            callback.call(thisArg, this.clone(value), key, this);
        }
    }

    get(key: string): T | undefined {
        const value = super.get(key);

        if (value !== undefined) return this.clone(value);
    }

    set(key: string, value: T): this {
        value = this.clone(value);

        super.set(key, value);
        return this;
    }

    values(): IterableIterator<T> {
        let values = Array.from(super.values());
        values = values.map((value, index) => this.clone(value));

        return values[Symbol.iterator]();
    }
}
