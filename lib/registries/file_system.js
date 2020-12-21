var __create = Object.create;
var __defProp = Object.defineProperty;
var __getProtoOf = Object.getPrototypeOf;
var __hasOwnProp = Object.prototype.hasOwnProperty;
var __getOwnPropNames = Object.getOwnPropertyNames;
var __getOwnPropDesc = Object.getOwnPropertyDescriptor;
var __markAsModule = (target) => __defProp(target, "__esModule", {value: true});
var __export = (target, all) => {
  __markAsModule(target);
  for (var name in all)
    __defProp(target, name, {get: all[name], enumerable: true});
};
var __exportStar = (target, module2, desc) => {
  __markAsModule(target);
  if (typeof module2 === "object" || typeof module2 === "function") {
    for (let key of __getOwnPropNames(module2))
      if (!__hasOwnProp.call(target, key) && key !== "default")
        __defProp(target, key, {get: () => module2[key], enumerable: !(desc = __getOwnPropDesc(module2, key)) || desc.enumerable});
  }
  return target;
};
var __toModule = (module2) => {
  if (module2 && module2.__esModule)
    return module2;
  return __exportStar(__defProp(__create(__getProtoOf(module2)), "default", {value: module2, enumerable: true}), module2);
};
__export(exports, {
  FileSystemRegistry: () => FileSystemRegistry
});
const storage = __toModule(require("./storage"));
class FileSystemRegistry extends storage.StorageRegistry {
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
//# sourceMappingURL=file_system.js.map
