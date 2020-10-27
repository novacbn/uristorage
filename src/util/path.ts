// @ts-ignore
import * as _path from "path-browserify";

// NOTE: Abstracted for backend / package changes while remaining API-compatible

// NOTE: Types pulled from https://github.com/DefinitelyTyped/DefinitelyTyped/blob/master/types/node/path.d.ts

/**
 * Represents the Regular Expression used to reduce trailing separators
 *
 * @internal
 */
const REGEX_TRAILING_SLASH = /[\/]*$/;

/**
 * The platform-specific file delimiter. Always ':'.
 */
export const delimiter: string = _path.delimiter;

/**
 * The platform-specific file separator. Always '/'.
 */
export const sep: string = _path.sep;

/**
 * Return the last portion of a path. Similar to the Unix basename command.
 * Often used to extract the file name from a fully qualified path.
 *
 * @param p
 * @param ext
 */
export const basename: (p: string, ext?: string) => string = _path.basename;

/**
 * Return the extension of the path, from the last '.' to end of string in the last portion of the path.
 * If there is no '.' in the last portion of the path or the first character of it is '.', then it returns an empty string
 *
 * @param p
 */
export const extname: (path: string) => string = _path.extname;

/**
 * Join all arguments together and normalize the resulting path.
 *
 * @param paths
 */
export const join: (...paths: string[]) => string = _path.join;

/**
 * Solve the relative path from {from} to {to}.
 * At times we have two absolute paths, and we need to derive the relative path from one to the other. This is actually the reverse transform of path.resolve.
 * @param from
 * @param to
 */
export const relative: (from: string, to: string) => string = _path.relative;

/**
 * The right-most parameter is considered {to}.  Other parameters are considered an array of {from}.
 *
 * Starting from leftmost {from} parameter, resolves {to} to an absolute path.
 *
 * If {to} isn't already absolute, {from} arguments are prepended in right to left order,
 * until an absolute path is found. If after using all {from} paths still no absolute path is found,
 * the current working directory is used as well. The resulting path is normalized,
 * and trailing slashes are removed unless the path gets resolved to the root directory.
 *
 * @param pathSegments
 */
export const resolve: (...pathSegments: string[]) => string = _path.resolve;

/**
 * Return the directory name of a path. Similar to the Unix dirname command.
 *
 * @param p
 */
export function dirname(p: string): string {
    p = _path.dirname(p);

    return p === "." ? sep : p;
}

/**
 * Normalize a string path, reducing '..' and '.' parts.
 * When multiple slashes are found, they're replaced by a single one; when the path contains a trailing slash, it is preserved.
 * When the path is normalized to a single `.` part, the platform seperator is returned.
 * When the path has trailing platform separator(s), they are removed.
 * All paths are prefixed with the platform separator.
 *
 * @param p
 */
export function normalize(p: string): string {
    p = _path.normalize(p);

    if (p === "." || p === sep) return sep;
    if (p.slice(0, 1) !== sep) p = sep + p;

    return p.replace(REGEX_TRAILING_SLASH, "");
}
