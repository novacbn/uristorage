import {StorageRegistry} from "./storage";
class FileSystemRegistry extends StorageRegistry {
  constructor() {
    super(...arguments);
    this.clone = (node) => {
      const {namespace, storage: storage2} = node;
      return {namespace, storage: storage2};
    };
  }
  create_url_object(uri) {
    const result = this.resolve(uri);
    if (!result) {
      throw new Error(`bad argument #0 to 'create_url_object' (could not resolve '${uri}')`);
    }
    const {path, storage: storage2} = result;
    return storage2.create_url_object(path);
  }
  create_directory(uri) {
    const result = this.resolve(uri);
    if (!result) {
      throw new Error(`bad argument #0 to 'create_directory' (could not resolve '${uri}')`);
    }
    const {path, storage: storage2} = result;
    return storage2.create_directory(path);
  }
  exists(uri) {
    const result = this.resolve(uri);
    if (!result) {
      throw new Error(`bad argument #0 to 'exists' (could not resolve '${uri}')`);
    }
    const {path, storage: storage2} = result;
    return storage2.exists(path);
  }
  get_stats(uri) {
    const result = this.resolve(uri);
    if (!result) {
      throw new Error(`bad argument #0 to 'get_stats' (could not resolve '${uri}')`);
    }
    const {path, storage: storage2} = result;
    return storage2.get_stats(path);
  }
  read_directory(namespace, options = {}) {
    const node = this.get(namespace);
    if (!node) {
      throw new Error(`bad argument #0 to 'read_directory' (could not resolve '${namespace}')`);
    }
    const {storage: storage2} = node;
    return storage2.read_directory(options);
  }
  read_file(uri) {
    const result = this.resolve(uri);
    if (!result) {
      throw new Error(`bad argument #0 to 'read_file' (could not resolve '${uri}')`);
    }
    const {path, storage: storage2} = result;
    return storage2.read_file(path);
  }
  remove_directory(uri, options = {}) {
    const result = this.resolve(uri);
    if (!result) {
      throw new Error(`bad argument #0 to 'remove_directory' (could not resolve '${uri}')`);
    }
    const {path, storage: storage2} = result;
    return storage2.remove_directory(path, options);
  }
  remove_file(uri) {
    const result = this.resolve(uri);
    if (!result) {
      throw new Error(`bad argument #0 to 'remove_file' (could not resolve '${uri}')`);
    }
    const {path, storage: storage2} = result;
    return storage2.remove_file(path);
  }
  watch_directory(uri, options = {}) {
    const result = this.resolve(uri);
    if (!result) {
      throw new Error(`bad argument #0 to 'watch_directory' (could not resolve '${uri}')`);
    }
    const {path, storage: storage2} = result;
    return storage2.watch_directory(path, options);
  }
  watch_file(uri) {
    const result = this.resolve(uri);
    if (!result) {
      throw new Error(`bad argument #0 to 'watch_file' (could not resolve '${uri}')`);
    }
    const {path, storage: storage2} = result;
    return storage2.watch_file(path);
  }
  write_file(uri, payload) {
    const result = this.resolve(uri);
    if (!result) {
      throw new Error(`bad argument #0 to 'write_file' (could not resolve '${uri}')`);
    }
    const {path, storage: storage2} = result;
    return storage2.write_file(path, payload);
  }
  read_file_json(uri, reviver) {
    const result = this.resolve(uri);
    if (!result) {
      throw new Error(`bad argument #0 to 'read_file_json' (could not resolve '${uri}')`);
    }
    const {path, storage: storage2} = result;
    return storage2.read_file_json(path, reviver);
  }
  read_file_text(uri) {
    const result = this.resolve(uri);
    if (!result) {
      throw new Error(`bad argument #0 to 'read_file_text' (could not resolve '${uri}')`);
    }
    const {path, storage: storage2} = result;
    return storage2.read_file_text(path);
  }
  write_file_json(uri, value, replacer, space) {
    const result = this.resolve(uri);
    if (!result) {
      throw new Error(`bad argument #0 to 'write_file_json' (could not resolve '${uri}')`);
    }
    const {path, storage: storage2} = result;
    return storage2.write_file_json(path, value, replacer, space);
  }
  write_file_text(uri, text) {
    const result = this.resolve(uri);
    if (!result) {
      throw new Error(`bad argument #0 to 'write_file_text' (could not resolve '${uri}')`);
    }
    const {path, storage: storage2} = result;
    return storage2.write_file_text(path, text);
  }
}
export {
  FileSystemRegistry
};
//# sourceMappingURL=file_system.mjs.map
