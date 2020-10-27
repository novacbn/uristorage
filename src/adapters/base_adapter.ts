import {NODE_CHANGES, NODE_TYPES, DEFAULT_MIME_TYPE} from "../util/constants";
import {IEvent, event} from "../util/event";
import {make_glob} from "../util/glob";
import {join, normalize} from "../util/path";

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
 * Returns standardized options w/ defaults of [[IBaseAdapterOptions]]
 *
 * @internal
 *
 * @param options
 */
function BaseAdapterOptions(options: Partial<IBaseAdapterOptions> = {}): IBaseAdapterOptions {
    const {namespace = "default"} = options;

    return {
        ...options,

        namespace,
    };
}

/**
 * Returns a newly created URL object that the Browser can use for embeds, e.g. `<img src="..." />` tags
 *
 * > **NOTE**: This function is normally performed by an Adapter's backend if it can be represented
 *
 * @param payload
 */
export function create_url_object(payload: Blob): {destroy: () => Promise<void>; url: string};
export function create_url_object(
    payload: Uint8Array,
    mime_type: string
): {destroy: () => Promise<void>; url: string};
export function create_url_object(
    payload: Blob | Uint8Array,
    mime_type?: string
): {destroy: () => Promise<void>; url: string} {
    if (payload instanceof Uint8Array) {
        if (!mime_type) mime_type = DEFAULT_MIME_TYPE;
        payload = new Blob([payload], {type: mime_type});
    }

    const url = URL.createObjectURL(payload);

    return {
        url,
        destroy: async () => URL.revokeObjectURL(url),
    };
}

/**
 * Returns `true` if the provided [[IWatchEvent]] event is validated against the [[IWatchOptions]] for [[BaseAdapter.watch]]
 *
 * > **NOTE**: This function is normally performed by an Adapter's backend if it can be represented
 *
 * @param event
 * @param options
 */
export function can_watch(event: IWatchEvent, options: IWatchOptions = {}): boolean {
    const {change, glob, inclusive = false, path = "/", recursive = false, regex, type} = options;

    if (type) {
        if (typeof type === "string") {
            if (event.type !== type) return false;
        } else if (!type.includes(event.type)) return false;
    }

    if (change) {
        if (typeof change === "string") {
            if (change !== event.change) return false;
        } else if (!change.includes(event.change)) return false;
    }

    // NOTE: Only one one mode of filters should be accepted at a time. While
    // the order of priority here is arbitrary. It should be recognized in
    // other backend Adapters for consistency
    if (glob) {
        const regex = make_glob(normalize(glob));

        return regex.test(event.path);
    } else if (regex) {
        return regex.test(event.path);
    } else {
        if (inclusive) {
            const _path = recursive ? join(path, "**") : join(path, "*");
            const regex = make_glob(normalize(_path));

            return regex.test(event.path);
        }

        return event.path === normalize(path);
    }
}

/**
 * Returns a in-memory filtering of results from [[BaseAdapter.query]]
 *
 * > **NOTE**: This function is normally performed by an Adapter's backend if it can be represented
 *
 * @param nodes
 * @param options
 */
export function filter_query(nodes: IQueryResult[], options: IQueryOptions = {}): IQueryResult[] {
    const {path = {}, type} = options;

    if (type) {
        if (typeof type === "string") nodes = nodes.filter((node) => node.type === type);
        else nodes = nodes.filter((node) => type.includes(node.type));
    }

    // NOTE: Only one one mode of querying should be accepted at a time. While
    // the order of priority here is arbitrary. It should be recognized in
    // other backend Adapters for consistency
    if (path.glob) {
        const regex = make_glob(normalize(path.glob));

        nodes = nodes.filter((node) => regex.test(node.path));
    } else if (path.regex) {
        const {regex} = path;

        nodes = nodes.filter((node) => regex.test(node.path));
    } else {
        // TODO: Technically if the end-developer provides a `.path` member, they
        // can just pass a glob pattern. Should we sanitize?
        let {path: _path = "/"} = path;

        _path = path.recursive ? join(_path, "**") : join(_path, "*");
        const regex = make_glob(normalize(_path));

        nodes = nodes.filter((node) => regex.test(node.path));
    }

    return nodes;
}

/**
 * Returns a new `IEvent` that only dispatches events from the watcher that match the filter
 *
 * > **NOTE**: This function is normally performed by an Adapter's backend if it can be represented
 *
 * @param watcher
 * @param options
 */
export function hook_watcher(
    watcher: IEvent<IWatchEvent>,
    options: IWatchOptions = {}
): IEvent<IWatchEvent> {
    return event((dispatch) => {
        const destroy = watcher.subscribe((event) => {
            if (can_watch(event, options)) dispatch(event);
        });

        return () => destroy();
    });
}

/**
 * Represents the base common API all URIStorage Adapters ad-here to
 */
export class BaseAdapter {
    /**
     * Represents of the Adapter can utilize [[BaseAdapter.create_url_object]]
     */
    static can_hotlink: boolean = false;

    /**
     * Represents if the Adapter can utilize [[BaseAdapter.watch]]
     */
    static can_watch: boolean = false;

    /**
     * Represents if the Adapter can utilize [[BaseAdapter.watch]] but requires periodic calls to [[BaseAdapter.reload]]
     */
    static can_watch_reload: boolean = false;

    /**
     * Represents if the Adapter is available in the current Javascript environment
     */
    static is_available: boolean = false;

    /**
     * Represents if the Adapter is read-only
     */
    static is_readonly: boolean = false;

    /**
     * Represents if the Adapter requires mounting first, to be used
     */
    static requires_mount: boolean = false;

    /**
     * Event that dispatches whenever the Adapter is mounted
     */
    EVENT_MOUNTED = event<IMountedEvent>();

    /**
     * Event that dispatches whenever the Adapter is unmounted
     */
    EVENT_UNMOUNTED = event<IMountedEvent>();

    /**
     * Represents the standardized options passed into the constructor
     */
    options: IBaseAdapterOptions;

    constructor(options: Partial<IBaseAdapterOptions> = {}) {
        this.options = BaseAdapterOptions(options);
    }

    /**
     * Returns the `path` normalized for the given Adapter
     *
     * @internal
     *
     * @param path
     */
    normalize(path: string): string {
        return normalize(path);
    }

    /**
     * Returns a new [[IURLObject]] linking to the given `path`
     *
     * > **NOTE**: Will not work with [[BaseAdapter.can_hotlink]] is `false` for the given Adapter
     **
     * @param path
     */
    async create_url_object(path: string): Promise<IURLObject> {
        throw new Error("bad dispatch to 'create_url_object' (not implemented)");
    }

    /**
     * Returns the [[INode]] struct of the requested path, or `null` if non-existant
     * @param path
     */
    async get(path: string): Promise<INode | null> {
        throw new Error("bad dispatch to 'get' (not implemented)");
    }

    /**
     * Persists a new or updates an existing Node with new metadata. Optionally can specify the Node's [[NODE_TYPES]]
     *
     * > **NOTE**: Not all Adapters utilize `mime_type` input, depending on backend, it might automatically be handled
     *
     * @param path
     * @param type
     * @param mime_type
     */
    async put(
        path: string,
        type: NODE_TYPES = NODE_TYPES.undefined,
        mime_type?: string
    ): Promise<void> {
        throw new Error("bad dispatch to 'put' (not implemented)");
    }

    /**
     * Queries the Adapter for listings of currently persisted Nodes, with optional filtering
     * parameters to narrow down return results
     *
     * @param options
     */
    async query(options: IQueryOptions = {}): Promise<IQueryResult[]> {
        throw new Error("bad dispatch to 'query' (not implemented)");
    }

    /**
     * Returns the binary payload of the requested path, or `null` if non-existant
     * @param path
     */
    async read(path: string): Promise<Uint8Array | null> {
        throw new Error("bad dispatch to 'get_stats' (not implemented)");
    }

    /**
     * Polls the Adapter for any new changes since any previous calls to [[BaseAdapter.watch]] was
     * performed. Dispatching to the relevant subscribers
     *
     * > **NOTE**: Only call this if the Adapter's [[BaseAdapter.can_watch_reload]] is `true`
     */
    async reload(): Promise<void> {
        throw new Error("bad dispatch to 'reload' (not implemented)");
    }

    /**
     * Removes the Node by the given `path`, returns true if successful
     * @param path
     */
    async remove(path: string): Promise<boolean> {
        throw new Error("bad dispatch to 'remove' (not implemented)");
    }

    /**
     * Returns a new subscribable [[IEvent]] that dispatches whenever changes to the given `path` were
     * performed. With optional filtering parameters to narrow what to watch
     *
     * @param options
     */
    async watch(options: IWatchOptions = {}): Promise<IEvent<IWatchEvent>> {
        throw new Error("bad dispatch to 'watch' (not implemented)");
    }

    /**
     * Persists a binary payload to an existing Node.
     *
     * > **NOTE**: The [[BaseAdapter.put]] must be called before this method to create a Node
     *
     * @param path
     * @param payload
     */
    async write(path: string, payload: Uint8Array): Promise<void> {
        throw new Error("bad dispatch to 'put_payload' (not implemented)");
    }

    /**
     * Returns if the Adapter is currently mounted
     *
     * > **NOTE**: There is no base concept of "mounting", it could be establishing a connection to a FTP
     * > server, mounting a local SQLite3 database, etc, etc
     */
    is_mounted(): boolean {
        throw new Error("bad dispatch to 'is_mounted' (not implemented)");
    }

    /**
     * Mounts the Adapter if currently unmounted
     *
     * > **NOTE**: There is no base concept of "mounting", it could be establishing a connection to a FTP
     * > server, mounting a local SQLite3 database, etc, etc
     */
    async mount(): Promise<void> {
        throw new Error("bad dispatch to 'mount' (not implemented)");
    }

    /**
     * Unmounts the Adapter if currently mounted
     *
     * > **NOTE**: There is no base concept of "mounting", it could be establishing a connection to a FTP
     * > server, mounting a local SQLite3 database, etc, etc
     */
    async unmount(): Promise<void> {
        throw new Error("bad dispatch to 'unmount' (not implemented)");
    }
}
