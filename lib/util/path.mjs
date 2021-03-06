import * as _path from "../vendor/path-browserify";
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
export {
  REGEX_TRAILING_SLASH,
  basename,
  delimiter,
  dirname,
  extname,
  join,
  normalize,
  relative,
  resolve,
  sep
};
//# sourceMappingURL=path.mjs.map
