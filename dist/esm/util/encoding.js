import {decode as decode_base85, encode as encode_base85} from "base85";
import {ENCODING_MODE} from "./constants";
function decode_safe(buffer, options = {}) {
  const {mode = ENCODING_MODE.text} = options;
  switch (mode) {
    case ENCODING_MODE.bytes:
      return decode_base85(buffer, "ByteArray");
    case ENCODING_MODE.text:
      return decode_base85(buffer, "String");
    default:
      throw new Error(`bad option 'options.mode' to 'decode_safe' (encoding mode '${mode}' not available)`);
  }
}
function decode_utf8(buffer) {
  const decoder = new TextDecoder();
  return decoder.decode(buffer);
}
function encode_safe(buffer, options = {}) {
  const {mode = ENCODING_MODE.text} = options;
  switch (mode) {
    case ENCODING_MODE.bytes:
      return encode_base85(buffer, "ByteArray");
    case ENCODING_MODE.text:
      return encode_base85(buffer, "String");
    default:
      throw new Error(`bad option 'options.mode' to 'encode_safe' (encoding mode '${mode}' not available)`);
  }
}
function encode_utf8(text) {
  const encoder = new TextEncoder();
  return encoder.encode(text);
}
export {
  decode_safe,
  decode_utf8,
  encode_safe,
  encode_utf8
};
//# sourceMappingURL=encoding.js.map
