import MIME_TYPES from "../data/mime_types.json";
import {extname} from "./path";
function get_mime_type(path2) {
  const extension = extname("x." + path2).toLowerCase().substr(1);
  if (!extension)
    return null;
  const mime_type = MIME_TYPES[extension];
  return mime_type ? mime_type : null;
}
export {
  get_mime_type
};
//# sourceMappingURL=mime_types.js.map
