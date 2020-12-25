import Dexie from "dexie";
import "dexie-observable";
import {DEFAULT_MIME_TYPE, NODE_CHANGES, NODE_TYPES} from "../util/constants";
import {get_epoch_timestamp} from "../util/datetime";
import {event as event2} from "../util/event";
import {make_glob} from "../util/glob";
import {get_mime_type} from "../util/mime_types";
import {join, normalize} from "../util/path";
import {
  create_url_object,
  hook_watcher,
  BaseAdapter
} from "./base_adapter";
const INDEXEDDB_VERSION = 1;
class IndexedDBStorage extends Dexie {
  constructor(namespace = "default") {
    super("uristorage:" + namespace);
    this.version(INDEXEDDB_VERSION).stores({
      nodes: "&path, ctime, mime_type, mtime, type"
    });
    this.nodes = this.table("nodes");
    this.EVENT_WATCH = event2((dispatch) => {
      function on_change(event3) {
        for (const change of event3) {
          switch (change.type) {
            case 1:
              dispatch({
                change: NODE_CHANGES.created,
                path: change.obj.path,
                type: change.obj.type
              });
              break;
            case 3:
              dispatch({
                change: NODE_CHANGES.removed,
                path: change.oldObj.path,
                type: change.oldObj.path
              });
              break;
            case 2:
              if (change.mods.payload) {
                dispatch({
                  change: NODE_CHANGES.attached,
                  path: change.oldObj.path,
                  type: change.oldObj.path
                });
              } else {
                dispatch({
                  change: NODE_CHANGES.updated,
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
class IndexedDBAdapter extends BaseAdapter {
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
    const object = create_url_object(node.payload, node.mime_type);
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
  async put(path2, type = NODE_TYPES.undefined, mime_type) {
    const {storage} = this;
    if (!storage) {
      throw new Error("bad dispatch to 'put' (database is not mounted)");
    }
    const uri = this.normalize(path2);
    const node = await storage.nodes.get(uri);
    const timestamp = get_epoch_timestamp();
    if (!mime_type)
      mime_type = get_mime_type(uri) || DEFAULT_MIME_TYPE;
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
      const regex = make_glob(normalize(path2.glob));
      collection = collection.filter((node) => regex.test(node.path));
    } else if (path2.regex) {
      const {regex} = path2;
      collection = collection.filter((node) => regex.test(node.path));
    } else {
      let {path: _path = "/"} = path2;
      _path = path2.recursive ? join(_path, "**") : join(_path, "*");
      const regex = make_glob(normalize(_path));
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
    return hook_watcher(storage.EVENT_WATCH, options);
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
      mtime: get_epoch_timestamp()
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
IndexedDBAdapter.identifier = "indexeddb";
IndexedDBAdapter.can_hotlink = true;
IndexedDBAdapter.can_watch = true;
IndexedDBAdapter.is_available = !!(typeof window === "object" && window.indexedDB);
IndexedDBAdapter.requires_mount = true;
export {
  IndexedDBAdapter
};
//# sourceMappingURL=whatwg_indexeddb.mjs.map
