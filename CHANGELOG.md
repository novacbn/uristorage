# CHANGELOG

## v0.0.5 (2020/12/25)

-   Added simple identifiers for Adapter handling
-   Added missing package-level type exports
-   Added docstrings to `FileSystemRegistry` / `StorageRegistry`
-   Added `null` and `object` to `IJSONValue` type
-   Updated `StorageRegistry.resolve`
    -   Normalizes the returned path
    -   Normalizes URI protocol before resolving
-   Vendored `path-browserify`

## v0.0.4 (2020/12/21)

-   Added `IJSONArray` / `IJSONObject` types to exports as shortcut aliases
-   Added `FileSystemRegistry` which extends `StorageRegistry`
    -   Supports all `FileSystemOverlay` methods, selecting the appropriate registered `FileSystemOverlay` by URI protocol
-   Updated `StorageRegistry.(delete / set)` to `StorageRegistry.(register / unregister)`
    -   Updated `StorageRegistry.unregister` to unmount Storage nodes
-   Updated `StorageRegister.resolve`
    -   Updated to accept `URL` instances
    -   Updated to return `null` on non-registered protocols
-   Updated mimetypes build script to export a TypeScript (`.ts`) file instead of a JSON (`.json`) file
-   Updated build script to export ECMAScript Module (`.mjs`) files instead of separate directory

## v0.0.3 (2020/12/07)

-   Fixed bug where `WebStorageAdapter` would not remove directories

## v0.0.2 (2020/11/30)

-   Added `FileSystemOverlay.create_scope(path: string): FileSystemOverlay`, which returns a new `FileSystemOverlay` instance scoped to the given path
-   Added `FileSystemOptions` with new `FileSystemOptions.scope: (part: string) => string | string` option, allowing you to initialize a `FileSystemOverlay` with an already given scope
-   Fixed broken import for mimetype database
-   Updated `FileSystemOverlay` constructor to accept `FileSystemOptions`
-   Updated `esbuild` `0.7.5` -> `0.7.22`

## v0.0.1 (2020/10/27)

-   Initial release
