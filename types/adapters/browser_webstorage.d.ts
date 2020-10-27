import { NODE_TYPES } from "../util/constants";
import { IBaseAdapterOptions, INode, IQueryOptions, IQueryResult, BaseAdapter } from "./base_adapter";
export interface IWebStorageOptions extends IBaseAdapterOptions {
    compressed: boolean;
}
declare class WebStorageAdapter extends BaseAdapter {
    static storage: Storage | null;
    prefix: string;
    options: IWebStorageOptions;
    source: Storage;
    constructor(options?: Partial<IWebStorageOptions>);
    normalize(path: string): string;
    deserialize(item: string): INode;
    paths(): {
        key: string;
        path: string;
    }[];
    serialize(buffer?: Uint8Array, type?: NODE_TYPES): string;
    get(path: string): Promise<INode | null>;
    put(path: string, buffer?: Uint8Array, type?: NODE_TYPES): Promise<void>;
    query(options?: IQueryOptions): Promise<IQueryResult[]>;
    is_mounted(): boolean;
    mount(): Promise<void>;
    unmount(): Promise<void>;
}
export declare class LocalStorageAdapter extends WebStorageAdapter {
    static is_available: boolean;
    static storage: Storage | null;
}
export declare class SessionStorageAdapter extends WebStorageAdapter {
    static is_available: boolean;
    static storage: Storage | null;
}
export {};
