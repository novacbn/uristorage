import {BaseAdapter} from "../adapters/base_adapter";
import {BaseOverlay} from "../overlays/base_overlay";

import {event} from "../util/event";
import {ImmutableMap} from "../util/map";

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

    clone = (node: V): any => {
        const {namespace, storage} = node;

        return {namespace, storage};
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

        const {storage} = node;

        if (storage.is_mounted()) storage.unmount();
        super.delete(namespace);

        this.EVENT_UNREGISTERED.dispatch({namespace, storage: node.storage});
        return this;
    }

    resolve(uri: string): (V & IRegistryResolveResult) | null {
        let url: URL;
        try {
            url = new URL(uri);
        } catch (err) {
            return null;
        }

        const namespace = url.protocol.slice(0, -1);
        const node = this.get(namespace);
        if (!node) return null;

        return {...node, path: url.pathname};
    }
}
