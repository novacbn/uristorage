import Dexie, {DexieEvent} from "dexie";

import "dexie-observable";
import {IDatabaseChange} from "dexie-observable/api";

import {DEFAULT_MIME_TYPE, NODE_CHANGES, NODE_TYPES} from "../util/constants";
import {get_epoch_timestamp} from "../util/datetime";
import {IEvent, event} from "../util/event";
import {make_glob} from "../util/glob";
import {get_mime_type} from "../util/mime_types";
import {join, normalize} from "../util/path";

import {
    IBaseAdapterOptions,
    INode,
    IQueryOptions,
    IQueryResult,
    IWatchEvent,
    IURLObject,
    BaseAdapter,
    create_url_object,
    IWatchOptions,
    hook_watcher,
} from "./base_adapter";

const INDEXEDDB_VERSION = 1;

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
class IndexedDBStorage extends Dexie {
    EVENT_WATCH: IEvent<IWatchEvent>;

    /**
     * Represents the database table that stores persisted Nodes
     */
    nodes: Dexie.Table<IIndexedDBNode, string>;

    constructor(namespace = "default") {
        super("uristorage:" + namespace);

        this.version(INDEXEDDB_VERSION).stores({
            nodes: "&path, ctime, mime_type, mtime, type",
        });

        this.nodes = this.table("nodes");

        this.EVENT_WATCH = event((dispatch) => {
            function on_change(event: IDatabaseChange[]) {
                for (const change of event) {
                    // HACK: `DatabaseChangeType` from `dexie-observable` is a const expression
                    // enumeration. So we can't use it as a variable. Thus we need TypeScript to ignore
                    // errors about types it cannot determine
                    switch (change.type) {
                        case 1: // DatabaseChangeType.Create
                            dispatch({
                                change: NODE_CHANGES.created,
                                // @ts-ignore
                                path: change.obj.path,
                                // @ts-ignore
                                type: change.obj.type,
                            });

                            break;

                        case 3: // DatabaseChangeType.Delete
                            dispatch({
                                change: NODE_CHANGES.removed,
                                // @ts-ignore
                                path: change.oldObj.path,
                                // @ts-ignore
                                type: change.oldObj.path,
                            });

                            break;

                        case 2: // DatabaseChangeType.Update
                            // @ts-ignore
                            if (change.mods.payload) {
                                dispatch({
                                    change: NODE_CHANGES.attached,
                                    // @ts-ignore
                                    path: change.oldObj.path,
                                    // @ts-ignore
                                    type: change.oldObj.path,
                                });
                            } else {
                                dispatch({
                                    change: NODE_CHANGES.updated,
                                    // @ts-ignore
                                    path: change.oldObj.path,
                                    // @ts-ignore
                                    type: change.oldObj.path,
                                });
                            }

                            break;
                    }
                }
            }

            // HACK: Like above, the types for `dexie-observable` are meh. So
            // we need have TypeScript to ignore errors again

            // @ts-ignore
            const context = this.on("changes", on_change) as DexieEvent;
            return () => context.unsubscribe(on_change);
        });
    }
}

/**
 * Represents a URIStorage Adapter that persists all data into the Browser's [IndexedDB](https://developer.mozilla.org/en-US/docs/Web/API/IndexedDB_API)
 */
export class IndexedDBAdapter extends BaseAdapter {
    static can_hotlink = true;

    static can_watch = true;

    static is_available = !!(typeof window === "object" && window.indexedDB);

    static requires_mount = true;

    /**
     * Represents the IndexedDB storage for Nodes
     *
     * @internal
     */
    storage?: IndexedDBStorage;

    constructor(options: Partial<IBaseAdapterOptions> = {}) {
        super(options);
    }

    async create_url_object(path: string): Promise<IURLObject> {
        const {storage} = this;
        if (!storage) {
            throw new Error("bad dispatch to 'create_url_object' (database is not mounted)");
        }

        const uri = this.normalize(path);
        const node = await storage.nodes.get(uri);
        if (!node) {
            throw new Error(
                "bad argument #0 to 'create_url_object' (Node must be created before using 'create_url_object')"
            );
        }

        if (!node.payload) {
            throw new Error(
                "bad argument #0 to 'create_url_object' (Node payload must be created before using 'create_url_object')"
            );
        }

        const object = create_url_object(node.payload, node.mime_type);

        return {
            destroy: object.destroy,
            path: node.path,
            url: object.url,
        };
    }

    async get(path: string): Promise<INode | null> {
        const {storage} = this;
        if (!storage) {
            throw new Error("bad dispatch to 'get' (database is not mounted)");
        }

        const uri = this.normalize(path);
        const node = await storage.nodes.get(uri);
        if (!node) return null;

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
        if (!storage) {
            throw new Error("bad dispatch to 'put' (database is not mounted)");
        }

        const uri = this.normalize(path);
        const node = await storage.nodes.get(uri);

        const timestamp = get_epoch_timestamp();
        if (!mime_type) mime_type = get_mime_type(uri) || DEFAULT_MIME_TYPE;

        if (node) {
            await storage.nodes.update(node, {
                mtime: timestamp,
                mime_type,
                type,
            });
        } else {
            await storage.nodes.put({
                ctime: timestamp,
                mime_type,
                mtime: timestamp,
                path: uri,
                type,
            });
        }
    }

    async query(options: IQueryOptions = {}): Promise<IQueryResult[]> {
        // TODO: This is probably slow with tons and tons of entries... can
        // this be handled in a better way?
        //
        // The issue is that you can only have one `WhereClause` available at a
        // time. Not only that, but we need to support optional filters anyway
        const {storage} = this;
        if (!storage) {
            throw new Error("bad dispatch to 'query' (database is not mounted)");
        }

        const {path = {}, type} = options;
        let collection = storage.nodes.toCollection();

        if (type) {
            if (typeof type === "string") {
                collection = collection.filter((node) => node.type === type);
            } else collection = collection.filter((node) => type.includes(node.type));
        }

        if (path.glob) {
            const regex = make_glob(normalize(path.glob));

            collection = collection.filter((node) => regex.test(node.path));
        } else if (path.regex) {
            const {regex} = path;

            collection = collection.filter((node) => regex.test(node.path));
        } else {
            // TODO: Technically if the end-developer provides a `.path` member, they
            // can just pass a glob pattern. Should we sanitize?
            let {path: _path = "/"} = path;

            _path = path.recursive ? join(_path, "**") : join(_path, "*");
            const regex = make_glob(normalize(_path));

            collection = collection.filter((node) => regex.test(node.path));
        }

        const results = await collection.toArray();

        return results.map((node, index) => {
            const {path, type} = node;

            return {path, type};
        });
    }

    async read(path: string): Promise<Uint8Array | null> {
        const {storage} = this;
        if (!storage) {
            throw new Error("bad dispatch to 'get_payload' (database is not mounted)");
        }

        const uri = this.normalize(path);
        const node = await storage.nodes.get(uri);
        if (!node || !node.payload) return null;

        return node.payload;
    }

    async remove(path: string): Promise<boolean> {
        const {storage} = this;
        if (!storage) {
            throw new Error("bad dispatch to 'remove' (database is not mounted)");
        }

        const uri = this.normalize(path);
        const node = await storage.nodes.get(uri);
        if (!node) return false;

        storage.nodes.delete(uri);
        return true;
    }

    async watch(options: IWatchOptions = {}): Promise<IEvent<IWatchEvent>> {
        const {storage} = this;
        if (!storage) {
            throw new Error("bad dispatch to 'remove' (database is not mounted)");
        }

        return hook_watcher(storage.EVENT_WATCH, options);
    }

    async write(path: string, payload: Uint8Array): Promise<void> {
        const {storage} = this;
        if (!storage) {
            throw new Error("bad dispatch to 'attach' (database is not mounted)");
        }

        const uri = this.normalize(path);
        const node = await storage.nodes.get(uri);
        if (!node) {
            throw new Error(
                "bad argument #0 to 'attach' (Node must be created before using 'attach')"
            );
        }

        await storage.nodes.update(node, {
            payload,
            mtime: get_epoch_timestamp(),
        });
    }

    is_mounted(): boolean {
        return !!this.storage;
    }

    async mount(): Promise<void> {
        if (this.storage) {
            throw new Error("bad dispatch to 'mount' (database is already mounted)");
        }

        const {namespace} = this.options;
        const storage = new IndexedDBStorage(namespace);

        await storage.open();
        this.storage = storage;
    }

    async unmount(): Promise<void> {
        const {storage} = this;
        if (!storage) {
            throw new Error("bad dispatch to 'unmount' (database is not mounted)");
        }

        await storage.close();
        delete this.storage;
    }
}
