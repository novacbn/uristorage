import type { IURLObject } from "../adapters";
import type { IFileSystemEntryResult, IFileSystemEntryStats, IFileSystemQueryOptions, IFileSystemRemoveOptions, IFileSystemWatchEvent, IFileSystemWatchOptions } from "../overlays/file_system";
import { FileSystemOverlay } from "../overlays/file_system";
import type { IEvent } from "../util/event";
import type { IJSONReplacer, IJSONReviver, IJSONValue } from "../util/types";
import type { IRegistryNode } from "./storage";
import { StorageRegistry } from "./storage";
/**
 * Represents a Node that contains information about a registered [[FileSystemOverlay]] instance
 */
export interface IFileSystemRegistryNode extends IRegistryNode<FileSystemOverlay> {
}
/**
 * Represents a [[StorageRegistry]] that mimics the API of a [[FileSystemOverlay]] instance, resolving all
 * path-based operations via URI (`my-namespace://path/to/file.txt`) parsing. Using the URI protocol as the
 * namespace to lookup, and the URI pathname as the directory / file path
 */
export declare class FileSystemRegistry extends StorageRegistry<FileSystemOverlay, IFileSystemRegistryNode> {
    /**
     * ...
     *
     * @internal
     *
     * @param node
     */
    clone: (node: IFileSystemRegistryNode) => IFileSystemRegistryNode;
    /**
     * Returns a embedable URL representing a File in the File System
     *
     * > **NOTE**: Will not work with if the configured Adapter's [[BaseAdapter.can_hotlink]] is `false`
     *
     * @param uri
     */
    create_url_object(uri: string): Promise<IURLObject>;
    /**
     * Creates a new Directory in the File System
     * @param uri
     */
    create_directory(uri: string): Promise<void>;
    /**
     * Returns if a given Entry exists on the File System
     * @param uri
     */
    exists(uri: string): Promise<boolean>;
    /**
     * Returns the File System metadata about a given Entry
     * @param uri
     */
    get_stats(uri: string): Promise<IFileSystemEntryStats>;
    /**
     * Returns entries queried from the File System, with optional filters
     * @param namespace
     * @param options
     */
    read_directory(namespace: string, options?: IFileSystemQueryOptions): Promise<IFileSystemEntryResult[]>;
    /**
     * Returns a `Uint8Array` a File in the File System
     * @param uri
     */
    read_file(uri: string): Promise<Uint8Array>;
    /**
     * Removes a Directory from the File System
     *
     * > **NOTE**: If [[IFileSystemRemoveOptions.recursive]] to `false`, the dispatch will fail if sub-paths are found
     *
     * @param uri
     * @param options
     */
    remove_directory(uri: string, options?: IFileSystemRemoveOptions): Promise<boolean>;
    /**
     * Removes a File from the File System
     * @param uri
     */
    remove_file(uri: string): Promise<void>;
    /**
     * Watches a Directory for any changes on the File System
     * @param uri
     */
    watch_directory(uri: string, options?: IFileSystemWatchOptions): Promise<IEvent<IFileSystemWatchEvent>>;
    /**
     * Watches a File for any changes on the File System
     * @param uri
     */
    watch_file(uri: string): Promise<IEvent<IFileSystemWatchEvent>>;
    /**
     * Writes a `Uint8Array` payload to a File. Creating a new File in the File System, if not previously made
     * @param uri
     * @param payload
     */
    write_file(uri: string, payload: Uint8Array): Promise<void>;
    /**
     * Returns parsed JSON read from the given `uri`
     * @param uri
     * @param reviver
     */
    read_file_json<T extends IJSONValue = IJSONValue>(uri: string, reviver?: IJSONReviver): Promise<T>;
    /**
     * Returns UTF-8 text read from the given `uri`
     * @param uri
     */
    read_file_text(uri: string): Promise<string>;
    /**
     * Writes to the given `uri`, encoding `value` as JSON text
     * @param uri
     * @param value
     * @param replacer
     * @param space
     */
    write_file_json<T extends IJSONValue = IJSONValue>(uri: string, value: T, replacer?: IJSONReplacer, space?: number | string): Promise<void>;
    /**
     * Writes to the given `uri`, encoding `text` as UTF-8 bytes
     * @param uri
     * @param text
     */
    write_file_text(uri: string, text: string): Promise<void>;
}
