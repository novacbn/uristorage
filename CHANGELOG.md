# CHANGELOG

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
