import {compress, decompress} from "../util/compression";
import {NODE_CHANGES, DEFAULT_MIME_TYPE, ENCODING_MODE, NODE_TYPES} from "../util/constants";
import {get_epoch_timestamp} from "../util/datetime";
import {decode_safe, encode_safe} from "../util/encoding";
import {IEvent, event} from "../util/event";
import {get_mime_type} from "../util/mime_types";

import {
    IBaseAdapterOptions,
    INode,
    IQueryOptions,
    IQueryResult,
    IURLObject,
    IWatchEvent,
    IWatchOptions,
    BaseAdapter,
    create_url_object,
    filter_query,
    hook_watcher,
} from "./base_adapter";

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
class WebStorage {
    /**
     * Event that dispatches whenever there is a creation / update in the Web Storage
     */
    EVENT_WATCH = event<IWatchEvent>();

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

    constructor(namespace: string, storage: Storage) {
        this.prefix_node = `uristorage:${namespace}:n:`;
        this.prefix_payload = `uristorage:${namespace}:p:`;

        this.storage = storage;
    }

    attach(path: string, payload: Uint8Array, mtime: number): void {
        const {storage} = this;

        const key_node = this.prefix_node + path;
        const key_payload = this.prefix_payload + path;

        const node: INode = {...JSON.parse(storage.getItem(key_node) as string), mtime};

        storage.setItem(key_node, JSON.stringify(node));
        storage.setItem(key_payload, encode_safe(payload));

        this.EVENT_WATCH.dispatch({
            change: NODE_CHANGES.attached,
            path: path,
            type: node.type,
        });
    }

    get(path: string): INode | null {
        const key = this.prefix_node + path;
        const item = this.storage.getItem(key);

        if (item) {
            // NOTE: There could be unsupported or missing metadata, so we need to extract and default
            const {
                ctime = 0.0,
                mime_type = DEFAULT_MIME_TYPE,
                mtime = 0.0,
                type = NODE_TYPES.undefined,
            } = JSON.parse(item);

            return {
                ctime,
                mime_type,
                mtime,
                path,
                type,
            };
        }

        return null;
    }

    get_payload(path: string): Uint8Array | null {
        const key = this.prefix_payload + path;
        const item = this.storage.getItem(key);

        if (item) return decode_safe(item, {mode: ENCODING_MODE.bytes});
        return null;
    }

    has(path: string): boolean {
        path = this.prefix_node + path;

        return !!this.storage.getItem(path);
    }

    *nodes(): Generator<IQueryResult> {
        const {prefix_node, storage} = this;

        for (let index = 0; index < storage.length; index++) {
            const key = storage.key(index);
            if (key?.startsWith(prefix_node)) {
                const item = storage.getItem(key);
                const {type = NODE_TYPES.undefined} = JSON.parse(item as string);

                yield {
                    path: key.slice(prefix_node.length),
                    type,
                };
            }
        }
    }

    put(path: string, node: Omit<INode, "path">): void {
        const _node: INode = {...node, path};
        const item = JSON.stringify(_node);

        this.storage.setItem(this.prefix_node + path, item);

        this.EVENT_WATCH.dispatch({
            change: NODE_CHANGES.created,
            path: path,
            type: _node.type,
        });
    }

    remove(path: string): boolean {
        const {storage} = this;

        const key_node = this.prefix_node + path;
        const item = storage.getItem(key_node);
        if (!item) return false;

        const node = JSON.parse(item);

        // NOTE: Always remove the payload from Web Storage, zero performance cost anyway
        storage.removeItem(key_node);
        storage.removeItem(this.prefix_payload + path);

        this.EVENT_WATCH.dispatch({
            change: NODE_CHANGES.removed,
            path: path,
            type: node.type,
        });

        return true;
    }

    update(path: string, value: Partial<INode>): void {
        const {storage} = this;

        const key = this.prefix_node + path;
        const node: INode = {...JSON.parse(storage.getItem(key) as string), ...value, path};

        storage.setItem(key, JSON.stringify(node));

        this.EVENT_WATCH.dispatch({
            change: NODE_CHANGES.updated,
            path: node.path,
            type: node.type,
        });
    }
}

/**
 * Returns standardized options w/ defaults of [[iWebStorageOptions]]
 *
 * @internal
 *
 * @param options
 */
function WebStorageOptions(options: Partial<IWebStorageOptions> = {}): Partial<IWebStorageOptions> {
    const {compressed = true} = options;

    return {
        ...options,

        compressed,
    };
}

/**
 * Represents a URIStorage Adapter that targets the Browsers' [Web Storage API](https://developer.mozilla.org/en-US/docs/Web/API/Web_Storage_API)
 */
export class WebStorageAdapter extends BaseAdapter {
    // NOTE: While `localStorage` / `sessionStorage` are synchronous, we
    // need to conform to the Promise-based API

    // TODO: Can probably clean up the implementation

    // TODO: Hook [`StorageEvent`](https://developer.mozilla.org/en-US/docs/Web/API/StorageEvent) for cross-tab updates
    // also maybe utilize a global `EVENT_WATCH` instead of one per-instance?

    static can_hotlink = true;

    static can_watch = true;

    static is_available = false;

    /**
     * Represents the target [Web Storage API](https://developer.mozilla.org/en-US/docs/Web/API/Web_Storage_API) to utilize
     */
    static storage: Storage | null = null;

    storage: WebStorage;

    options!: IWebStorageOptions;

    constructor(storage: Storage, options: Partial<IWebStorageOptions> = {}) {
        super(WebStorageOptions(options));

        const {namespace} = this.options;

        this.storage = new WebStorage(namespace, storage);
    }

    async create_url_object(path: string): Promise<IURLObject> {
        const {storage} = this;
        const {compressed} = this.options;

        const uri = this.normalize(path);
        if (!storage.has(uri)) {
            throw new Error(
                "bad argument #0 to 'create_url_object' (Node must be created before using 'create_url_object')"
            );
        }

        let payload = storage.get_payload(uri);
        if (!payload) {
            throw new Error(
                "bad argument #0 to 'create_url_object' (Node payload must be created before using 'create_url_object')"
            );
        }

        const node = storage.get(uri) as INode;
        payload = compressed ? decompress(payload) : payload;

        const object = create_url_object(payload, node.mime_type);

        return {
            destroy: object.destroy,
            path: node.path,
            url: object.url,
        };
    }

    async get(path: string): Promise<INode | null> {
        const uri = this.normalize(path);

        return this.storage.get(uri);
    }

    /**
     * Persists a new or updates an existing Node with new metadata. Optionally can specify the Node's [[NODE_TYPES]]
     *
     * > **NOTE**: Will try to guess the Mime Type if `mime_type` is `undefined`
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
        const {storage} = this;

        const uri = this.normalize(path);
        const timestamp = get_epoch_timestamp();
        if (!mime_type) mime_type = get_mime_type(uri) || DEFAULT_MIME_TYPE;

        if (storage.has(uri)) {
            storage.update(uri, {
                mime_type,
                mtime: timestamp,
                type,
            });
        } else {
            storage.put(uri, {
                ctime: timestamp,
                mime_type,
                mtime: timestamp,
                type,
            });
        }
    }

    async query(options: IQueryOptions = {}): Promise<IQueryResult[]> {
        const nodes = Array.from(this.storage.nodes());

        return filter_query(nodes, options);
    }

    async read(path: string): Promise<Uint8Array | null> {
        const {compressed} = this.options;

        const uri = this.normalize(path);
        const payload = this.storage.get_payload(uri);

        if (!payload) return null;
        return compressed ? decompress(payload) : payload;
    }

    async remove(path: string): Promise<boolean> {
        const uri = this.normalize(path);

        return this.storage.remove(uri);
    }

    async watch(options: IWatchOptions = {}): Promise<IEvent<IWatchEvent>> {
        return hook_watcher(this.storage.EVENT_WATCH, options);
    }

    async write(path: string, payload: Uint8Array): Promise<void> {
        const {storage} = this;
        const {compressed} = this.options;

        const uri = this.normalize(path);
        if (!storage.has(uri)) {
            throw new Error(
                "bad argument #0 to 'attach' (Node must be created before using 'attach')"
            );
        }

        payload = compressed ? compress(payload) : payload;
        storage.attach(uri, payload, get_epoch_timestamp());
    }

    is_mounted(): boolean {
        return true;
    }

    async mount(): Promise<void> {}

    async unmount(): Promise<void> {}
}

/**
 * Represents a URIStorage Adapter that targets the Browsers' [localStorage](https://developer.mozilla.org/en-US/docs/Web/API/Window/localStorage)
 *
 * > **NOTE**: Some Browsers may delete `localStorage` contents after a period of in-activity and may enforce harsh storage limits, e.g. 5 MB max
 */
export class LocalStorageAdapter extends WebStorageAdapter {
    static is_available = !!(typeof window === "object" && window.localStorage);

    constructor(options: Partial<IWebStorageOptions> = {}) {
        super(window.localStorage, options);
    }
}

/**
 * Represents a URIStorage Adapter that targets the Browsers' [sessionStorage](https://developer.mozilla.org/en-US/docs/Web/API/Window/sessionStorage)
 *
 * > **NOTE**: Browsers delete `sessionStorage` contents after a browsing session is closed and may enforce harsh storage limits, e.g. 5 MB max
 */
export class SessionStorageAdapter extends WebStorageAdapter {
    static is_available = !!(typeof window === "object" && window.sessionStorage);

    constructor(options: Partial<IWebStorageOptions> = {}) {
        super(window.sessionStorage, options);
    }
}
