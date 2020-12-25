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
  REGEX_TRAILING_SLASH: () => REGEX_TRAILING_SLASH,
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
const _path = __toModule(require("../vendor/path-browserify"));
const REGEX_TRAILING_SLASH = /[\/]*$/;
const delimiter = ":";
const sep = "/";
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
