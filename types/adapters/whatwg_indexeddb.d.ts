import Dexie from "dexie";
import "dexie-observable";
import { NODE_TYPES } from "../util/constants";
import { IEvent } from "../util/event";
import { IBaseAdapterOptions, INode, IQueryOptions, IQueryResult, IWatchEvent, IURLObject, IWatchOptions, BaseAdapter } from "./base_adapter";
/**
 * Represents a persisted Node in a `IndexedDBAdapter` Adapter
 *
 * @internal
 */
interface IIndexedDBNode extends INode {
    /**
     * Represents the binary payload currently stored with the Node
     */
    payload?: Uint8Array;
}
/**
 * Represents the `Dexie` implementation used for IndexedDB persistence
 *
 * @internal
 */
declare class IndexedDBStorage extends Dexie {
    EVENT_WATCH: IEvent<IWatchEvent>;
    /**
     * Represents the database table that stores persisted Nodes
     */
    nodes: Dexie.Table<IIndexedDBNode, string>;
    constructor(namespace?: string);
}
/**
 * Represents a URIStorage Adapter that persists all data into the Browser's [IndexedDB](https://developer.mozilla.org/en-US/docs/Web/API/IndexedDB_API)
 */
export declare class IndexedDBAdapter extends BaseAdapter {
    static identifier: string;
    static can_hotlink: boolean;
    static can_watch: boolean;
    static is_available: boolean;
    static requires_mount: boolean;
    /**
     * Represents the IndexedDB storage for Nodes
     *
     * @internal
     */
    storage?: IndexedDBStorage;
    constructor(options?: Partial<IBaseAdapterOptions>);
    create_url_object(path: string): Promise<IURLObject>;
    get(path: string): Promise<INode | null>;
    /**
     * Persists a new or updates an existing Node with new metadata. Optionally can specify the Node's [[NODE_TYPES]]
     *
     * > **NOTE**: Will try to guess the Mime Type if `mime_type` is `undefined`
     *
     * @param path
     * @param type
     * @param mime_type
     */
    put(path: string, type?: NODE_TYPES, mime_type?: string): Promise<void>;
    query(options?: IQueryOptions): Promise<IQueryResult[]>;
    read(path: string): Promise<Uint8Array | null>;
    remove(path: string): Promise<boolean>;
    watch(options?: IWatchOptions): Promise<IEvent<IWatchEvent>>;
    write(path: string, payload: Uint8Array): Promise<void>;
    is_mounted(): boolean;
    mount(): Promise<void>;
    unmount(): Promise<void>;
}
export {};
