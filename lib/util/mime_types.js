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
  get_mime_type: () => get_mime_type
});
const mime_types = __toModule(require("../data/mime_types.json"));
const path = __toModule(require("./path"));
function get_mime_type(path2) {
  const extension = path.extname("x." + path2).toLowerCase().substr(1);
  if (!extension)
    return null;
  const mime_type = mime_types.default[extension];
  return mime_type ? mime_type : null;
}
//# sourceMappingURL=mime_types.js.map
