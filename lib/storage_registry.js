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
const event = __toModule(require("./util/event"));
const map = __toModule(require("./util/map"));
class StorageRegistry extends map.ImmutableMap {
  constructor() {
    super();
    this.EVENT_MOUNTED = event.event();
    this.EVENT_REGISTERED = event.event();
    this.EVENT_UNMOUNTED = event.event();
    this.EVENT_UNREGISTERED = event.event();
    this.clone = (node) => {
      const {storage} = node;
      return {storage};
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
  delete(namespace) {
    const node = this.get(namespace);
    const deleted = super.delete(namespace);
    if (deleted && node) {
      this.EVENT_UNREGISTERED.dispatch({namespace, storage: node.storage});
    }
    return deleted;
  }
  resolve(uri) {
    let url;
    try {
      url = new URL(uri);
    } catch (err) {
      return void 0;
    }
    const namespace = url.protocol.slice(0, -1);
    const node = this.get(namespace);
    if (!node)
      return void 0;
    return {...node, namespace, path: url.pathname};
  }
  set(namespace, node) {
    const {storage} = node;
    super.set(namespace, {...node, namespace});
    storage.EVENT_MOUNTED.subscribe(() => this.EVENT_MOUNTED.dispatch({namespace, storage}));
    storage.EVENT_UNMOUNTED.subscribe(() => this.EVENT_UNMOUNTED.dispatch({namespace, storage}));
    this.EVENT_REGISTERED.dispatch({namespace, storage});
    return this;
  }
}
//# sourceMappingURL=storage_registry.js.map
