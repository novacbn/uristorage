import globToRegExp from "glob-to-regexp";
function make_glob(pattern) {
  return globToRegExp(pattern, {extended: true, globstar: true});
}
export {
  make_glob
};
//# sourceMappingURL=glob.mjs.map
