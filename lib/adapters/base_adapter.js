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
  BaseAdapter: () => BaseAdapter,
  can_watch: () => can_watch,
  create_url_object: () => create_url_object,
  filter_query: () => filter_query,
  hook_watcher: () => hook_watcher
});
const constants = __toModule(require("../util/constants"));
const event = __toModule(require("../util/event"));
const glob = __toModule(require("../util/glob"));
const path = __toModule(require("../util/path"));
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
      mime_type = constants.DEFAULT_MIME_TYPE;
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
    const regex2 = glob.make_glob(path.normalize(glob2));
    return regex2.test(event3.path);
  } else if (regex) {
    return regex.test(event3.path);
  } else {
    if (inclusive) {
      const _path = recursive ? path.join(path2, "**") : path.join(path2, "*");
      const regex2 = glob.make_glob(path.normalize(_path));
      return regex2.test(event3.path);
    }
    return event3.path === path.normalize(path2);
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
    const regex = glob.make_glob(path.normalize(path2.glob));
    nodes = nodes.filter((node) => regex.test(node.path));
  } else if (path2.regex) {
    const {regex} = path2;
    nodes = nodes.filter((node) => regex.test(node.path));
  } else {
    let {path: _path = "/"} = path2;
    _path = path2.recursive ? path.join(_path, "**") : path.join(_path, "*");
    const regex = glob.make_glob(path.normalize(_path));
    nodes = nodes.filter((node) => regex.test(node.path));
  }
  return nodes;
}
function hook_watcher(watcher, options = {}) {
  return event.event((dispatch) => {
    const destroy = watcher.subscribe((event3) => {
      if (can_watch(event3, options))
        dispatch(event3);
    });
    return () => destroy();
  });
}
class BaseAdapter {
  constructor(options = {}) {
    this.EVENT_MOUNTED = event.event();
    this.EVENT_UNMOUNTED = event.event();
    this.options = BaseAdapterOptions(options);
  }
  normalize(path2) {
    return path.normalize(path2);
  }
  async create_url_object(path2) {
    throw new Error("bad dispatch to 'create_url_object' (not implemented)");
  }
  async get(path2) {
    throw new Error("bad dispatch to 'get' (not implemented)");
  }
  async put(path2, type = constants.NODE_TYPES.undefined, mime_type) {
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
//# sourceMappingURL=base_adapter.js.map
