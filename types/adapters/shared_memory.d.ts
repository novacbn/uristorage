import { NODE_TYPES } from "../util/constants";
import { IEvent } from "../util/event";
import { ImmutableMap } from "../util/map";
import { IBaseAdapterOptions, INode, IQueryOptions, IQueryResult, IURLObject, IWatchEvent, IWatchOptions, BaseAdapter } from "./base_adapter";
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
declare class NodeMap extends ImmutableMap<IMemoryNode> {
    /**
     * Event that dispatches whenever there is a creation / update in the in-memory storage
     */
    EVENT_WATCH: IEvent<IWatchEvent>;
    clone: (node: IMemoryNode) => IMemoryNode;
    delete(key: string): boolean;
    put(key: string, value: Omit<IMemoryNode, "path">): this;
    update(key: string, value: Partial<IMemoryNode>): this;
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
 * Represents a URIStorage Adapter that persists all data into volatile memory
 *
 * > **NOTE**: As this Adapter backend persists data into memory, it is not shared between tabs, pages, nor browsing sessions
 */
export declare class MemoryAdapter extends BaseAdapter {
    static can_hotlink: boolean;
    static can_watch: boolean;
    static is_available: boolean;
    /**
     * Represents the in-memory storage for Nodes
     */
    storage: NodeMap;
    options: IMemoryOptions;
    constructor(options?: Partial<IMemoryOptions>);
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
    /**
     * Returns if the Adapter is currently mounted
     *
     * > **NOTE**: `MemoryAdapter`-based Adapters are **ALWAYS** mounted
     */
    is_mounted(): boolean;
    /**
     * Mounts the Adapter if currently unmounted
     *
     * > **NOTE**: `MemoryAdapter`-based Adapters are **ALWAYS** mounted
     */
    mount(): Promise<void>;
    /**
     * Mounts the Adapter if currently mounted
     *
     * > **NOTE**: `MemoryAdapter`-based Adapters are **ALWAYS** mounted
     */
    unmount(): Promise<void>;
}
export {};
