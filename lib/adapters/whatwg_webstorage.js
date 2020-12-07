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
  LocalStorageAdapter: () => LocalStorageAdapter,
  SessionStorageAdapter: () => SessionStorageAdapter,
  WebStorageAdapter: () => WebStorageAdapter
});
const compression = __toModule(require("../util/compression"));
const constants = __toModule(require("../util/constants"));
const datetime = __toModule(require("../util/datetime"));
const encoding = __toModule(require("../util/encoding"));
const event = __toModule(require("../util/event"));
const mime_types = __toModule(require("../util/mime_types"));
const base_adapter = __toModule(require("./base_adapter"));
class WebStorage {
  constructor(namespace, storage) {
    this.EVENT_WATCH = event.event();
    this.prefix_node = `uristorage:${namespace}:n:`;
    this.prefix_payload = `uristorage:${namespace}:p:`;
    this.storage = storage;
  }
  attach(path, payload, mtime) {
    const {storage} = this;
    const key_node = this.prefix_node + path;
    const key_payload = this.prefix_payload + path;
    const node = {...JSON.parse(storage.getItem(key_node)), mtime};
    storage.setItem(key_node, JSON.stringify(node));
    storage.setItem(key_payload, encoding.encode_safe(payload));
    this.EVENT_WATCH.dispatch({
      change: constants.NODE_CHANGES.attached,
      path,
      type: node.type
    });
  }
  get(path) {
    const key = this.prefix_node + path;
    const item = this.storage.getItem(key);
    if (item) {
      const {
        ctime = 0,
        mime_type = constants.DEFAULT_MIME_TYPE,
        mtime = 0,
        type = constants.NODE_TYPES.undefined
      } = JSON.parse(item);
      return {
        ctime,
        mime_type,
        mtime,
        path,
        type
      };
    }
    return null;
  }
  get_payload(path) {
    const key = this.prefix_payload + path;
    const item = this.storage.getItem(key);
    if (item)
      return encoding.decode_safe(item, {mode: constants.ENCODING_MODE.bytes});
    return null;
  }
  has(path) {
    path = this.prefix_node + path;
    return !!this.storage.getItem(path);
  }
  *nodes() {
    const {prefix_node, storage} = this;
    for (let index = 0; index < storage.length; index++) {
      const key = storage.key(index);
      if (key?.startsWith(prefix_node)) {
        const item = storage.getItem(key);
        const {type = constants.NODE_TYPES.undefined} = JSON.parse(item);
        yield {
          path: key.slice(prefix_node.length),
          type
        };
      }
    }
  }
  put(path, node) {
    const _node = {...node, path};
    const item = JSON.stringify(_node);
    this.storage.setItem(this.prefix_node + path, item);
    this.EVENT_WATCH.dispatch({
      change: constants.NODE_CHANGES.created,
      path,
      type: _node.type
    });
  }
  remove(path) {
    const {storage} = this;
    const key_node = this.prefix_node + path;
    const item = storage.getItem(key_node);
    if (!item)
      return false;
    const node = JSON.parse(item);
    storage.removeItem(key_node);
    storage.removeItem(this.prefix_payload + path);
    this.EVENT_WATCH.dispatch({
      change: constants.NODE_CHANGES.removed,
      path,
      type: node.type
    });
    return true;
  }
  update(path, value) {
    const {storage} = this;
    const key = this.prefix_node + path;
    const node = {...JSON.parse(storage.getItem(key)), ...value, path};
    storage.setItem(key, JSON.stringify(node));
    this.EVENT_WATCH.dispatch({
      change: constants.NODE_CHANGES.updated,
      path: node.path,
      type: node.type
    });
  }
}
function WebStorageOptions(options = {}) {
  const {compressed = true} = options;
  return {
    ...options,
    compressed
  };
}
class WebStorageAdapter extends base_adapter.BaseAdapter {
  constructor(storage, options = {}) {
    super(WebStorageOptions(options));
    const {namespace} = this.options;
    this.storage = new WebStorage(namespace, storage);
  }
  async create_url_object(path) {
    const {storage} = this;
    const {compressed} = this.options;
    const uri = this.normalize(path);
    if (!storage.has(uri)) {
      throw new Error("bad argument #0 to 'create_url_object' (Node must be created before using 'create_url_object')");
    }
    let payload = storage.get_payload(uri);
    if (!payload) {
      throw new Error("bad argument #0 to 'create_url_object' (Node payload must be created before using 'create_url_object')");
    }
    const node = storage.get(uri);
    payload = compressed ? compression.decompress(payload) : payload;
    const object = base_adapter.create_url_object(payload, node.mime_type);
    return {
      destroy: object.destroy,
      path: node.path,
      url: object.url
    };
  }
  async get(path) {
    const uri = this.normalize(path);
    return this.storage.get(uri);
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
    const nodes = Array.from(this.storage.nodes());
    return base_adapter.filter_query(nodes, options);
  }
  async read(path) {
    const {compressed} = this.options;
    const uri = this.normalize(path);
    const payload = this.storage.get_payload(uri);
    if (!payload)
      return null;
    return compressed ? compression.decompress(payload) : payload;
  }
  async remove(path) {
    const uri = this.normalize(path);
    return this.storage.remove(uri);
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
    payload = compressed ? compression.compress(payload) : payload;
    storage.attach(uri, payload, datetime.get_epoch_timestamp());
  }
  is_mounted() {
    return true;
  }
  async mount() {
  }
  async unmount() {
  }
}
WebStorageAdapter.can_hotlink = true;
WebStorageAdapter.can_watch = true;
WebStorageAdapter.is_available = false;
WebStorageAdapter.storage = null;
class LocalStorageAdapter extends WebStorageAdapter {
  constructor(options = {}) {
    super(window.localStorage, options);
  }
}
LocalStorageAdapter.is_available = !!(typeof window === "object" && window.localStorage);
class SessionStorageAdapter extends WebStorageAdapter {
  constructor(options = {}) {
    super(window.sessionStorage, options);
  }
}
SessionStorageAdapter.is_available = !!(typeof window === "object" && window.sessionStorage);
//# sourceMappingURL=whatwg_webstorage.js.map
