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
  FILE_SYSTEM_CHANGES: () => FILE_SYSTEM_CHANGES,
  FileSystemOverlay: () => FileSystemOverlay
});
const constants = __toModule(require("../util/constants"));
const encoding = __toModule(require("../util/encoding"));
const event = __toModule(require("../util/event"));
const path = __toModule(require("../util/path"));
const base_overlay = __toModule(require("./base_overlay"));
var FILE_SYSTEM_CHANGES;
(function(FILE_SYSTEM_CHANGES2) {
  FILE_SYSTEM_CHANGES2["created"] = "CHANGE_CREATED";
  FILE_SYSTEM_CHANGES2["removed"] = "CHANGE_REMOVED";
  FILE_SYSTEM_CHANGES2["updated"] = "CHANGE_UPDATED";
})(FILE_SYSTEM_CHANGES || (FILE_SYSTEM_CHANGES = {}));
const PATTERN_SEPARATOR_SEARCH = /\//g;
function count_slashes(path2) {
  const matches = path2.match(PATTERN_SEPARATOR_SEARCH);
  if (!matches)
    return 0;
  return matches.length;
}
class FileSystemOverlay extends base_overlay.BaseOverlay {
  async create_url_object(file_path) {
    if (!this.has_feature("can_hotlink")) {
      throw new Error("bad dispatch to 'create_url_object' (adapter does not support feature)");
    }
    const {adapter} = this;
    const node = await adapter.get(file_path);
    if (!node) {
      throw new Error("bad argument #0 to 'create_url_object' (file path not found)");
    } else if (node.type !== constants.NODE_TYPES.file) {
      throw new Error("bad argument #0 to 'create_url_object' (file path is not a file)");
    }
    return adapter.create_url_object(file_path);
  }
  async create_directory(directory_path) {
    if (this.has_feature("is_readonly")) {
      throw new Error("bad dispatch to 'create_directory' (adapter does not support feature)");
    }
    const {adapter} = this;
    directory_path = path.normalize(directory_path);
    if (directory_path === "/") {
      throw new Error("bad argument #0 to 'create_directory' (directory path is already a directory)");
    }
    const node = await adapter.get(directory_path);
    if (node) {
      switch (node.type) {
        case constants.NODE_TYPES.directory:
          throw new Error("bad argument #0 to 'create_directory' (directory path is already a directory)");
        case constants.NODE_TYPES.file:
          throw new Error("bad argument #0 to 'create_directory' (directory path is already a file)");
      }
    }
    const parent_path = path.dirname(directory_path);
    if (parent_path !== "/") {
      const parent_node = await adapter.get(parent_path);
      if (!parent_node) {
        throw new Error("bad argument #0 to 'create_directory' (parent path does not exist)");
      } else if (parent_node.type !== constants.NODE_TYPES.directory) {
        throw new Error("bad argument #0 to 'create_directory' (parent path is not a directory)");
      }
    }
    return adapter.put(directory_path, constants.NODE_TYPES.directory);
  }
  async exists(path2) {
    const node = await this.adapter.get(path2);
    return !!node;
  }
  async get_stats(path2) {
    const node = await this.adapter.get(path2);
    if (!node) {
      throw new Error("bad argument #0 to 'get_stats' (path not found)");
    }
    return {
      ctime: node.ctime,
      path: node.path,
      mtime: node.mtime,
      is_directory: node.type === constants.NODE_TYPES.directory,
      is_file: node.type === constants.NODE_TYPES.file
    };
  }
  async read_directory(options = {}) {
    const {adapter} = this;
    const {is_directory, is_file, glob, regex, path: path2, recursive = false} = options;
    let type;
    if (is_directory)
      type = constants.NODE_TYPES.directory;
    else if (is_file)
      type = constants.NODE_TYPES.file;
    else
      type = [constants.NODE_TYPES.directory, constants.NODE_TYPES.file];
    let results;
    if (path2 || path2 === "") {
      const directory_path = path.normalize(path2);
      const node = await adapter.get(directory_path);
      if (directory_path !== "/") {
        if (!node) {
          throw new Error("bad option 'IFileSystemQueryOptions.path' to 'read_directory' (directory path not found)");
        } else if (node.type !== constants.NODE_TYPES.directory) {
          throw new Error("bad option 'IFileSystemQueryOptions.path' to 'read_directory' (directory path is not a directory)");
        }
      }
      results = await adapter.query({
        type,
        path: {
          recursive,
          path: directory_path
        }
      });
    } else if (glob) {
      results = await adapter.query({
        type,
        path: {glob}
      });
    } else if (regex) {
      results = await adapter.query({
        type,
        path: {regex}
      });
    } else {
      results = await adapter.query({
        type,
        path: {
          recursive,
          path: "/"
        }
      });
    }
    return results.map((result, index) => {
      const {path: path3, type: type2} = result;
      return {
        path: path3,
        is_directory: type2 === constants.NODE_TYPES.directory,
        is_file: type2 === constants.NODE_TYPES.file
      };
    });
  }
  async read_file(file_path) {
    const {adapter} = this;
    const node = await adapter.get(file_path);
    if (!node) {
      throw new Error("bad argument #0 to 'read_file' (file path not found)");
    } else if (node.type !== constants.NODE_TYPES.file) {
      throw new Error("bad argument #0 to 'read_file' (file path is not a file)");
    }
    const payload = await adapter.read(file_path);
    return payload ? payload : new Uint8Array();
  }
  async remove_directory(directory_path, options = {}) {
    if (this.has_feature("is_readonly")) {
      throw new Error("bad dispatch to 'remove_directory' (adapter does not support feature)");
    }
    const {adapter} = this;
    const {recursive = false} = options;
    directory_path = path.normalize(directory_path);
    if (directory_path === "/") {
      throw new Error("bad argument #0 to 'remove_directory' (directory path not found)");
    }
    const node = await adapter.get(directory_path);
    if (!node) {
      throw new Error("bad argument #0 to 'remove_directory' (directory path not found)");
    } else if (node.type !== constants.NODE_TYPES.directory) {
      throw new Error("bad argument #0 to 'remove_directory' (directory path is not a directory)");
    }
    const children_results = await adapter.query({
      path: {
        path: directory_path,
        recursive: true
      }
    });
    if (children_results.length > 0) {
      if (recursive) {
        children_results.sort((a, b) => count_slashes(b.path) - count_slashes(a.path));
        const promises = children_results.map((result, index) => {
          return adapter.remove(result.path);
        });
        await Promise.all(promises);
      } else {
        throw new Error("bad argument #0 to 'remove_directory' (directory contains children)");
      }
    }
    return adapter.remove(directory_path);
  }
  async remove_file(file_path) {
    if (this.has_feature("is_readonly")) {
      throw new Error("bad dispatch to 'remove_file' (adapter does not support feature)");
    }
    const {adapter} = this;
    const node = await adapter.get(file_path);
    if (!node) {
      throw new Error("bad argument #0 to 'remove_file' (file path not found)");
    } else if (node.type !== constants.NODE_TYPES.file) {
      throw new Error("bad argument #0 to 'remove_file' (file path is not a file)");
    }
    const removed = await adapter.remove(file_path);
    if (!removed) {
      throw new Error("bad argument #0 to 'remove_file' (could not remove file path)");
    }
  }
  async watch_directory(directory_path, options = {}) {
    if (!this.has_feature("can_watch")) {
      throw new Error("bad dispatch to 'watch_directory' (adapter does not support feature)");
    }
    const {adapter} = this;
    const {recursive} = options;
    directory_path = path.normalize(directory_path);
    if (directory_path !== "/") {
      const node = await adapter.get(directory_path);
      if (!node) {
        throw new Error("bad argument #0 to 'watch_directory' (directory path not found)");
      } else if (node.type !== constants.NODE_TYPES.directory) {
        throw new Error("bad argument #0 to 'watch_directory' (directory path is not a directory)");
      }
    }
    const watcher = await adapter.watch({
      recursive,
      change: [constants.NODE_CHANGES.attached, constants.NODE_CHANGES.created, constants.NODE_CHANGES.removed],
      inclusive: true,
      path: directory_path
    });
    return event.event((dispatch) => {
      const destroy = watcher.subscribe((event3) => {
        switch (event3.change) {
          case constants.NODE_CHANGES.attached:
            dispatch({
              change: FILE_SYSTEM_CHANGES.updated,
              path: event3.path,
              type: event3.type
            });
            break;
          case constants.NODE_CHANGES.created:
            dispatch({
              change: FILE_SYSTEM_CHANGES.created,
              path: event3.path,
              type: event3.type
            });
            break;
          case constants.NODE_CHANGES.removed:
            dispatch({
              change: FILE_SYSTEM_CHANGES.removed,
              path: event3.path,
              type: event3.type
            });
            break;
        }
      });
      return () => destroy();
    });
  }
  async watch_file(file_path) {
    if (!this.has_feature("can_watch")) {
      throw new Error("bad dispatch to 'watch_file' (adapter does not support feature)");
    }
    const {adapter} = this;
    const node = await adapter.get(file_path);
    if (!node) {
      throw new Error("bad argument #0 to 'watch_file' (file path not found)");
    } else if (node.type !== constants.NODE_TYPES.file) {
      throw new Error("bad argument #0 to 'watch_file' (file path is not a file)");
    }
    const watcher = await adapter.watch({
      change: [constants.NODE_CHANGES.attached, constants.NODE_CHANGES.removed],
      path: file_path
    });
    return event.event((dispatch) => {
      async function update(event3) {
        switch (event3.change) {
          case constants.NODE_CHANGES.attached:
            dispatch({
              change: FILE_SYSTEM_CHANGES.updated,
              path: event3.path,
              type: event3.type
            });
            break;
          case constants.NODE_CHANGES.removed:
            dispatch({
              change: FILE_SYSTEM_CHANGES.removed,
              path: event3.path,
              type: event3.type
            });
            break;
        }
      }
      const destroy = watcher.subscribe(update);
      return () => destroy();
    });
  }
  async write_file(file_path, payload) {
    if (this.has_feature("is_readonly")) {
      throw new Error("bad dispatch to 'write_file' (adapter does not support feature)");
    }
    const {adapter} = this;
    file_path = path.normalize(file_path);
    if (file_path === "/") {
      throw new Error("bad argument #0 to 'write_file' (file path is not a file)");
    }
    const node = await adapter.get(file_path);
    if (node && node.type !== constants.NODE_TYPES.file) {
      throw new Error("bad argument #0 to 'write_file' (file path is not a file)");
    }
    const parent_path = path.dirname(file_path);
    if (parent_path !== "/") {
      const parent_node = await adapter.get(parent_path);
      if (!parent_node || parent_node.type !== constants.NODE_TYPES.directory) {
        throw new Error("bad argument #0 to 'write_file' (parent path is not a directory)");
      }
    }
    await adapter.put(file_path, constants.NODE_TYPES.file);
    return adapter.write(file_path, payload);
  }
  async read_file_json(file_path, reviver) {
    const encoded = await this.read_file_text(file_path);
    return JSON.parse(encoded, reviver);
  }
  async read_file_text(file_path) {
    const payload = await this.read_file(file_path);
    return encoding.decode_utf8(payload);
  }
  write_file_json(file_path, value, replacer, space) {
    const encoded = JSON.stringify(value, replacer, space);
    return this.write_file_text(file_path, encoded);
  }
  write_file_text(file_path, text) {
    const encoded = encoding.encode_utf8(text);
    return this.write_file(file_path, encoded);
  }
}
//# sourceMappingURL=file_system.js.map
