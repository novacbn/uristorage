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
  compress: () => compress,
  decompress: () => decompress
});
const lzutf8 = __toModule(require("lzutf8"));
const constants = __toModule(require("./constants"));
function compress(buffer, options = {}) {
  const {mode = constants.ENCODING_MODE.bytes} = options;
  switch (mode) {
    case constants.ENCODING_MODE.bytes:
      return lzutf8.compress(buffer, {outputEncoding: "ByteArray"});
    default:
      throw new Error(`bad option 'options.mode' to 'compress' (encoding mode '${mode}' not available)`);
  }
}
function decompress(buffer, options = {}) {
  const {mode = constants.ENCODING_MODE.bytes} = options;
  switch (mode) {
    case constants.ENCODING_MODE.bytes:
      return lzutf8.decompress(buffer, {outputEncoding: "ByteArray"});
    case constants.ENCODING_MODE.text:
      return lzutf8.decompress(buffer, {outputEncoding: "String"});
    default:
      throw new Error(`bad option 'options.mode' to 'decompress' (encoding mode '${mode}' not available)`);
  }
}
//# sourceMappingURL=compression.js.map
