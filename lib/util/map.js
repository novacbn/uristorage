var __defineProperty = Object.defineProperty;
var __markAsModule = (target) => {
  return __defineProperty(target, "__esModule", {value: true});
};
var __export = (target, all) => {
  __markAsModule(target);
  for (var name in all)
    __defineProperty(target, name, {get: all[name], enumerable: true});
};
__export(exports, {
  ImmutableMap: () => ImmutableMap
});
class ImmutableMap extends Map {
  constructor() {
    super(...arguments);
    this.clone = (value) => {
      throw new Error("bad dispatch to 'clone' (not implemented)");
    };
  }
  entries() {
    const {clone} = this;
    let entries = Array.from(super.entries());
    entries = entries.map(([key, value], index) => [key, clone(value)]);
    return entries[Symbol.iterator]();
  }
  forEach(callback, thisArg) {
    for (const entry of this) {
      const [key, value] = entry;
      callback.call(thisArg, this.clone(value), key, this);
    }
  }
  get(key) {
    const value = super.get(key);
    if (value !== void 0)
      return this.clone(value);
  }
  set(key, value) {
    value = this.clone(value);
    super.set(key, value);
    return this;
  }
  values() {
    let values = Array.from(super.values());
    values = values.map((value, index) => this.clone(value));
    return values[Symbol.iterator]();
  }
}
//# sourceMappingURL=map.js.map
