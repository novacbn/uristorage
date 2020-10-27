import { NODE_CHANGES, NODE_TYPES } from "../util/constants";
import { IEvent } from "../util/event";
/**
 * Represents the options passable to [[BaseAdapter]]
 */
export interface IBaseAdapterOptions {
    /**
     * Represents the namespace used for the Adapter
     *
     * > **NOTE**: There is no base format for namespaces, it is dependent on the Adapter!
     */
    namespace: string;
}
/**
 * Represents the event details dispatched to subscribers via [[BaseAdapter.EVENT_MOUNTED]] / [[BaseAdapter.EVENT_UNMOUNTED]]
 */
export interface IMountedEvent {
    storage: BaseAdapter;
}
/**
 * Represents the Node stats returned by [[BaseAdapter.get_stats]]
 */
export interface INode {
    /**
     * Represents the creation time of the Node in milliseconds since UNIX Epoch in UTC
     */
    ctime: number;
    /**
     * Represents the Mime Type associated with how the Node's payload should be handled
     */
    mime_type: string;
    /**
     * Represents the last updated time of the Node in milliseconds since UNIX Epoch in UTC
     */
    mtime: number;
    /**
     * Represents the path associated with the Node
     */
    path: string;
    /**
     * Represents what type of Node it is
     */
    type: NODE_TYPES;
}
/**
 * Represents the options passable to [[BaseAdapter.query]]
 */
export interface IQueryOptions {
    /**
     * Represents the type of Node to filter for
     */
    type?: NODE_TYPES | NODE_TYPES[];
    /**
     * Represents filter applicable to Node paths
     */
    path?: {
        /**
         * Represents a [Bash Shell Glob](https://en.wikipedia.org/wiki/Glob_(programming)) pattern to match paths with
         *
         * > **NOTE**: When using "Globstar", "**", the backend will search recursively for sub-paths, which may incur a performance penalty
         */
        glob?: string;
        /**
         * Represents to search for Nodes that start with the given path
         */
        path?: string;
        /**
         * Represents if the [[IQueryOptions.path.path]] should be recursively queried for sub-paths or not
         *
         * > **NOTE**: When set to `true`, the backend will search recursively for sub-paths, which may incur a performance penalty
         */
        recursive?: boolean;
        /**
         * Represents a [Regular Expression](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/RegExp) to match paths with
         *
         * > **NOTE**: When using the "Global Match" flag, "g", the backend will search recursively for sub-paths, which may incur a performance penalty
         */
        regex?: RegExp;
    };
}
/**
 * Represents the struct returned by [[BaseAdapter.query]] for matching Nodes
 */
export interface IQueryResult {
    /**
     * Represents the path of the Node matched
     */
    path: string;
    /**
     * Represents the type of Node matched
     */
    type: NODE_TYPES;
}
/**
 * Represents the return value from [[BaseAdapter.create_url_object]]
 */
export interface IURLObject {
    /**
     * Represents the path used to create the [[IURLObject]]
     */
    path: string;
    /**
     * Represents the URL string usable for embeding via HTML tags, e.g. `<img src="...value of IURLObject.url..." />`
     */
    url: string;
    /**
     * Removes the URL object from memory, performing any clean-up necessary
     *
     * > **NOTE**: This function should only be called once
     */
    destroy: () => Promise<void>;
}
/**
 * Represents the event details dispatched to subscribers via [[BaseAdapter.watch]]
 */
export interface IWatchEvent {
    /**
     * Represents the type of change that occured with the Node
     */
    change: NODE_CHANGES;
    /**
     * Represents the path of the Node that was created / updated
     */
    path: string;
    /**
     * Represents the type of Node that was created / updated
     */
    type: NODE_TYPES;
}
/**
 * Represents the options passable to [[BaseAdapter.watch]]
 */
export interface IWatchOptions {
    /**
     * Represents which types of update method to watch the Node path for
     */
    change?: NODE_CHANGES | NODE_CHANGES[];
    /**
     * Represents a [Bash Shell Glob](https://en.wikipedia.org/wiki/Glob_(programming)) pattern to match paths with
     *
     * > **NOTE**: When using "Globstar", "**", the backend will watch recursively for sub-paths, which may incur a performance penalty
     */
    glob?: string;
    /**
     * Represents if [[IWatchOptions.path]] should watch for sub-paths instead of a singular Node path
     */
    inclusive?: boolean;
    /**
     * Represents a singular Node path to watch for changes
     */
    path?: string;
    /**
     * Represents if [[IWatchOptions.path]] should watch for changes that happen in sub-paths as well.
     *
     * > **NOTE**: Only applicable whenever [[IWatchOptions.inclusive]] is `true`
     */
    recursive?: boolean;
    /**
     * Represents a [Regular Expression](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/RegExp) to match paths with
     *
     * > **NOTE**: When using the "Global Match" flag, "g", the backend will watch recursively for sub-paths, which may incur a performance penalty
     */
    regex?: RegExp;
    /**
     * Represents the type of Nodes to watch only for
     */
    type?: NODE_TYPES | NODE_TYPES[];
}
/**
 * Returns a newly created URL object that the Browser can use for embeds, e.g. `<img src="..." />` tags
 *
 * > **NOTE**: This function is normally performed by an Adapter's backend if it can be represented
 *
 * @param payload
 */
export declare function create_url_object(payload: Blob): {
    destroy: () => Promise<void>;
    url: string;
};
export declare function create_url_object(payload: Uint8Array, mime_type: string): {
    destroy: () => Promise<void>;
    url: string;
};
/**
 * Returns `true` if the provided [[IWatchEvent]] event is validated against the [[IWatchOptions]] for [[BaseAdapter.watch]]
 *
 * > **NOTE**: This function is normally performed by an Adapter's backend if it can be represented
 *
 * @param event
 * @param options
 */
export declare function can_watch(event: IWatchEvent, options?: IWatchOptions): boolean;
/**
 * Returns a in-memory filtering of results from [[BaseAdapter.query]]
 *
 * > **NOTE**: This function is normally performed by an Adapter's backend if it can be represented
 *
 * @param nodes
 * @param options
 */
export declare function filter_query(nodes: IQueryResult[], options?: IQueryOptions): IQueryResult[];
/**
 * Returns a new `IEvent` that only dispatches events from the watcher that match the filter
 *
 * > **NOTE**: This function is normally performed by an Adapter's backend if it can be represented
 *
 * @param watcher
 * @param options
 */
export declare function hook_watcher(watcher: IEvent<IWatchEvent>, options?: IWatchOptions): IEvent<IWatchEvent>;
/**
 * Represents the base common API all URIStorage Adapters ad-here to
 */
export declare class BaseAdapter {
    /**
     * Represents of the Adapter can utilize [[BaseAdapter.create_url_object]]
     */
    static can_hotlink: boolean;
    /**
     * Represents if the Adapter can utilize [[BaseAdapter.watch]]
     */
    static can_watch: boolean;
    /**
     * Represents if the Adapter can utilize [[BaseAdapter.watch]] but requires periodic calls to [[BaseAdapter.reload]]
     */
    static can_watch_reload: boolean;
    /**
     * Represents if the Adapter is available in the current Javascript environment
     */
    static is_available: boolean;
    /**
     * Represents if the Adapter is read-only
     */
    static is_readonly: boolean;
    /**
     * Represents if the Adapter requires mounting first, to be used
     */
    static requires_mount: boolean;
    /**
     * Event that dispatches whenever the Adapter is mounted
     */
    EVENT_MOUNTED: IEvent<IMountedEvent>;
    /**
     * Event that dispatches whenever the Adapter is unmounted
     */
    EVENT_UNMOUNTED: IEvent<IMountedEvent>;
    /**
     * Represents the standardized options passed into the constructor
     */
    options: IBaseAdapterOptions;
    constructor(options?: Partial<IBaseAdapterOptions>);
    /**
     * Returns the `path` normalized for the given Adapter
     *
     * @internal
     *
     * @param path
     */
    normalize(path: string): string;
    /**
     * Returns a new [[IURLObject]] linking to the given `path`
     *
     * > **NOTE**: Will not work with [[BaseAdapter.can_hotlink]] is `false` for the given Adapter
     **
     * @param path
     */
    create_url_object(path: string): Promise<IURLObject>;
    /**
     * Returns the [[INode]] struct of the requested path, or `null` if non-existant
     * @param path
     */
    get(path: string): Promise<INode | null>;
    /**
     * Persists a new or updates an existing Node with new metadata. Optionally can specify the Node's [[NODE_TYPES]]
     *
     * > **NOTE**: Not all Adapters utilize `mime_type` input, depending on backend, it might automatically be handled
     *
     * @param path
     * @param type
     * @param mime_type
     */
    put(path: string, type?: NODE_TYPES, mime_type?: string): Promise<void>;
    /**
     * Queries the Adapter for listings of currently persisted Nodes, with optional filtering
     * parameters to narrow down return results
     *
     * @param options
     */
    query(options?: IQueryOptions): Promise<IQueryResult[]>;
    /**
     * Returns the binary payload of the requested path, or `null` if non-existant
     * @param path
     */
    read(path: string): Promise<Uint8Array | null>;
    /**
     * Polls the Adapter for any new changes since any previous calls to [[BaseAdapter.watch]] was
     * performed. Dispatching to the relevant subscribers
     *
     * > **NOTE**: Only call this if the Adapter's [[BaseAdapter.can_watch_reload]] is `true`
     */
    reload(): Promise<void>;
    /**
     * Removes the Node by the given `path`, returns true if successful
     * @param path
     */
    remove(path: string): Promise<boolean>;
    /**
     * Returns a new subscribable [[IEvent]] that dispatches whenever changes to the given `path` were
     * performed. With optional filtering parameters to narrow what to watch
     *
     * @param options
     */
    watch(options?: IWatchOptions): Promise<IEvent<IWatchEvent>>;
    /**
     * Persists a binary payload to an existing Node.
     *
     * > **NOTE**: The [[BaseAdapter.put]] must be called before this method to create a Node
     *
     * @param path
     * @param payload
     */
    write(path: string, payload: Uint8Array): Promise<void>;
    /**
     * Returns if the Adapter is currently mounted
     *
     * > **NOTE**: There is no base concept of "mounting", it could be establishing a connection to a FTP
     * > server, mounting a local SQLite3 database, etc, etc
     */
    is_mounted(): boolean;
    /**
     * Mounts the Adapter if currently unmounted
     *
     * > **NOTE**: There is no base concept of "mounting", it could be establishing a connection to a FTP
     * > server, mounting a local SQLite3 database, etc, etc
     */
    mount(): Promise<void>;
    /**
     * Unmounts the Adapter if currently mounted
     *
     * > **NOTE**: There is no base concept of "mounting", it could be establishing a connection to a FTP
     * > server, mounting a local SQLite3 database, etc, etc
     */
    unmount(): Promise<void>;
}
