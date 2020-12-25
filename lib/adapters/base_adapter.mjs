import {NODE_TYPES, DEFAULT_MIME_TYPE} from "../util/constants";
import {event as event2} from "../util/event";
import {make_glob} from "../util/glob";
import {join, normalize} from "../util/path";
function BaseAdapterOptions(options = {}) {
  const {namespace = "default"} = options;
  return {
    ...options,
    namespace
  };
}
function create_url_object(payload, mime_type) {
  if (payload instanceof Uint8Array) {
    if (!mime_type)
      mime_type = DEFAULT_MIME_TYPE;
    payload = new Blob([payload], {type: mime_type});
  }
  const url = URL.createObjectURL(payload);
  return {
    url,
    destroy: async () => URL.revokeObjectURL(url)
  };
}
function can_watch(event3, options = {}) {
  const {change, glob: glob2, inclusive = false, path: path2 = "/", recursive = false, regex, type} = options;
  if (type) {
    if (typeof type === "string") {
      if (event3.type !== type)
        return false;
    } else if (!type.includes(event3.type))
      return false;
  }
  if (change) {
    if (typeof change === "string") {
      if (change !== event3.change)
        return false;
    } else if (!change.includes(event3.change))
      return false;
  }
  if (glob2) {
    const regex2 = make_glob(normalize(glob2));
    return regex2.test(event3.path);
  } else if (regex) {
    return regex.test(event3.path);
  } else {
    if (inclusive) {
      const _path = recursive ? join(path2, "**") : join(path2, "*");
      const regex2 = make_glob(normalize(_path));
      return regex2.test(event3.path);
    }
    return event3.path === normalize(path2);
  }
}
function filter_query(nodes, options = {}) {
  const {path: path2 = {}, type} = options;
  if (type) {
    if (typeof type === "string")
      nodes = nodes.filter((node) => node.type === type);
    else
      nodes = nodes.filter((node) => type.includes(node.type));
  }
  if (path2.glob) {
    const regex = make_glob(normalize(path2.glob));
    nodes = nodes.filter((node) => regex.test(node.path));
  } else if (path2.regex) {
    const {regex} = path2;
    nodes = nodes.filter((node) => regex.test(node.path));
  } else {
    let {path: _path = "/"} = path2;
    _path = path2.recursive ? join(_path, "**") : join(_path, "*");
    const regex = make_glob(normalize(_path));
    nodes = nodes.filter((node) => regex.test(node.path));
  }
  return nodes;
}
function hook_watcher(watcher, options = {}) {
  return event2((dispatch) => {
    const destroy = watcher.subscribe((event3) => {
      if (can_watch(event3, options))
        dispatch(event3);
    });
    return () => destroy();
  });
}
class BaseAdapter {
  constructor(options = {}) {
    this.EVENT_MOUNTED = event2();
    this.EVENT_UNMOUNTED = event2();
    this.options = BaseAdapterOptions(options);
  }
  normalize(path2) {
    return normalize(path2);
  }
  async create_url_object(path2) {
    throw new Error("bad dispatch to 'create_url_object' (not implemented)");
  }
  async get(path2) {
    throw new Error("bad dispatch to 'get' (not implemented)");
  }
  async put(path2, type = NODE_TYPES.undefined, mime_type) {
    throw new Error("bad dispatch to 'put' (not implemented)");
  }
  async query(options = {}) {
    throw new Error("bad dispatch to 'query' (not implemented)");
  }
  async read(path2) {
    throw new Error("bad dispatch to 'get_stats' (not implemented)");
  }
  async reload() {
    throw new Error("bad dispatch to 'reload' (not implemented)");
  }
  async remove(path2) {
    throw new Error("bad dispatch to 'remove' (not implemented)");
  }
  async watch(options = {}) {
    throw new Error("bad dispatch to 'watch' (not implemented)");
  }
  async write(path2, payload) {
    throw new Error("bad dispatch to 'put_payload' (not implemented)");
  }
  is_mounted() {
    throw new Error("bad dispatch to 'is_mounted' (not implemented)");
  }
  async mount() {
    throw new Error("bad dispatch to 'mount' (not implemented)");
  }
  async unmount() {
    throw new Error("bad dispatch to 'unmount' (not implemented)");
  }
}
BaseAdapter.identifier = "base";
BaseAdapter.can_hotlink = false;
BaseAdapter.can_watch = false;
BaseAdapter.can_watch_reload = false;
BaseAdapter.is_available = false;
BaseAdapter.is_readonly = false;
BaseAdapter.requires_mount = false;
export {
  BaseAdapter,
  can_watch,
  create_url_object,
  filter_query,
  hook_watcher
};
//# sourceMappingURL=base_adapter.mjs.map
