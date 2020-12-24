import {BaseAdapter} from "../adapters/base_adapter";
import {BaseOverlay} from "../overlays/base_overlay";

import {event} from "../util/event";
import {ImmutableMap} from "../util/map";
import {REGEX_TRAILING_SLASH, normalize} from "../util/path";

// TODO: Documentation

export type IStorage = BaseAdapter | BaseOverlay;

export interface IRegistryNode<T extends IStorage> {
    namespace: string;

    storage: T;
}

export interface IRegistryResolveResult {
    path: string;
}

export interface IRegistryMountEvent<T extends IStorage> {
    namespace: string;

    storage: T;
}

export interface IRegistryRegisterEvent<T extends IStorage> {
    namespace: string;

    storage: T;
}

function get_namespace(url: URL): string {
    const {protocol} = url;

    return protocol.replace(REGEX_TRAILING_SLASH, "").slice(0, -1);
}

function get_path(url: URL): string {
    const {pathname} = url;

    return normalize(pathname);
}

export class StorageRegistry<
    T extends IStorage = IStorage,
    V extends IRegistryNode<T> = IRegistryNode<T>
> extends ImmutableMap<V> {
    EVENT_MOUNTED = event<IRegistryMountEvent<T>>();

    EVENT_REGISTERED = event<IRegistryRegisterEvent<T>>();

    EVENT_UNMOUNTED = event<IRegistryMountEvent<T>>();

    EVENT_UNREGISTERED = event<IRegistryRegisterEvent<T>>();

    constructor() {
        super();
    }

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
