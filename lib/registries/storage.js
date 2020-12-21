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
  StorageRegistry: () => StorageRegistry
});
const event = __toModule(require("../util/event"));
const map = __toModule(require("../util/map"));
class StorageRegistry extends map.ImmutableMap {
  constructor() {
    super();
    this.EVENT_MOUNTED = event.event();
    this.EVENT_REGISTERED = event.event();
    this.EVENT_UNMOUNTED = event.event();
    this.EVENT_UNREGISTERED = event.event();
    this.clone = (node) => {
      const {namespace, storage} = node;
      return {namespace, storage};
    };
  }
  clear() {
    const nodes = this.entries();
    for (const [namespace, node] of nodes) {
      const {storage} = node;
      this.EVENT_UNREGISTERED.dispatch({namespace, storage});
    }
    super.clear();
  }
  register(namespace, storage) {
    if (this.has(namespace)) {
      throw new Error(`bad argument #0 to 'register' (namespace '${namespace}' already registered)`);
    }
    const node = {namespace, storage};
    this.set(namespace, node);
    storage.EVENT_MOUNTED.subscribe(() => this.EVENT_MOUNTED.dispatch({namespace, storage}));
    storage.EVENT_UNMOUNTED.subscribe(() => this.EVENT_UNMOUNTED.dispatch({namespace, storage}));
    this.EVENT_REGISTERED.dispatch({namespace, storage});
    return this;
  }
  unregister(namespace) {
    const node = this.get(namespace);
    if (!node) {
      throw new Error(`bad argument #0 to 'unregister' (namespace '${namespace}' not registered)`);
    }
    const {storage} = node;
    if (storage.is_mounted())
      storage.unmount();
    super.delete(namespace);
    this.EVENT_UNREGISTERED.dispatch({namespace, storage: node.storage});
    return this;
  }
  resolve(uri) {
    let url;
    try {
      url = new URL(uri);
    } catch (err) {
      return null;
    }
    const namespace = url.protocol.slice(0, -1);
    const node = this.get(namespace);
    if (!node)
      return null;
    return {...node, path: url.pathname};
  }
}
//# sourceMappingURL=storage.js.map
