import type {IURLObject} from "../adapters";

import type {
    IFileSystemEntryResult,
    IFileSystemEntryStats,
    IFileSystemQueryOptions,
    IFileSystemRemoveOptions,
    IFileSystemWatchEvent,
    IFileSystemWatchOptions,
} from "../overlays/file_system";
import {FileSystemOverlay} from "../overlays/file_system";

import type {IEvent} from "../util/event";

import type {IJSONReplacer, IJSONReviver, IJSONValue} from "../util/types";

import type {IRegistryNode} from "./storage";
import {StorageRegistry} from "./storage";

/**
 * Represents a Node that contains information about a registered [[FileSystemOverlay]] instance
 */
export interface IFileSystemRegistryNode extends IRegistryNode<FileSystemOverlay> {}

/**
 * Represents a [[StorageRegistry]] that mimics the API of a [[FileSystemOverlay]] instance, resolving all
 * path-based operations via URI (`my-namespace://path/to/file.txt`) parsing. Using the URI protocol as the
 * namespace to lookup, and the URI pathname as the directory / file path
 */
export class FileSystemRegistry extends StorageRegistry<
    FileSystemOverlay,
    IFileSystemRegistryNode
> {
    /**
     * ...
     *
     * @internal
     *
     * @param node
     */
    clone = (node: IFileSystemRegistryNode): IFileSystemRegistryNode => {
        const {namespace, storage} = node;

        return {namespace, storage};
    };

    /**
     * Returns a embedable URL representing a File in the File System
     *
     * > **NOTE**: Will not work with if the configured Adapter's [[BaseAdapter.can_hotlink]] is `false`
     *
     * @param uri
     */
    create_url_object(uri: string): Promise<IURLObject> {
        const result = this.resolve(uri);
        if (!result) {
            throw new Error(`bad argument #0 to 'create_url_object' (could not resolve '${uri}')`);
        }

        const {path, storage} = result;
        return storage.create_url_object(path);
    }

    /**
     * Creates a new Directory in the File System
     * @param uri
     */
    create_directory(uri: string): Promise<void> {
        const result = this.resolve(uri);
        if (!result) {
            throw new Error(`bad argument #0 to 'create_directory' (could not resolve '${uri}')`);
        }

        const {path, storage} = result;
        return storage.create_directory(path);
    }

    /**
     * Returns if a given Entry exists on the File System
     * @param uri
     */
    exists(uri: string): Promise<boolean> {
        const result = this.resolve(uri);
        if (!result) {
            throw new Error(`bad argument #0 to 'exists' (could not resolve '${uri}')`);
        }

        const {path, storage} = result;
        return storage.exists(path);
    }

    /**
     * Returns the File System metadata about a given Entry
     * @param uri
     */
    get_stats(uri: string): Promise<IFileSystemEntryStats> {
        const result = this.resolve(uri);
        if (!result) {
            throw new Error(`bad argument #0 to 'get_stats' (could not resolve '${uri}')`);
        }

        const {path, storage} = result;
        return storage.get_stats(path);
    }

    /**
     * Returns entries queried from the File System, with optional filters
     * @param namespace
     * @param options
     */
    read_directory(
        namespace: string,
        options: IFileSystemQueryOptions = {}
    ): Promise<IFileSystemEntryResult[]> {
        const node = this.get(namespace);
        if (!node) {
            throw new Error(
                `bad argument #0 to 'read_directory' (could not resolve '${namespace}')`
            );
        }

        const {storage} = node;
        return storage.read_directory(options);
    }

    /**
     * Returns a `Uint8Array` a File in the File System
     * @param uri
     */
    read_file(uri: string): Promise<Uint8Array> {
        const result = this.resolve(uri);
        if (!result) {
            throw new Error(`bad argument #0 to 'read_file' (could not resolve '${uri}')`);
        }

        const {path, storage} = result;
        return storage.read_file(path);
    }

    /**
     * Removes a Directory from the File System
     *
     * > **NOTE**: If [[IFileSystemRemoveOptions.recursive]] to `false`, the dispatch will fail if sub-paths are found
     *
     * @param uri
     * @param options
     */
    remove_directory(uri: string, options: IFileSystemRemoveOptions = {}): Promise<boolean> {
        const result = this.resolve(uri);
        if (!result) {
            throw new Error(`bad argument #0 to 'remove_directory' (could not resolve '${uri}')`);
        }

        const {path, storage} = result;
        return storage.remove_directory(path, options);
    }

    /**
     * Removes a File from the File System
     * @param uri
     */
    remove_file(uri: string): Promise<void> {
        const result = this.resolve(uri);
        if (!result) {
            throw new Error(`bad argument #0 to 'remove_file' (could not resolve '${uri}')`);
        }

        const {path, storage} = result;
        return storage.remove_file(path);
    }

    /**
     * Watches a Directory for any changes on the File System
     * @param uri
     */
    watch_directory(
        uri: string,
        options: IFileSystemWatchOptions = {}
    ): Promise<IEvent<IFileSystemWatchEvent>> {
        const result = this.resolve(uri);
        if (!result) {
            throw new Error(`bad argument #0 to 'watch_directory' (could not resolve '${uri}')`);
        }

        const {path, storage} = result;
        return storage.watch_directory(path, options);
    }

    /**
     * Watches a File for any changes on the File System
     * @param uri
     */
    watch_file(uri: string): Promise<IEvent<IFileSystemWatchEvent>> {
        const result = this.resolve(uri);
        if (!result) {
            throw new Error(`bad argument #0 to 'watch_file' (could not resolve '${uri}')`);
        }

        const {path, storage} = result;
        return storage.watch_file(path);
    }

    /**
     * Writes a `Uint8Array` payload to a File. Creating a new File in the File System, if not previously made
     * @param uri
     * @param payload
     */
    write_file(uri: string, payload: Uint8Array): Promise<void> {
        const result = this.resolve(uri);
        if (!result) {
            throw new Error(`bad argument #0 to 'write_file' (could not resolve '${uri}')`);
        }

        const {path, storage} = result;
        return storage.write_file(path, payload);
    }

    /**
     * Returns parsed JSON read from the given `uri`
     * @param uri
     * @param reviver
     */
    read_file_json<T extends IJSONValue = IJSONValue>(
        uri: string,
        reviver?: IJSONReviver
    ): Promise<T> {
        const result = this.resolve(uri);
        if (!result) {
            throw new Error(`bad argument #0 to 'read_file_json' (could not resolve '${uri}')`);
        }

        const {path, storage} = result;
        return storage.read_file_json(path, reviver);
    }

    /**
     * Returns UTF-8 text read from the given `uri`
     * @param uri
     */
    read_file_text(uri: string): Promise<string> {
        const result = this.resolve(uri);
        if (!result) {
            throw new Error(`bad argument #0 to 'read_file_text' (could not resolve '${uri}')`);
        }

        const {path, storage} = result;
        return storage.read_file_text(path);
    }

    /**
     * Writes to the given `uri`, encoding `value` as JSON text
     * @param uri
     * @param value
     * @param replacer
     * @param space
     */
    write_file_json<T extends IJSONValue = IJSONValue>(
        uri: string,
        value: T,
        replacer?: IJSONReplacer,
        space?: number | string
    ): Promise<void> {
        const result = this.resolve(uri);
        if (!result) {
            throw new Error(`bad argument #0 to 'write_file_json' (could not resolve '${uri}')`);
        }

        const {path, storage} = result;
        return storage.write_file_json(path, value, replacer, space);
    }

    /**
     * Writes to the given `uri`, encoding `text` as UTF-8 bytes
     * @param uri
     * @param text
     */
    write_file_text(uri: string, text: string): Promise<void> {
        const result = this.resolve(uri);
        if (!result) {
            throw new Error(`bad argument #0 to 'write_file_text' (could not resolve '${uri}')`);
        }

        const {path, storage} = result;
        return storage.write_file_text(path, text);
    }
}
