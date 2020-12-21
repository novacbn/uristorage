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

import {StorageRegistry} from "./storage";

export class FileSystemRegistry extends StorageRegistry<FileSystemOverlay> {
    create_url_object(uri: string): Promise<IURLObject> {
        const result = this.resolve(uri);
        if (!result) {
            throw new Error(`bad argument #0 to 'create_url_object' (could not resolve '${uri}')`);
        }

        const {path, storage} = result;
        return storage.create_url_object(path);
    }

    create_directory(uri: string): Promise<void> {
        const result = this.resolve(uri);
        if (!result) {
            throw new Error(`bad argument #0 to 'create_directory' (could not resolve '${uri}')`);
        }

        const {path, storage} = result;
        return storage.create_directory(path);
    }

    exists(uri: string): Promise<boolean> {
        const result = this.resolve(uri);
        if (!result) {
            throw new Error(`bad argument #0 to 'exists' (could not resolve '${uri}')`);
        }

        const {path, storage} = result;
        return storage.exists(path);
    }

    get_stats(uri: string): Promise<IFileSystemEntryStats> {
        const result = this.resolve(uri);
        if (!result) {
            throw new Error(`bad argument #0 to 'get_stats' (could not resolve '${uri}')`);
        }

        const {path, storage} = result;
        return storage.get_stats(path);
    }

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

    read_file(uri: string): Promise<Uint8Array> {
        const result = this.resolve(uri);
        if (!result) {
            throw new Error(`bad argument #0 to 'read_file' (could not resolve '${uri}')`);
        }

        const {path, storage} = result;
        return storage.read_file(path);
    }

    remove_directory(uri: string, options: IFileSystemRemoveOptions = {}): Promise<boolean> {
        const result = this.resolve(uri);
        if (!result) {
            throw new Error(`bad argument #0 to 'remove_directory' (could not resolve '${uri}')`);
        }

        const {path, storage} = result;
        return storage.remove_directory(path, options);
    }

    remove_file(uri: string): Promise<void> {
        const result = this.resolve(uri);
        if (!result) {
            throw new Error(`bad argument #0 to 'remove_file' (could not resolve '${uri}')`);
        }

        const {path, storage} = result;
        return storage.remove_file(path);
    }

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

    watch_file(uri: string): Promise<IEvent<IFileSystemWatchEvent>> {
        const result = this.resolve(uri);
        if (!result) {
            throw new Error(`bad argument #0 to 'watch_file' (could not resolve '${uri}')`);
        }

        const {path, storage} = result;
        return storage.watch_file(path);
    }

    write_file(uri: string, payload: Uint8Array): Promise<void> {
        const result = this.resolve(uri);
        if (!result) {
            throw new Error(`bad argument #0 to 'write_file' (could not resolve '${uri}')`);
        }

        const {path, storage} = result;
        return storage.write_file(path, payload);
    }

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

    read_file_text(uri: string): Promise<string> {
        const result = this.resolve(uri);
        if (!result) {
            throw new Error(`bad argument #0 to 'read_file_text' (could not resolve '${uri}')`);
        }

        const {path, storage} = result;
        return storage.read_file_text(path);
    }

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

    write_file_text(uri: string, text: string): Promise<void> {
        const result = this.resolve(uri);
        if (!result) {
            throw new Error(`bad argument #0 to 'write_file_text' (could not resolve '${uri}')`);
        }

        const {path, storage} = result;
        return storage.write_file_text(path, text);
    }
}
