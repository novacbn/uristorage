var __defineProperty = Object.defineProperty;
var __hasOwnProperty = Object.prototype.hasOwnProperty;
var __markAsModule = (target) => {
  return __defineProperty(target, "__esModule", {value: true});
};
var __export = (target, all) => {
  __markAsModule(target);
  for (var name in all)
    __defineProperty(target, name, {get: all[name], enumerable: true});
};
var __exportStar = (target, module2) => {
  __markAsModule(target);
  if (typeof module2 === "object" || typeof module2 === "function") {
    for (let key in module2)
      if (!__hasOwnProperty.call(target, key) && key !== "default")
        __defineProperty(target, key, {get: () => module2[key], enumerable: true});
  }
  return target;
};
var __toModule = (module2) => {
  if (module2 && module2.__esModule)
    return module2;
  return __exportStar(__defineProperty({}, "default", {value: module2, enumerable: true}), module2);
};
__export(exports, {
  basename: () => basename,
  delimiter: () => delimiter,
  dirname: () => dirname,
  extname: () => extname,
  join: () => join,
  normalize: () => normalize,
  relative: () => relative,
  resolve: () => resolve,
  sep: () => sep
});
const _path = __toModule(require("path-browserify"));
const REGEX_TRAILING_SLASH = /[\/]*$/;
const delimiter = _path.delimiter;
const sep = _path.sep;
const basename = _path.basename;
const extname = _path.extname;
const join = _path.join;
const relative = _path.relative;
const resolve = _path.resolve;
function dirname(p) {
  p = _path.dirname(p);
  return p === "." ? sep : p;
}
function normalize(p) {
  p = _path.normalize(p);
  if (p === "." || p === sep)
    return sep;
  if (p.slice(0, 1) !== sep)
    p = sep + p;
  return p.replace(REGEX_TRAILING_SLASH, "");
}
//# sourceMappingURL=path.js.map
