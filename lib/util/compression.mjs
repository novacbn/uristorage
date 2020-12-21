import {compress as compress_lz, decompress as decompress_lz} from "lzutf8";
import {ENCODING_MODE} from "./constants";
function compress(buffer, options = {}) {
  const {mode = ENCODING_MODE.bytes} = options;
  switch (mode) {
    case ENCODING_MODE.bytes:
      return compress_lz(buffer, {outputEncoding: "ByteArray"});
    default:
      throw new Error(`bad option 'options.mode' to 'compress' (encoding mode '${mode}' not available)`);
  }
}
function decompress(buffer, options = {}) {
  const {mode = ENCODING_MODE.bytes} = options;
  switch (mode) {
    case ENCODING_MODE.bytes:
      return decompress_lz(buffer, {outputEncoding: "ByteArray"});
    case ENCODING_MODE.text:
      return decompress_lz(buffer, {outputEncoding: "String"});
    default:
      throw new Error(`bad option 'options.mode' to 'decompress' (encoding mode '${mode}' not available)`);
  }
}
export {
  compress,
  decompress
};
//# sourceMappingURL=compression.mjs.map
