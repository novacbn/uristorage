import {compress, decompress} from "../util/compression";
import {NODE_CHANGES, DEFAULT_MIME_TYPE, NODE_TYPES} from "../util/constants";
import {get_epoch_timestamp} from "../util/datetime";
import {event as event2} from "../util/event";
import {ImmutableMap} from "../util/map";
import {get_mime_type} from "../util/mime_types";
import {
  BaseAdapter,
  create_url_object,
  filter_query,
  hook_watcher
} from "./base_adapter";
class NodeMap extends ImmutableMap {
  constructor() {
    super(...arguments);
    this.EVENT_WATCH = event2();
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
        change: NODE_CHANGES.removed,
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
      change: NODE_CHANGES.created,
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
        change: NODE_CHANGES.attached,
        path: node.path,
        type: node.type
      });
    } else {
      this.EVENT_WATCH.dispatch({
        change: NODE_CHANGES.updated,
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
class MemoryAdapter extends BaseAdapter {
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
    const payload = compressed ? decompress(node.payload) : node.payload;
    const object = create_url_object(payload, node.mime_type);
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
  async put(path, type = NODE_TYPES.undefined, mime_type) {
    const {storage} = this;
    const uri = this.normalize(path);
    const timestamp = get_epoch_timestamp();
    if (!mime_type)
      mime_type = get_mime_type(uri) || DEFAULT_MIME_TYPE;
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
      const {type = NODE_TYPES.undefined} = entry[1];
      return {path, type};
    });
    return filter_query(nodes, options);
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
    return compressed ? decompress(node.payload) : node.payload;
  }
  async remove(path) {
    const {storage} = this;
    const uri = this.normalize(path);
    return storage.delete(uri);
  }
  async watch(options = {}) {
    return hook_watcher(this.storage.EVENT_WATCH, options);
  }
  async write(path, payload) {
    const {storage} = this;
    const {compressed} = this.options;
    const uri = this.normalize(path);
    if (!storage.has(uri)) {
      throw new Error("bad argument #0 to 'attach' (Node must be created before using 'attach')");
    }
    storage.update(uri, {
      mtime: get_epoch_timestamp(),
      payload: compressed ? compress(payload) : payload
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
MemoryAdapter.can_hotlink = true;
MemoryAdapter.can_watch = true;
MemoryAdapter.is_available = true;
export {
  MemoryAdapter
};
//# sourceMappingURL=shared_memory.js.map
