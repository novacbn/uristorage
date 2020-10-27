import {compress, decompress} from "../util/compression";
import {NODE_CHANGES, DEFAULT_MIME_TYPE, NODE_TYPES} from "../util/constants";
import {get_epoch_timestamp} from "../util/datetime";
import {IEvent, event} from "../util/event";
import {ImmutableMap} from "../util/map";
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
 * Represents a persisted Node in a `MemoryAdapter` Adapter
 */
interface IMemoryNode extends INode {
    /**
     * Represents the binary payload currently stored with the Node
     */
    payload?: Uint8Array;
}

/**
 * Represents the `Map` implementation used for in-memory Node storage
 */
class NodeMap extends ImmutableMap<IMemoryNode> {
    /**
     * Event that dispatches whenever there is a creation / update in the in-memory storage
     */
    EVENT_WATCH = event<IWatchEvent>();

    clone = (node: IMemoryNode): IMemoryNode => {
        const {ctime, mime_type, mtime, path, type} = node;

        let {payload} = node;
        if (payload) payload = payload.slice();

        return {ctime, mime_type, mtime, payload, path, type};
    };

    delete(key: string): boolean {
        if (this.has(key)) {
            const node = this.get(key) as IMemoryNode;

            super.delete(key);

            this.EVENT_WATCH.dispatch({
                change: NODE_CHANGES.removed,
                path: node.path,
                type: node.type,
            });

            return true;
        }

        return false;
    }

    put(key: string, value: Omit<IMemoryNode, "path">): this {
        const node: INode = {...value, path: key};
        super.set(key, node);

        this.EVENT_WATCH.dispatch({
            change: NODE_CHANGES.created,
            path: node.path,
            type: node.type,
        });

        return this;
    }

    update(key: string, value: Partial<IMemoryNode>): this {
        const node = {...this.get(key), ...value, path: key} as IMemoryNode;
        super.set(key, node);

        if (value.payload) {
            this.EVENT_WATCH.dispatch({
                change: NODE_CHANGES.attached,
                path: node.path,
                type: node.type,
            });
        } else {
            this.EVENT_WATCH.dispatch({
                change: NODE_CHANGES.updated,
                path: node.path,
                type: node.type,
            });
        }

        return this;
    }
}

/**
 * Represents the options passable to [[MemoryAdapter]]
 */
export interface IMemoryOptions extends IBaseAdapterOptions {
    /**
     * Represents if LZ77 Compression should be used for binary payloads for persistence
     *
     * > **NOTE**: Depending on the size of the payload and other factors, this can
     * > incur a CPU performance impact
     *
     * > **NOTE**: It's recommended to turn this setting on if persisting large payloads,
     * > as they as stored in-memory rather than on disk
     */
    compressed: boolean;
}

/**
 * Returns standardized options w/ defaults of [[IMemoryOptions]]
 *
 * @internal
 *
 * @param options
 */
function MemoryOptions(options: Partial<IMemoryOptions> = {}): Partial<IMemoryOptions> {
    const {compressed = false} = options;

    return {
        ...options,

        compressed,
    };
}

/**
 * Represents a URIStorage Adapter that persists all data into volatile memory
 *
 * > **NOTE**: As this Adapter backend persists data into memory, it is not shared between tabs, pages, nor browsing sessions
 */
export class MemoryAdapter extends BaseAdapter {
    static can_hotlink = true;

    static can_watch = true;

    static is_available = true;

    /**
     * Represents the in-memory storage for Nodes
     */
    storage = new NodeMap();

    options!: IMemoryOptions;

    constructor(options: Partial<IMemoryOptions> = {}) {
        super(MemoryOptions(options));
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

        const node = storage.get(uri) as IMemoryNode;
        if (!node.payload) {
            throw new Error(
                "bad argument #0 to 'create_url_object' (Node payload must be created before using 'create_url_object')"
            );
        }

        const payload = compressed ? decompress(node.payload) : node.payload;
        const object = create_url_object(payload, node.mime_type);

        return {
            destroy: object.destroy,
            path: node.path,
            url: object.url,
        };
    }

    async get(path: string): Promise<INode | null> {
        const {storage} = this;

        const uri = this.normalize(path);
        if (!storage.has(uri)) return null;

        const node = storage.get(uri) as IMemoryNode;

        return {
            ctime: node.ctime,
            mime_type: node.mime_type,
            mtime: node.mtime,
            path: node.path,
            type: node.type,
        };
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
        const entries = Array.from(this.storage.entries());

        const nodes = entries.map((entry, index) => {
            const path = entry[0];
            const {type = NODE_TYPES.undefined} = entry[1];

            return {path, type};
        });

        return filter_query(nodes, options);
    }

    async read(path: string): Promise<Uint8Array | null> {
        const {storage} = this;
        const {compressed} = this.options;

        const uri = this.normalize(path);
        if (!storage.has(uri)) return null;

        const node = storage.get(uri) as IMemoryNode;
        if (!node.payload) return null;

        return compressed ? decompress(node.payload) : node.payload;
    }

    async remove(path: string): Promise<boolean> {
        const {storage} = this;

        const uri = this.normalize(path);
        return storage.delete(uri);
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

        storage.update(uri, {
            mtime: get_epoch_timestamp(),
            payload: compressed ? compress(payload) : payload,
        });
    }

    /**
     * Returns if the Adapter is currently mounted
     *
     * > **NOTE**: `MemoryAdapter`-based Adapters are **ALWAYS** mounted
     */
    is_mounted(): boolean {
        return true;
    }

    /**
     * Mounts the Adapter if currently unmounted
     *
     * > **NOTE**: `MemoryAdapter`-based Adapters are **ALWAYS** mounted
     */
    async mount(): Promise<void> {}

    /**
     * Mounts the Adapter if currently mounted
     *
     * > **NOTE**: `MemoryAdapter`-based Adapters are **ALWAYS** mounted
     */
    async unmount(): Promise<void> {}
}
