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
  IndexedDBAdapter: () => IndexedDBAdapter
});
const dexie = __toModule(require("dexie"));
const dexie_observable = __toModule(require("dexie-observable"));
const constants = __toModule(require("../util/constants"));
const datetime = __toModule(require("../util/datetime"));
const event = __toModule(require("../util/event"));
const glob = __toModule(require("../util/glob"));
const mime_types = __toModule(require("../util/mime_types"));
const path = __toModule(require("../util/path"));
const base_adapter = __toModule(require("./base_adapter"));
const INDEXEDDB_VERSION = 1;
class IndexedDBStorage extends dexie.default {
  constructor(namespace = "default") {
    super("uristorage:" + namespace);
    this.version(INDEXEDDB_VERSION).stores({
      nodes: "&path, ctime, mime_type, mtime, type"
    });
    this.nodes = this.table("nodes");
    this.EVENT_WATCH = event.event((dispatch) => {
      function on_change(event3) {
        for (const change of event3) {
          switch (change.type) {
            case 1:
              dispatch({
                change: constants.NODE_CHANGES.created,
                path: change.obj.path,
                type: change.obj.type
              });
              break;
            case 3:
              dispatch({
                change: constants.NODE_CHANGES.removed,
                path: change.oldObj.path,
                type: change.oldObj.path
              });
              break;
            case 2:
              if (change.mods.payload) {
                dispatch({
                  change: constants.NODE_CHANGES.attached,
                  path: change.oldObj.path,
                  type: change.oldObj.path
                });
              } else {
                dispatch({
                  change: constants.NODE_CHANGES.updated,
                  path: change.oldObj.path,
                  type: change.oldObj.path
                });
              }
              break;
          }
        }
      }
      const context = this.on("changes", on_change);
      return () => context.unsubscribe(on_change);
    });
  }
}
class IndexedDBAdapter extends base_adapter.BaseAdapter {
  constructor(options = {}) {
    super(options);
  }
  async create_url_object(path2) {
    const {storage} = this;
    if (!storage) {
      throw new Error("bad dispatch to 'create_url_object' (database is not mounted)");
    }
    const uri = this.normalize(path2);
    const node = await storage.nodes.get(uri);
    if (!node) {
      throw new Error("bad argument #0 to 'create_url_object' (Node must be created before using 'create_url_object')");
    }
    if (!node.payload) {
      throw new Error("bad argument #0 to 'create_url_object' (Node payload must be created before using 'create_url_object')");
    }
    const object = base_adapter.create_url_object(node.payload, node.mime_type);
    return {
      destroy: object.destroy,
      path: node.path,
      url: object.url
    };
  }
  async get(path2) {
    const {storage} = this;
    if (!storage) {
      throw new Error("bad dispatch to 'get' (database is not mounted)");
    }
    const uri = this.normalize(path2);
    const node = await storage.nodes.get(uri);
    if (!node)
      return null;
    return {
      ctime: node.ctime,
      mime_type: node.mime_type,
      mtime: node.mtime,
      path: node.path,
      type: node.type
    };
  }
  async put(path2, type = constants.NODE_TYPES.undefined, mime_type) {
    const {storage} = this;
    if (!storage) {
      throw new Error("bad dispatch to 'put' (database is not mounted)");
    }
    const uri = this.normalize(path2);
    const node = await storage.nodes.get(uri);
    const timestamp = datetime.get_epoch_timestamp();
    if (!mime_type)
      mime_type = mime_types.get_mime_type(uri) || constants.DEFAULT_MIME_TYPE;
    if (node) {
      await storage.nodes.update(node, {
        mtime: timestamp,
        mime_type,
        type
      });
    } else {
      await storage.nodes.put({
        ctime: timestamp,
        mime_type,
        mtime: timestamp,
        path: uri,
        type
      });
    }
  }
  async query(options = {}) {
    const {storage} = this;
    if (!storage) {
      throw new Error("bad dispatch to 'query' (database is not mounted)");
    }
    const {path: path2 = {}, type} = options;
    let collection = storage.nodes.toCollection();
    if (type) {
      if (typeof type === "string") {
        collection = collection.filter((node) => node.type === type);
      } else
        collection = collection.filter((node) => type.includes(node.type));
    }
    if (path2.glob) {
      const regex = glob.make_glob(path.normalize(path2.glob));
      collection = collection.filter((node) => regex.test(node.path));
    } else if (path2.regex) {
      const {regex} = path2;
      collection = collection.filter((node) => regex.test(node.path));
    } else {
      let {path: _path = "/"} = path2;
      _path = path2.recursive ? path.join(_path, "**") : path.join(_path, "*");
      const regex = glob.make_glob(path.normalize(_path));
      collection = collection.filter((node) => regex.test(node.path));
    }
    const results = await collection.toArray();
    return results.map((node, index) => {
      const {path: path3, type: type2} = node;
      return {path: path3, type: type2};
    });
  }
  async read(path2) {
    const {storage} = this;
    if (!storage) {
      throw new Error("bad dispatch to 'get_payload' (database is not mounted)");
    }
    const uri = this.normalize(path2);
    const node = await storage.nodes.get(uri);
    if (!node || !node.payload)
      return null;
    return node.payload;
  }
  async remove(path2) {
    const {storage} = this;
    if (!storage) {
      throw new Error("bad dispatch to 'remove' (database is not mounted)");
    }
    const uri = this.normalize(path2);
    const node = await storage.nodes.get(uri);
    if (!node)
      return false;
    storage.nodes.delete(uri);
    return true;
  }
  async watch(options = {}) {
    const {storage} = this;
    if (!storage) {
      throw new Error("bad dispatch to 'remove' (database is not mounted)");
    }
    return base_adapter.hook_watcher(storage.EVENT_WATCH, options);
  }
  async write(path2, payload) {
    const {storage} = this;
    if (!storage) {
      throw new Error("bad dispatch to 'attach' (database is not mounted)");
    }
    const uri = this.normalize(path2);
    const node = await storage.nodes.get(uri);
    if (!node) {
      throw new Error("bad argument #0 to 'attach' (Node must be created before using 'attach')");
    }
    await storage.nodes.update(node, {
      payload,
      mtime: datetime.get_epoch_timestamp()
    });
  }
  is_mounted() {
    return !!this.storage;
  }
  async mount() {
    if (this.storage) {
      throw new Error("bad dispatch to 'mount' (database is already mounted)");
    }
    const {namespace} = this.options;
    const storage = new IndexedDBStorage(namespace);
    await storage.open();
    this.storage = storage;
  }
  async unmount() {
    const {storage} = this;
    if (!storage) {
      throw new Error("bad dispatch to 'unmount' (database is not mounted)");
    }
    await storage.close();
    delete this.storage;
  }
}
IndexedDBAdapter.can_hotlink = true;
IndexedDBAdapter.can_watch = true;
IndexedDBAdapter.is_available = !!(typeof window === "object" && window.indexedDB);
IndexedDBAdapter.requires_mount = true;
//# sourceMappingURL=whatwg_indexeddb.js.map
