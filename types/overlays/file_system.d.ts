import { BaseAdapter, IURLObject } from "../adapters/base_adapter";
import { NODE_TYPES } from "../util/constants";
import { IEvent } from "../util/event";
import { IJSONReplacer, IJSONReviver, IJSONValue } from "../util/types";
import { BaseOverlay } from "./base_overlay";
/**
 * ...
 *
 * @internal
 */
declare type IScopeJoin = (part: string) => string;
/**
 * Represents a scope of the File System that should prefix all operation paths
 */
export declare type IFileSystemScope = IScopeJoin | string;
/**
 * Represents the struct returned to queries and events as a result
 */
export interface IFileSystemEntryResult {
    /**
     * Represents that the File System Entry is a Directory
     */
    is_directory: boolean;
    /**
     * Represents that the File System Entry is a File
     */
    is_file: boolean;
    /**
     * Represents the associated path of the File System Entry
     */
    path: string;
}
/**
 * Represents the metadata of a File System Entry
 */
export interface IFileSystemEntryStats {
    /**
     * Represents a timestamp in milliseconds since UNIX Epoch when the File System Entry was created
     */
    ctime: number;
    /**
     * Represents that the File System Entry is a Directory
     */
    is_directory: boolean;
    /**
     * Represents that the File System Entry is a File
     */
    is_file: boolean;
    /**
     * Represents the associated path of the File System Entry
     */
    path: string;
    /**
     * Represents a timestamp in milliseconds since UNIX Epoch when the File System Entry was last modified
     */
    mtime: number;
}
/**
 * Represents the options passable to [[FileSystemOverlay]]
 */
export interface IFileSystemOptions {
    /**
     * Represents the prefixing path scope the File System should operate at
     *
     * > **NOTE**: When used, [[IFileSystemQueryOptions.regex]] will not respect the configured value
     */
    scope: IFileSystemScope;
}
/**
 * Represents the options passable to [[FileSystemOverlay.read_directory]]
 */
export interface IFileSystemQueryOptions {
    /**
     * Represents to only query for File System Entries that are Directories
     */
    is_directory?: boolean;
    /**
     * Represents to only query for File System Entries that are Files
     */
    is_file?: boolean;
    /**
     * Represents a [Bash Shell Glob](https://en.wikipedia.org/wiki/Glob_(programming)) pattern to match paths with
     *
     * > **NOTE**: When using "Globstar", "**", the backend will search recursively for sub-paths, which may incur a performance penalty
     */
    glob?: string;
    /**
     * Represents a Directory path to read File System Entries from
     */
    path?: string;
    /**
     * Represents if the [[IFileSystemQueryOptions.path]] option should recursively search in child Directories too
     *
     * > **NOTE**: When set to `true`, the backend will search recursively for children, which may incur a performance penalty
     */
    recursive?: boolean;
    /**
     * Represents a [Regular Expression](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/RegExp) to match paths with
     *
     * > **NOTE**: When using the "Global Match" flag, "g", the backend will search recursively for children, which may incur a performance penalty
     */
    regex?: RegExp;
}
/**
 * Represents the options passable to [[FileSystemOverlay.remove_directory]]
 */
export interface IFileSystemRemoveOptions {
    /**
     * Represents if children of the File System Directory should be removed as well
     *
     * > **NOTE**: If set to `false`, the dispatch will fail if sub-paths are found
     */
    recursive?: boolean;
}
/**
 * Represents the event details dispatched to subscribers via [[FileSystemOverlay.watch_directory]] / [[FileSystemOverlay.watch_file]]
 */
export interface IFileSystemWatchEvent {
    /**
     * Represents what method was used to create / update the Directory / File
     */
    change: FILE_SYSTEM_CHANGES;
    /**
     * Represents the path of the Directory / File that was created / updated
     */
    path: string;
    /**
     * Represents the type of Directory / File that was created / updated
     */
    type: NODE_TYPES;
}
/**
 * Represents the options passable to [[FileSystemOverlay.watch_directory]]
 */
export interface IFileSystemWatchOptions {
    /**
     * Represents if watcher should recursively watch for changes in child Directories too
     *
     * > **NOTE**: When set to `true`, the backend will watch recursively for children, which may incur a performance penalty
     */
    recursive?: boolean;
}
/**
 * Represents that can be applied to a Directory / File on the File System
 */
export declare enum FILE_SYSTEM_CHANGES {
    /**
     * Represents when a Directory / File was created
     */
    created = "CHANGE_CREATED",
    /**
     * Represents when a Directory / File was removed
     */
    removed = "CHANGE_REMOVED",
    /**
     * Represents when a Directory / File had its contents updated
     */
    updated = "CHANGE_UPDATED"
}
/**
 * Represents a URIStorage Overlay that treats the configured Adapter as a psuedo File System
 */
export declare class FileSystemOverlay extends BaseOverlay {
    /**
     * Represents the join function used for prefixing paths with the scope
     *
     * @internal
     */
    scope: IScopeJoin;
    /**
     * Represents the standardized options passed into the constructor
     */
    options: IFileSystemOptions;
    constructor(adapter: BaseAdapter, options?: Partial<IFileSystemOptions>);
    /**
     * Returns a new [[FileSystemOverlay]] instance scoped to the given `path`
     * @param path
     */
    create_scope(path: string): FileSystemOverlay;
    /**
     * Returns a embedable URL representing a File in the File System
     *
     * > **NOTE**: Will not work with if the configured Adapter's [[BaseAdapter.can_hotlink]] is `false`
     *
     * @param file_path
     */
    create_url_object(file_path: string): Promise<IURLObject>;
    /**
     * Creates a new Directory in the File System
     * @param directory_path
     */
    create_directory(directory_path: string): Promise<void>;
    /**
     * Returns if a given Entry exists on the File System
     * @param path
     */
    exists(path: string): Promise<boolean>;
    /**
     * Returns the File System metadata about a given Entry
     * @param path
     */
    get_stats(path: string): Promise<IFileSystemEntryStats>;
    /**
     * Returns entries queried from the File System, with optional filters
     * @param options
     */
    read_directory(options?: IFileSystemQueryOptions): Promise<IFileSystemEntryResult[]>;
    /**
     * Returns a `Uint8Array` a File in the File System
     * @param file_path
     */
    read_file(file_path: string): Promise<Uint8Array>;
    /**
     * Removes a Directory from the File System
     *
     * > **NOTE**: If [[IFileSystemRemoveOptions.recursive]] to `false`, the dispatch will fail if sub-paths are found
     *
     * @param directory_path
     * @param options
     */
    remove_directory(directory_path: string, options?: IFileSystemRemoveOptions): Promise<boolean>;
    /**
     * Removes a File from the File System
     * @param file_path
     */
    remove_file(file_path: string): Promise<void>;
    /**
     * Watches a Directory for any changes on the File System
     * @param directory_path
     */
    watch_directory(directory_path: string, options?: IFileSystemWatchOptions): Promise<IEvent<IFileSystemWatchEvent>>;
    /**
     * Watches a File for any changes on the File System
     * @param file_path
     */
    watch_file(file_path: string): Promise<IEvent<IFileSystemWatchEvent>>;
    /**
     * Writes a `Uint8Array` payload to a File. Creating a new File in the File System, if not previously made
     * @param file_path
     * @param payload
     */
    write_file(file_path: string, payload: Uint8Array): Promise<void>;
    /**
     * Returns parsed JSON read from the given `file_path`
     * @param file_path
     * @param reviver
     */
    read_file_json<T extends IJSONValue = IJSONValue>(file_path: string, reviver?: IJSONReviver): Promise<T>;
    /**
     * Returns UTF-8 text read from the given `file_path`
     * @param file_path
     */
    read_file_text(file_path: string): Promise<string>;
    /**
     * Writes to the given `file_path`, encoding `value` as JSON text
     * @param file_path
     * @param value
     * @param replacer
     * @param space
     */
    write_file_json<T extends IJSONValue = IJSONValue>(file_path: string, value: T, replacer?: IJSONReplacer, space?: number | string): Promise<void>;
    /**
     * Writes to the given `file_path`, encoding `text` as UTF-8 bytes
     * @param file_path
     * @param text
     */
    write_file_text(file_path: string, text: string): Promise<void>;
}
export {};
