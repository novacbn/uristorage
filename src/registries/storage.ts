import {BaseAdapter} from "../adapters/base_adapter";
import {BaseOverlay} from "../overlays/base_overlay";

import {event} from "../util/event";
import {ImmutableMap} from "../util/map";
import {REGEX_TRAILING_SLASH, normalize} from "../util/path";

/**
 * Represents instance types acceptable to be registered with a [[StorageRegistry]]
 * instance
 */
export type IStorage = BaseAdapter | BaseOverlay;

/**
 * Represents a Node that contains information about a registered [[IStorage]] instance
 */
export interface IRegistryNode<T extends IStorage> {
    namespace: string;

    storage: T;
}

/**
 * Represents the extra metadata returned from [[StorageRegistry.resolve]]
 */
export interface IRegistryResolveResult {
    path: string;
}

/**
 * Represents the event details dispatched to subscribers via [[StorageRegistry.EVENT_MOUNTED]] / [[StorageRegistry.EVENT_UNMOUNTED]]
 */
export interface IRegistryMountEvent<T extends IStorage> {
    namespace: string;

    storage: T;
}

/**
 * Represents the event details dispatched to subscribers via [[StorageRegistry.EVENT_REGISTERED]] / [[StorageRegistry.EVENT_UNREGISTERED]]
 */
export interface IRegistryRegisterEvent<T extends IStorage> {
    namespace: string;

    storage: T;
}

/**
 * ...
 *
 * @internal
 *
 * @param url
 */
function get_namespace(url: URL): string {
    const {protocol} = url;

    return protocol.replace(REGEX_TRAILING_SLASH, "").slice(0, -1);
}

/**
 * ...
 *
 * @internal
 *
 * @param url
 */
function get_path(url: URL): string {
    const {pathname} = url;

    return normalize(pathname);
}

/**
 * Represents the base common API all storage registries implement. Accepting instances
 * of [[BaseAdapter]] or [[BaseOverlay]] for registeration and lookup
 */
export class StorageRegistry<
    T extends IStorage = IStorage,
    V extends IRegistryNode<T> = IRegistryNode<T>
> extends ImmutableMap<V> {
    /**
     * Event that dispatches whenever a registered [[IStorage]] instance is mounted
     */
    EVENT_MOUNTED = event<IRegistryMountEvent<T>>();

    /**
     * Event that dispatches whenever a new [[IStorage]] instance is registered
     */
    EVENT_REGISTERED = event<IRegistryRegisterEvent<T>>();

    /**
     * Event that dispatches whenever a registered [[IStorage]] instance is unmounted
     */
    EVENT_UNMOUNTED = event<IRegistryMountEvent<T>>();

    /**
     * Event that dispatches whenever a new [[IStorage]] instance is unregistered
     */
    EVENT_UNREGISTERED = event<IRegistryRegisterEvent<T>>();

    constructor() {
        super();
    }

    /**
     * ...
     *
     * @internal
     *
     * @param node
     */
    clone = (node: V): V => {
        const {namespace, storage} = node;

        return {namespace, storage} as V;
    };

    clear(): void {
        const nodes = this.entries();
        for (const [namespace, node] of nodes) {
            const {storage} = node;

            this.EVENT_UNREGISTERED.dispatch({namespace, storage});
        }

        super.clear();
    }

    /**
     * Registers an [[BaseAdapter]] or [[BaseOverlay]] instance with the Registry
     * @param namespace
     * @param storage
     */
    register(namespace: string, storage: T): this | Promise<this> {
        if (this.has(namespace)) {
            throw new Error(
                `bad argument #0 to 'register' (namespace '${namespace}' already registered)`
            );
        }

        // @ts-ignore
        const node: V = {namespace, storage};
        this.set(namespace, node);

        storage.EVENT_MOUNTED.subscribe(() => this.EVENT_MOUNTED.dispatch({namespace, storage}));
        storage.EVENT_UNMOUNTED.subscribe(() =>
            this.EVENT_UNMOUNTED.dispatch({namespace, storage})
        );

        this.EVENT_REGISTERED.dispatch({namespace, storage});
        return this;
    }

    /**
     * Unregisters a previously [[BaseAdapter]] or [[BaseOverlay]] instance from the Registry
     * @param namespace
     * @param storage
     */
    unregister(namespace: string): this | Promise<this> {
        const node = this.get(namespace);
        if (!node) {
            throw new Error(
                `bad argument #0 to 'unregister' (namespace '${namespace}' not registered)`
            );
        }

        this.delete(namespace);
        this.EVENT_UNREGISTERED.dispatch({namespace, storage: node.storage});
        return this;
    }

    /**
     * Returns the resolved namespace and path of a registered [[BaseAdapter]] or [[BaseOverlay]] instance,
     * returning `null` if none found or the URI could not be parsed
     * @param uri
     */
    resolve(uri: string | URL): (V & IRegistryResolveResult) | null {
        if (typeof uri === "string") {
            try {
                uri = new URL(uri);
            } catch (err) {
                return null;
            }
        }

        const namespace = get_namespace(uri);
        const path = get_path(uri);

        const node = this.get(namespace);
        if (!node) return null;

        return {...node, path};
    }
}
