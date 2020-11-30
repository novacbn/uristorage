import {BaseAdapter, IQueryResult, IURLObject, IWatchEvent} from "../adapters/base_adapter";
import {NODE_CHANGES, NODE_TYPES} from "../util/constants";
import {decode_utf8, encode_utf8} from "../util/encoding";
import {IEvent, event} from "../util/event";
import {dirname, join, normalize} from "../util/path";
import {IJSONReplacer, IJSONReviver, IJSONTypes} from "../util/types";

import {BaseOverlay} from "./base_overlay";

/**
 * ...
 *
 * @internal
 */
type IScopeJoin = (part: string) => string;

/**
 * Represents a scope of the File System that should prefix all operation paths
 */
export type IFileSystemScope = IScopeJoin | string;

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
export enum FILE_SYSTEM_CHANGES {
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
    updated = "CHANGE_UPDATED",
}

/**
 * ...
 *
 * @internal
 */
const PATTERN_SEPARATOR_SEARCH = /\//g;

/**
 * ...
 *
 * @internal
 *
 * @param part
 */
const SCOPE_NOOP = (part: string) => part;

/**
 * ...
 *
 * @internal
 *
 * @param path
 */
function count_slashes(path: string): number {
    const matches = path.match(PATTERN_SEPARATOR_SEARCH);

    if (!matches) return 0;
    return matches.length;
}

function FileSystemOptions(options: Partial<IFileSystemOptions> = {}): IFileSystemOptions {
    let {scope = SCOPE_NOOP} = options;

    if (typeof scope === "string") {
        const prefix = normalize(scope);

        scope = (part) => join(prefix, part);
    }

    return {scope};
}

/**
 * Represents a URIStorage Overlay that treats the configured Adapter as a psuedo File System
 */
export class FileSystemOverlay extends BaseOverlay {
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

    constructor(adapter: BaseAdapter, options: Partial<IFileSystemOptions> = {}) {
        super(adapter);

        this.options = FileSystemOptions(options);
        this.scope = this.options.scope as IScopeJoin;
    }

    /**
     * Returns a new [[FileSystemOverlay]] instance scoped to the given `path`
     * @param path
     */
    create_scope(path: string): FileSystemOverlay {
        const filesystem = new FileSystemOverlay(this.adapter, {
            scope: this.scope(path),
        });

        return filesystem;
    }

    /**
     * Returns a embedable URL representing a File in the File System
     *
     * > **NOTE**: Will not work with if the configured Adapter's [[BaseAdapter.can_hotlink]] is `false`
     *
     * @param file_path
     */
    async create_url_object(file_path: string): Promise<IURLObject> {
        if (!this.has_feature("can_hotlink")) {
            throw new Error(
                "bad dispatch to 'create_url_object' (adapter does not support feature)"
            );
        }

        file_path = this.scope(file_path);

        const {adapter} = this;
        const node = await adapter.get(file_path);

        if (!node) {
            throw new Error("bad argument #0 to 'create_url_object' (file path not found)");
        } else if (node.type !== NODE_TYPES.file) {
            throw new Error("bad argument #0 to 'create_url_object' (file path is not a file)");
        }

        return adapter.create_url_object(file_path);
    }

    /**
     * Creates a new Directory in the File System
     * @param directory_path
     */
    async create_directory(directory_path: string): Promise<void> {
        if (this.has_feature("is_readonly")) {
            throw new Error(
                "bad dispatch to 'create_directory' (adapter does not support feature)"
            );
        }

        const {adapter} = this;

        directory_path = this.scope(directory_path);
        directory_path = normalize(directory_path);
        if (directory_path === "/") {
            throw new Error(
                "bad argument #0 to 'create_directory' (directory path is already a directory)"
            );
        }

        const node = await adapter.get(directory_path);
        if (node) {
            switch (node.type) {
                case NODE_TYPES.directory:
                    throw new Error(
                        "bad argument #0 to 'create_directory' (directory path is already a directory)"
                    );

                case NODE_TYPES.file:
                    throw new Error(
                        "bad argument #0 to 'create_directory' (directory path is already a file)"
                    );
            }
        }

        const parent_path = dirname(directory_path);
        if (parent_path !== "/") {
            const parent_node = await adapter.get(parent_path);
            if (!parent_node) {
                throw new Error(
                    "bad argument #0 to 'create_directory' (parent path does not exist)"
                );
            } else if (parent_node.type !== NODE_TYPES.directory) {
                throw new Error(
                    "bad argument #0 to 'create_directory' (parent path is not a directory)"
                );
            }
        }

        return adapter.put(directory_path, NODE_TYPES.directory);
    }

    /**
     * Returns if a given Entry exists on the File System
     * @param path
     */
    async exists(path: string): Promise<boolean> {
        path = this.scope(path);
        const node = await this.adapter.get(path);

        return !!node;
    }

    /**
     * Returns the File System metadata about a given Entry
     * @param path
     */
    async get_stats(path: string): Promise<IFileSystemEntryStats> {
        path = this.scope(path);
        const node = await this.adapter.get(path);
        if (!node) {
            throw new Error("bad argument #0 to 'get_stats' (path not found)");
        }

        return {
            ctime: node.ctime,
            path: node.path,
            mtime: node.mtime,

            is_directory: node.type === NODE_TYPES.directory,
            is_file: node.type === NODE_TYPES.file,
        };
    }

    /**
     * Returns entries queried from the File System, with optional filters
     * @param options
     */
    async read_directory(options: IFileSystemQueryOptions = {}): Promise<IFileSystemEntryResult[]> {
        const {adapter} = this;
        const {is_directory, is_file, glob, regex, path, recursive = false} = options;

        let type: NODE_TYPES | NODE_TYPES[];
        if (is_directory) type = NODE_TYPES.directory;
        else if (is_file) type = NODE_TYPES.file;
        else type = [NODE_TYPES.directory, NODE_TYPES.file];

        // TODO: Should we perform a sanity check for the `.type` parameter? Making
        // sure that end-developers can't pass non-File System appropriate types?

        let results: IQueryResult[];
        if (path || path === "") {
            let directory_path = this.scope(path);
            directory_path = normalize(directory_path);

            const node = await adapter.get(directory_path);

            if (directory_path !== "/") {
                if (!node) {
                    throw new Error(
                        "bad option 'IFileSystemQueryOptions.path' to 'read_directory' (directory path not found)"
                    );
                } else if (node.type !== NODE_TYPES.directory) {
                    throw new Error(
                        "bad option 'IFileSystemQueryOptions.path' to 'read_directory' (directory path is not a directory)"
                    );
                }
            }

            results = await adapter.query({
                type,
                path: {
                    recursive,
                    path: directory_path,
                },
            });
        } else if (glob) {
            results = await adapter.query({
                type,
                path: {
                    // NOTE: This **should** work, hopefully not missing any edge cases
                    glob: this.scope(glob),
                },
            });
        } else if (regex) {
            results = await adapter.query({
                type,
                path: {regex},
            });
        } else {
            results = await adapter.query({
                type,
                path: {
                    recursive,
                    path: this.scope("/"),
                },
            });
        }

        return results.map((result, index) => {
            const {path, type} = result;

            return {
                path,

                is_directory: type === NODE_TYPES.directory,
                is_file: type === NODE_TYPES.file,
            };
        });
    }

    /**
     * Returns a `Uint8Array` a File in the File System
     * @param file_path
     */
    async read_file(file_path: string): Promise<Uint8Array> {
        const {adapter} = this;
        file_path = this.scope(file_path);

        const node = await adapter.get(file_path);
        if (!node) {
            throw new Error("bad argument #0 to 'read_file' (file path not found)");
        } else if (node.type !== NODE_TYPES.file) {
            throw new Error("bad argument #0 to 'read_file' (file path is not a file)");
        }

        const payload = await adapter.read(file_path);
        return payload ? payload : new Uint8Array();
    }

    /**
     * Removes a Directory from the File System
     *
     * > **NOTE**: If [[IFileSystemRemoveOptions.recursive]] to `false`, the dispatch will fail if sub-paths are found
     *
     * @param directory_path
     * @param options
     */
    async remove_directory(
        directory_path: string,
        options: IFileSystemRemoveOptions = {}
    ): Promise<boolean> {
        if (this.has_feature("is_readonly")) {
            throw new Error(
                "bad dispatch to 'remove_directory' (adapter does not support feature)"
            );
        }

        const {adapter} = this;
        const {recursive = false} = options;

        directory_path = this.scope(directory_path);
        directory_path = normalize(directory_path);
        if (directory_path === "/") {
            throw new Error("bad argument #0 to 'remove_directory' (directory path not found)");
        }

        const node = await adapter.get(directory_path);
        if (!node) {
            throw new Error("bad argument #0 to 'remove_directory' (directory path not found)");
        } else if (node.type !== NODE_TYPES.directory) {
            throw new Error(
                "bad argument #0 to 'remove_directory' (directory path is not a directory)"
            );
        }

        // TODO: Should recursion functionality be handled by Adapters instead? That
        // way the underlying backends can be handled with more performant methodologies?
        const children_results = await adapter.query({
            path: {
                path: directory_path,
                recursive: true,
            },
        });

        if (children_results.length > 0) {
            if (recursive) {
                children_results.sort((a, b) => count_slashes(b.path) - count_slashes(a.path));

                const promises = children_results.map((result, index) => {
                    return adapter.remove(result.path);
                });

                await Promise.all(promises);
            } else {
                throw new Error(
                    "bad argument #0 to 'remove_directory' (directory contains children)"
                );
            }
        }

        return adapter.remove(directory_path);
    }

    /**
     * Removes a File from the File System
     * @param file_path
     */
    async remove_file(file_path: string): Promise<void> {
        if (this.has_feature("is_readonly")) {
            throw new Error("bad dispatch to 'remove_file' (adapter does not support feature)");
        }

        const {adapter} = this;
        file_path = this.scope(file_path);

        const node = await adapter.get(file_path);
        if (!node) {
            throw new Error("bad argument #0 to 'remove_file' (file path not found)");
        } else if (node.type !== NODE_TYPES.file) {
            throw new Error("bad argument #0 to 'remove_file' (file path is not a file)");
        }

        // TODO: We will never know the "exact" reason for this. Should
        // this be handled differently other than a generic error?
        const removed = await adapter.remove(file_path);
        if (!removed) {
            throw new Error("bad argument #0 to 'remove_file' (could not remove file path)");
        }
    }

    /**
     * Watches a Directory for any changes on the File System
     * @param directory_path
     */
    async watch_directory(
        directory_path: string,
        options: IFileSystemWatchOptions = {}
    ): Promise<IEvent<IFileSystemWatchEvent>> {
        if (!this.has_feature("can_watch")) {
            throw new Error("bad dispatch to 'watch_directory' (adapter does not support feature)");
        }

        const {adapter} = this;
        const {recursive} = options;

        directory_path = this.scope(directory_path);
        directory_path = normalize(directory_path);
        if (directory_path !== "/") {
            const node = await adapter.get(directory_path);

            if (!node) {
                throw new Error("bad argument #0 to 'watch_directory' (directory path not found)");
            } else if (node.type !== NODE_TYPES.directory) {
                throw new Error(
                    "bad argument #0 to 'watch_directory' (directory path is not a directory)"
                );
            }
        }

        const watcher = await adapter.watch({
            recursive,

            change: [NODE_CHANGES.attached, NODE_CHANGES.created, NODE_CHANGES.removed],
            inclusive: true,
            path: directory_path,
        });

        return event((dispatch) => {
            const destroy = watcher.subscribe((event) => {
                switch (event.change) {
                    case NODE_CHANGES.attached:
                        dispatch({
                            change: FILE_SYSTEM_CHANGES.updated,
                            path: event.path,
                            type: event.type,
                        });

                        break;

                    case NODE_CHANGES.created:
                        dispatch({
                            change: FILE_SYSTEM_CHANGES.created,
                            path: event.path,
                            type: event.type,
                        });

                        break;

                    case NODE_CHANGES.removed:
                        dispatch({
                            change: FILE_SYSTEM_CHANGES.removed,
                            path: event.path,
                            type: event.type,
                        });

                        break;
                }
            });

            return () => destroy();
        });
    }

    /**
     * Watches a File for any changes on the File System
     * @param file_path
     */
    async watch_file(file_path: string): Promise<IEvent<IFileSystemWatchEvent>> {
        if (!this.has_feature("can_watch")) {
            throw new Error("bad dispatch to 'watch_file' (adapter does not support feature)");
        }

        const {adapter} = this;
        file_path = this.scope(file_path);

        const node = await adapter.get(file_path);
        if (!node) {
            throw new Error("bad argument #0 to 'watch_file' (file path not found)");
        } else if (node.type !== NODE_TYPES.file) {
            throw new Error("bad argument #0 to 'watch_file' (file path is not a file)");
        }

        const watcher = await adapter.watch({
            change: [NODE_CHANGES.attached, NODE_CHANGES.removed],
            path: file_path,
        });

        return event((dispatch) => {
            async function update(event: IWatchEvent) {
                switch (event.change) {
                    case NODE_CHANGES.attached:
                        dispatch({
                            change: FILE_SYSTEM_CHANGES.updated,
                            path: event.path,
                            type: event.type,
                        });

                        break;

                    case NODE_CHANGES.removed:
                        dispatch({
                            change: FILE_SYSTEM_CHANGES.removed,
                            path: event.path,
                            type: event.type,
                        });

                        break;
                }
            }

            const destroy = watcher.subscribe(update);
            return () => destroy();
        });
    }

    /**
     * Writes a `Uint8Array` payload to a File. Creating a new File in the File System, if not previously made
     * @param file_path
     * @param payload
     */
    async write_file(file_path: string, payload: Uint8Array): Promise<void> {
        if (this.has_feature("is_readonly")) {
            throw new Error("bad dispatch to 'write_file' (adapter does not support feature)");
        }

        const {adapter} = this;

        file_path = this.scope(file_path);
        file_path = normalize(file_path);
        if (file_path === "/") {
            throw new Error("bad argument #0 to 'write_file' (file path is not a file)");
        }

        const node = await adapter.get(file_path);
        if (node && node.type !== NODE_TYPES.file) {
            throw new Error("bad argument #0 to 'write_file' (file path is not a file)");
        }

        const parent_path = dirname(file_path);
        if (parent_path !== "/") {
            const parent_node = await adapter.get(parent_path);
            if (!parent_node || parent_node.type !== NODE_TYPES.directory) {
                throw new Error("bad argument #0 to 'write_file' (parent path is not a directory)");
            }
        }

        await adapter.put(file_path, NODE_TYPES.file);
        return adapter.write(file_path, payload);
    }

    /**
     * Returns parsed JSON read from the given `file_path`
     * @param file_path
     * @param reviver
     */
    async read_file_json<T extends IJSONTypes = IJSONTypes>(
        file_path: string,
        reviver?: IJSONReviver
    ): Promise<T> {
        const encoded = await this.read_file_text(file_path);

        return JSON.parse(encoded, reviver);
    }

    /**
     * Returns UTF-8 text read from the given `file_path`
     * @param file_path
     */
    async read_file_text(file_path: string): Promise<string> {
        const payload = await this.read_file(file_path);

        return decode_utf8(payload);
    }

    /**
     * Writes to the given `file_path`, encoding `value` as JSON text
     * @param file_path
     * @param value
     * @param replacer
     * @param space
     */
    write_file_json<T extends IJSONTypes = IJSONTypes>(
        file_path: string,
        value: T,
        replacer?: IJSONReplacer,
        space?: number | string
    ): Promise<void> {
        const encoded = JSON.stringify(value, replacer, space);

        return this.write_file_text(file_path, encoded);
    }

    /**
     * Writes to the given `file_path`, encoding `text` as UTF-8 bytes
     * @param file_path
     * @param text
     */
    write_file_text(file_path: string, text: string): Promise<void> {
        const encoded = encode_utf8(text);

        return this.write_file(file_path, encoded);
    }
}
