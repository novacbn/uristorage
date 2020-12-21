import type { IURLObject } from "../adapters";
import type { IFileSystemEntryResult, IFileSystemEntryStats, IFileSystemQueryOptions, IFileSystemRemoveOptions, IFileSystemWatchEvent, IFileSystemWatchOptions } from "../overlays/file_system";
import { FileSystemOverlay } from "../overlays/file_system";
import type { IEvent } from "../util/event";
import type { IJSONReplacer, IJSONReviver, IJSONValue } from "../util/types";
import { StorageRegistry } from "./storage";
export declare class FileSystemRegistry extends StorageRegistry<FileSystemOverlay> {
    create_url_object(uri: string): Promise<IURLObject>;
    create_directory(uri: string): Promise<void>;
    exists(uri: string): Promise<boolean>;
    get_stats(uri: string): Promise<IFileSystemEntryStats>;
    read_directory(namespace: string, options?: IFileSystemQueryOptions): Promise<IFileSystemEntryResult[]>;
    read_file(uri: string): Promise<Uint8Array>;
    remove_directory(uri: string, options?: IFileSystemRemoveOptions): Promise<boolean>;
    remove_file(uri: string): Promise<void>;
    watch_directory(uri: string, options?: IFileSystemWatchOptions): Promise<IEvent<IFileSystemWatchEvent>>;
    watch_file(uri: string): Promise<IEvent<IFileSystemWatchEvent>>;
    write_file(uri: string, payload: Uint8Array): Promise<void>;
    read_file_json<T extends IJSONValue = IJSONValue>(uri: string, reviver?: IJSONReviver): Promise<T>;
    read_file_text(uri: string): Promise<string>;
    write_file_json<T extends IJSONValue = IJSONValue>(uri: string, value: T, replacer?: IJSONReplacer, space?: number | string): Promise<void>;
    write_file_text(uri: string, text: string): Promise<void>;
}
