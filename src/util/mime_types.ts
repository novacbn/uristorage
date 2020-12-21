import MIME_TYPES from "../data/mime_types";

import {extname} from "./path";

// NOTE: Abstracted for backend / package changes while remaining API-compatible

/**
 * Returns the mime type for the given path's extension, returns `null` if not applicable
 * @param path
 */
export function get_mime_type(path: string): string | null {
    const extension = extname("x." + path)
        .toLowerCase()
        .substr(1);

    if (!extension) return null;

    const mime_type = (MIME_TYPES as {[key: string]: string | undefined})[extension];
    return mime_type ? mime_type : null;
}
