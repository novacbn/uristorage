import {BaseAdapter} from "./adapters/base_adapter";
import {BaseOverlay} from "./overlays/base_overlay";

import {event} from "./util/event";
import {ImmutableMap} from "./util/map";

// TODO: Documentation

export type IStorage = BaseAdapter | BaseOverlay;

export interface IRegistryNode<T extends IStorage> {
    storage: T;
}

export interface IRegistryResolveResult {
    namespace: string;

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
        const {storage} = node;

        return {storage};
    };

    clear(): void {
        const nodes = this.entries();
        for (const [namespace, node] of nodes) {
            const {storage} = node;

            this.EVENT_UNREGISTERED.dispatch({namespace, storage});
        }

        super.clear();
    }

    delete(namespace: string): boolean {
        const node = this.get(namespace);
        const deleted = super.delete(namespace);

        if (deleted && node) {
            this.EVENT_UNREGISTERED.dispatch({namespace, storage: node.storage});
        }

        return deleted;
    }

    resolve(uri: string): (V & IRegistryResolveResult) | undefined {
        let url: URL;
        try {
            url = new URL(uri);
        } catch (err) {
            return undefined;
        }

        const namespace = url.protocol.slice(0, -1);
        const node = this.get(namespace);
        if (!node) return undefined;

        return {...node, namespace, path: url.pathname};
    }

    set(namespace: string, node: V): this {
        const {storage} = node;
        super.set(namespace, {...node, namespace});

        storage.EVENT_MOUNTED.subscribe(() => this.EVENT_MOUNTED.dispatch({namespace, storage}));

        storage.EVENT_UNMOUNTED.subscribe(() =>
            this.EVENT_UNMOUNTED.dispatch({namespace, storage})
        );

        this.EVENT_REGISTERED.dispatch({namespace, storage});
        return this;
    }
}
