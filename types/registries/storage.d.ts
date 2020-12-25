import { BaseAdapter } from "../adapters/base_adapter";
import { BaseOverlay } from "../overlays/base_overlay";
import { ImmutableMap } from "../util/map";
/**
 * Represents instance types acceptable to be registered with a [[StorageRegistry]]
 * instance
 */
export declare type IStorage = BaseAdapter | BaseOverlay;
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
 * Represents the base common API all storage registries implement. Accepting instances
 * of [[BaseAdapter]] or [[BaseOverlay]] for registeration and lookup
 */
export declare class StorageRegistry<T extends IStorage = IStorage, V extends IRegistryNode<T> = IRegistryNode<T>> extends ImmutableMap<V> {
    /**
     * Event that dispatches whenever a registered [[IStorage]] instance is mounted
     */
    EVENT_MOUNTED: import("../util/event").IEvent<IRegistryMountEvent<T>>;
    /**
     * Event that dispatches whenever a new [[IStorage]] instance is registered
     */
    EVENT_REGISTERED: import("../util/event").IEvent<IRegistryRegisterEvent<T>>;
    /**
     * Event that dispatches whenever a registered [[IStorage]] instance is unmounted
     */
    EVENT_UNMOUNTED: import("../util/event").IEvent<IRegistryMountEvent<T>>;
    /**
     * Event that dispatches whenever a new [[IStorage]] instance is unregistered
     */
    EVENT_UNREGISTERED: import("../util/event").IEvent<IRegistryRegisterEvent<T>>;
    constructor();
    /**
     * ...
     *
     * @internal
     *
     * @param node
     */
    clone: (node: V) => V;
    clear(): void;
    /**
     * Registers an [[BaseAdapter]] or [[BaseOverlay]] instance with the Registry
     * @param namespace
     * @param storage
     */
    register(namespace: string, storage: T): this | Promise<this>;
    /**
     * Unregisters a previously [[BaseAdapter]] or [[BaseOverlay]] instance from the Registry
     * @param namespace
     * @param storage
     */
    unregister(namespace: string): this | Promise<this>;
    /**
     * Returns the resolved namespace and path of a registered [[BaseAdapter]] or [[BaseOverlay]] instance,
     * returning `null` if none found or the URI could not be parsed
     * @param uri
     */
    resolve(uri: string | URL): (V & IRegistryResolveResult) | null;
}
