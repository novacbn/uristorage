import { NODE_TYPES } from "../util/constants";
import { IEvent } from "../util/event";
import { IBaseAdapterOptions, INode, IQueryOptions, IQueryResult, IURLObject, IWatchEvent, IWatchOptions, BaseAdapter } from "./base_adapter";
/**
 * Represents the options passable to [[WebStorageAdapter]]
 */
export interface IWebStorageOptions extends IBaseAdapterOptions {
    /**
     * Represents if LZ77 Compression should be used for binary payloads for persistence
     *
     * > **NOTE**: Depending on the size of the payload and other factors, this can
     * > incur a CPU performance impact
     */
    compressed: boolean;
}
/**
 * ...
 *
 * @internal
 */
declare class WebStorage {
    /**
     * Event that dispatches whenever there is a creation / update in the Web Storage
     */
    EVENT_WATCH: IEvent<IWatchEvent>;
    /**
     * Represents the Node metadata prefix for all the persisted key names
     */
    prefix_node: string;
    /**
     * Represents the binary payload prefix for all the persisted key names
     */
    prefix_payload: string;
    /**
     * Represents the validated [Web Storage API](https://developer.mozilla.org/en-US/docs/Web/API/Web_Storage_API) that's being targetted
     *
     * @internal
     */
    storage: Storage;
    constructor(namespace: string, storage: Storage);
    attach(path: string, payload: Uint8Array, mtime: number): void;
    get(path: string): INode | null;
    get_payload(path: string): Uint8Array | null;
    has(path: string): boolean;
    nodes(): Generator<IQueryResult>;
    put(path: string, node: Omit<INode, "path">): void;
    remove(path: string): boolean;
    update(path: string, value: Partial<INode>): void;
}
/**
 * Represents a URIStorage Adapter that targets the Browsers' [Web Storage API](https://developer.mozilla.org/en-US/docs/Web/API/Web_Storage_API)
 */
export declare class WebStorageAdapter extends BaseAdapter {
    static can_hotlink: boolean;
    static can_watch: boolean;
    static is_available: boolean;
    /**
     * Represents the target [Web Storage API](https://developer.mozilla.org/en-US/docs/Web/API/Web_Storage_API) to utilize
     */
    static storage: Storage | null;
    storage: WebStorage;
    options: IWebStorageOptions;
    constructor(storage: Storage, options?: Partial<IWebStorageOptions>);
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
/**
 * Represents a URIStorage Adapter that targets the Browsers' [localStorage](https://developer.mozilla.org/en-US/docs/Web/API/Window/localStorage)
 *
 * > **NOTE**: Some Browsers may delete `localStorage` contents after a period of in-activity and may enforce harsh storage limits, e.g. 5 MB max
 */
export declare class LocalStorageAdapter extends WebStorageAdapter {
    static is_available: boolean;
    constructor(options?: Partial<IWebStorageOptions>);
}
/**
 * Represents a URIStorage Adapter that targets the Browsers' [sessionStorage](https://developer.mozilla.org/en-US/docs/Web/API/Window/sessionStorage)
 *
 * > **NOTE**: Browsers delete `sessionStorage` contents after a browsing session is closed and may enforce harsh storage limits, e.g. 5 MB max
 */
export declare class SessionStorageAdapter extends WebStorageAdapter {
    static is_available: boolean;
    constructor(options?: Partial<IWebStorageOptions>);
}
export {};
