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
  MemoryAdapter: () => MemoryAdapter
});
const compression = __toModule(require("../util/compression"));
const constants = __toModule(require("../util/constants"));
const datetime = __toModule(require("../util/datetime"));
const event = __toModule(require("../util/event"));
const map = __toModule(require("../util/map"));
const mime_types = __toModule(require("../util/mime_types"));
const base_adapter = __toModule(require("./base_adapter"));
class NodeMap extends map.ImmutableMap {
  constructor() {
    super(...arguments);
    this.EVENT_WATCH = event.event();
    this.clone = (node) => {
      const {ctime, mime_type, mtime, path, type} = node;
      let {payload} = node;
      if (payload)
        payload = payload.slice();
      return {ctime, mime_type, mtime, payload, path, type};
    };
  }
  delete(key) {
    if (this.has(key)) {
      const node = this.get(key);
      super.delete(key);
      this.EVENT_WATCH.dispatch({
        change: constants.NODE_CHANGES.removed,
        path: node.path,
        type: node.type
      });
      return true;
    }
    return false;
  }
  put(key, value) {
    const node = {...value, path: key};
    super.set(key, node);
    this.EVENT_WATCH.dispatch({
      change: constants.NODE_CHANGES.created,
      path: node.path,
      type: node.type
    });
    return this;
  }
  update(key, value) {
    const node = {...this.get(key), ...value, path: key};
    super.set(key, node);
    if (value.payload) {
      this.EVENT_WATCH.dispatch({
        change: constants.NODE_CHANGES.attached,
        path: node.path,
        type: node.type
      });
    } else {
      this.EVENT_WATCH.dispatch({
        change: constants.NODE_CHANGES.updated,
        path: node.path,
        type: node.type
      });
    }
    return this;
  }
}
function MemoryOptions(options = {}) {
  const {compressed = false} = options;
  return {
    ...options,
    compressed
  };
}
class MemoryAdapter extends base_adapter.BaseAdapter {
  constructor(options = {}) {
    super(MemoryOptions(options));
    this.storage = new NodeMap();
  }
  async create_url_object(path) {
    const {storage} = this;
    const {compressed} = this.options;
    const uri = this.normalize(path);
    if (!storage.has(uri)) {
      throw new Error("bad argument #0 to 'create_url_object' (Node must be created before using 'create_url_object')");
    }
    const node = storage.get(uri);
    if (!node.payload) {
      throw new Error("bad argument #0 to 'create_url_object' (Node payload must be created before using 'create_url_object')");
    }
    const payload = compressed ? compression.decompress(node.payload) : node.payload;
    const object = base_adapter.create_url_object(payload, node.mime_type);
    return {
      destroy: object.destroy,
      path: node.path,
      url: object.url
    };
  }
  async get(path) {
    const {storage} = this;
    const uri = this.normalize(path);
    if (!storage.has(uri))
      return null;
    const node = storage.get(uri);
    return {
      ctime: node.ctime,
      mime_type: node.mime_type,
      mtime: node.mtime,
      path: node.path,
      type: node.type
    };
  }
  async put(path, type = constants.NODE_TYPES.undefined, mime_type) {
    const {storage} = this;
    const uri = this.normalize(path);
    const timestamp = datetime.get_epoch_timestamp();
    if (!mime_type)
      mime_type = mime_types.get_mime_type(uri) || constants.DEFAULT_MIME_TYPE;
    if (storage.has(uri)) {
      storage.update(uri, {
        mime_type,
        mtime: timestamp,
        type
      });
    } else {
      storage.put(uri, {
        ctime: timestamp,
        mime_type,
        mtime: timestamp,
        type
      });
    }
  }
  async query(options = {}) {
    const entries = Array.from(this.storage.entries());
    const nodes = entries.map((entry, index) => {
      const path = entry[0];
      const {type = constants.NODE_TYPES.undefined} = entry[1];
      return {path, type};
    });
    return base_adapter.filter_query(nodes, options);
  }
  async read(path) {
    const {storage} = this;
    const {compressed} = this.options;
    const uri = this.normalize(path);
    if (!storage.has(uri))
      return null;
    const node = storage.get(uri);
    if (!node.payload)
      return null;
    return compressed ? compression.decompress(node.payload) : node.payload;
  }
  async remove(path) {
    const {storage} = this;
    const uri = this.normalize(path);
    return storage.delete(uri);
  }
  async watch(options = {}) {
    return base_adapter.hook_watcher(this.storage.EVENT_WATCH, options);
  }
  async write(path, payload) {
    const {storage} = this;
    const {compressed} = this.options;
    const uri = this.normalize(path);
    if (!storage.has(uri)) {
      throw new Error("bad argument #0 to 'attach' (Node must be created before using 'attach')");
    }
    storage.update(uri, {
      mtime: datetime.get_epoch_timestamp(),
      payload: compressed ? compression.compress(payload) : payload
    });
  }
  is_mounted() {
    return true;
  }
  async mount() {
  }
  async unmount() {
  }
}
MemoryAdapter.identifier = "memory";
MemoryAdapter.can_hotlink = true;
MemoryAdapter.can_watch = true;
MemoryAdapter.is_available = true;
//# sourceMappingURL=shared_memory.js.map
