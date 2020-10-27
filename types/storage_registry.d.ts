import { BaseAdapter } from "./adapters/base_adapter";
import { BaseOverlay } from "./overlays/base_overlay";
import { ImmutableMap } from "./util/map";
export declare type IStorage = BaseAdapter | BaseOverlay;
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
export declare class StorageRegistry<T extends IStorage = IStorage, V extends IRegistryNode<T> = IRegistryNode<T>> extends ImmutableMap<V> {
    EVENT_MOUNTED: import("./util/event").IEvent<IRegistryMountEvent<T>>;
    EVENT_REGISTERED: import("./util/event").IEvent<IRegistryRegisterEvent<T>>;
    EVENT_UNMOUNTED: import("./util/event").IEvent<IRegistryMountEvent<T>>;
    EVENT_UNREGISTERED: import("./util/event").IEvent<IRegistryRegisterEvent<T>>;
    constructor();
    clone: (node: V) => any;
    clear(): void;
    delete(namespace: string): boolean;
    resolve(uri: string): (V & IRegistryResolveResult) | undefined;
    set(namespace: string, node: V): this;
}
