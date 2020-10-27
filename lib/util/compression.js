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
