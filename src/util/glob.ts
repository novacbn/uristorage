import globToRegExp from "glob-to-regexp";

/**
 * Returns a [Bash Shell Glob](https://en.wikipedia.org/wiki/Glob_(programming)) pattern processed into a [Regular Expression](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/RegExp)
 * @param pattern
 */
export function make_glob(pattern: string): RegExp {
    return globToRegExp(pattern, {extended: true, globstar: true});
}
