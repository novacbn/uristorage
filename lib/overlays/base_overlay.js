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
  BaseOverlay: () => BaseOverlay
});
const event = __toModule(require("../util/event"));
class BaseOverlay {
  constructor(adapter) {
    this.EVENT_MOUNTED = event.event();
    this.EVENT_UNMOUNTED = event.event();
    this.adapter = adapter;
    if (!this.has_feature("is_available")) {
      throw new Error("bad dispatch to 'BaseOverlay' (adapter is not available in this context)");
    }
    adapter.EVENT_MOUNTED.subscribe((event3) => this.EVENT_MOUNTED.dispatch({storage: this}));
    adapter.EVENT_UNMOUNTED.subscribe((event3) => this.EVENT_UNMOUNTED.dispatch({storage: this}));
  }
  has_feature(feature) {
    const constructor = this.adapter.constructor;
    return constructor[feature];
  }
  is_mounted() {
    return this.adapter.is_mounted();
  }
  mount() {
    return this.adapter.mount();
  }
  unmount() {
    return this.adapter.unmount();
  }
}
//# sourceMappingURL=base_overlay.js.map
