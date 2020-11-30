# uristorage

## Description

Provides a collection of Adapters that abstract various backends into simplistic Object Storages, along with Overlays to provide further common abstractions.

> **NOTE**: This library provides utilities for working with compression, encoding, UNIX Glob patterns, filesystem paths, and mime types. Please use those, as they are tested to work with the library and _should_ be fully Browser-compatible.

## Developer

### Installation

Open your terminal and install via `npm`:

```sh
npm install git+https://github.com/novacbn/uristorage#0.0.2
```

### Documentation

See TypeDoc documentation at [novacbn.github.io/uristorage](https://novacbn.github.io/uristorage)

### API

> **LEGEND**:
>
> -   `base` — means the API is the base API that all inherting classes implement
> -   `shared` — means the API _should_ works in all Javascript contexts
> -   `whatwg` — means the API works in Javascript contexts that implement the WHATWG [HTML Living Standard](https://html.spec.whatwg.org/multipage/)

-   Adapters

    -   [`BaseAdapter`](https://novacbn.github.io/uristorage/classes/_adapters_base_adapter_.baseadapter.html) — **base**

        -   [`BaseAdapter.can_hotlink`](https://novacbn.github.io/uristorage/classes/_adapters_base_adapter_.baseadapter.html#can_hotlink)
        -   [`BaseAdapter.can_watch`](https://novacbn.github.io/uristorage/classes/_adapters_base_adapter_.baseadapter.html#can_watch)
        -   [`BaseAdapter.can_watch_reload`](https://novacbn.github.io/uristorage/classes/_adapters_base_adapter_.baseadapter.html#can_watch_reload)
        -   [`BaseAdapter.is_available`](https://novacbn.github.io/uristorage/classes/_adapters_base_adapter_.baseadapter.html#is_available)
        -   [`BaseAdapter.is_readonly`](https://novacbn.github.io/uristorage/classes/_adapters_base_adapter_.baseadapter.html#is_readonly)
        -   [`BaseAdapter.requires_mount`](https://novacbn.github.io/uristorage/classes/_adapters_base_adapter_.baseadapter.html#requires_mount)

        -   [`BaseAdapter.EVENT_MOUNTED`](https://novacbn.github.io/uristorage/classes/_adapters_base_adapter_.baseadapter.html#event_mounted)
        -   [`BaseAdapter.EVENT_UNMOUNTED`](https://novacbn.github.io/uristorage/classes/_adapters_base_adapter_.baseadapter.html#event_unmounted)

        -   [`BaseAdapter.create_url_object`](https://novacbn.github.io/uristorage/classes/_adapters_base_adapter_.baseadapter.html#create_url_object)
        -   [`BaseAdapter.get`](https://novacbn.github.io/uristorage/classes/_adapters_base_adapter_.baseadapter.html#get)
        -   [`BaseAdapter.is_mounted`](https://novacbn.github.io/uristorage/classes/_adapters_base_adapter_.baseadapter.html#is_mounted)
        -   [`BaseAdapter.mount`](https://novacbn.github.io/uristorage/classes/_adapters_base_adapter_.baseadapter.html#mount)
        -   [`BaseAdapter.put`](https://novacbn.github.io/uristorage/classes/_adapters_base_adapter_.baseadapter.html#put)
        -   [`BaseAdapter.query`](https://novacbn.github.io/uristorage/classes/_adapters_base_adapter_.baseadapter.html#query)
        -   [`BaseAdapter.read`](https://novacbn.github.io/uristorage/classes/_adapters_base_adapter_.baseadapter.html#read)
        -   [`BaseAdapter.reload`](https://novacbn.github.io/uristorage/classes/_adapters_base_adapter_.baseadapter.html#reload)
        -   [`BaseAdapter.remove`](https://novacbn.github.io/uristorage/classes/_adapters_base_adapter_.baseadapter.html#remove)
        -   [`BaseAdapter.unmount`](https://novacbn.github.io/uristorage/classes/_adapters_base_adapter_.baseadapter.html#unmount)
        -   [`BaseAdapter.watch`](https://novacbn.github.io/uristorage/classes/_adapters_base_adapter_.baseadapter.html#watch)
        -   [`BaseAdapter.write`](https://novacbn.github.io/uristorage/classes/_adapters_base_adapter_.baseadapter.html#write)

    -   [`IndexedDBAdapter`](https://novacbn.github.io/uristorage/classes/_adapters_whatwg_indexeddb_.indexeddbadapter.html) — **whatwg**
    -   [`MemoryAdapter`](https://novacbn.github.io/uristorage/classes/_adapters_shared_memory_.memoryadapter.html) — **shared**

    -   [`WebStorageAdapter`](https://novacbn.github.io/uristorage/classes/_adapters_whatwg_webstorage_.webstorageadapter.html) — **base**

        -   [`LocalStorageAdapter`](https://novacbn.github.io/uristorage/classes/_adapters_whatwg_webstorage_.localstorageadapter.html) — **whatwg**
        -   [`SessionStorageAdapter`](https://novacbn.github.io/uristorage/classes/_adapters_whatwg_webstorage_.sessionstorageadapter.html) — **whatwg**

-   Overlays

    -   [`BaseOverlay`](https://novacbn.github.io/uristorage/classes/_overlays_base_overlay_.baseoverlay.html) — **base**

        -   [`BaseOverlay.EVENT_MOUNTED`](https://novacbn.github.io/uristorage/classes/_overlays_base_overlay_.baseoverlay.html#event_mounted)
        -   [`BaseOverlay.EVENT_UNMOUNTED`](https://novacbn.github.io/uristorage/classes/_overlays_base_overlay_.baseoverlay.html#event_unmounted)

        -   [`BaseOverlay.is_mounted`](https://novacbn.github.io/uristorage/classes/_overlays_base_overlay_.baseoverlay.html#is_mounted)
        -   [`BaseOverlay.mount`](https://novacbn.github.io/uristorage/classes/_overlays_base_overlay_.baseoverlay.html#mount)
        -   [`BaseOverlay.unmount`](https://novacbn.github.io/uristorage/classes/_overlays_base_overlay_.baseoverlay.html#unmount)

    -   [`FileSystemOverlay`](https://novacbn.github.io/uristorage/classes/_overlays_file_system_.filesystemoverlay.html) — **shared**

        -   [`FileSystemOverlay.create_directory`](https://novacbn.github.io/uristorage/classes/_overlays_file_system_.filesystemoverlay.html#create_directory)
        -   [`FileSystemOverlay.create_scope`](https://novacbn.github.io/uristorage/classes/_overlays_file_system_.filesystemoverlay.html#create_scope)
        -   [`FileSystemOverlay.create_url_object`](https://novacbn.github.io/uristorage/classes/_overlays_file_system_.filesystemoverlay.html#create_url_object)
        -   [`FileSystemOverlay.exists`](https://novacbn.github.io/uristorage/classes/_overlays_file_system_.filesystemoverlay.html#exists)
        -   [`FileSystemOverlay.get_stats`](https://novacbn.github.io/uristorage/classes/_overlays_file_system_.filesystemoverlay.html#get_stats)
        -   [`FileSystemOverlay.read_directory`](https://novacbn.github.io/uristorage/classes/_overlays_file_system_.filesystemoverlay.html#read_directory)
        -   [`FileSystemOverlay.read_file`](https://novacbn.github.io/uristorage/classes/_overlays_file_system_.filesystemoverlay.html#read_file)
        -   [`FileSystemOverlay.read_file_json`](https://novacbn.github.io/uristorage/classes/_overlays_file_system_.filesystemoverlay.html#read_file_json)
        -   [`FileSystemOverlay.read_file_text`](https://novacbn.github.io/uristorage/classes/_overlays_file_system_.filesystemoverlay.html#read_file_text)
        -   [`FileSystemOverlay.remove_directory`](https://novacbn.github.io/uristorage/classes/_overlays_file_system_.filesystemoverlay.html#remove_directory)
        -   [`FileSystemOverlay.remove_file`](https://novacbn.github.io/uristorage/classes/_overlays_file_system_.filesystemoverlay.html#remove_file)
        -   [`FileSystemOverlay.write_file`](https://novacbn.github.io/uristorage/classes/_overlays_file_system_.filesystemoverlay.html#write_file)
        -   [`FileSystemOverlay.write_file_json`](https://novacbn.github.io/uristorage/classes/_overlays_file_system_.filesystemoverlay.html#write_file_json)
        -   [`FileSystemOverlay.write_file_text`](https://novacbn.github.io/uristorage/classes/_overlays_file_system_.filesystemoverlay.html#write_file_text)

-   Miscellaneous

    -   [`StorageRegistry`](https://novacbn.github.io/uristorage/classes/_storage_registry_.storageregistry.html) — **shared**

-   Utilities

    -   Adapters

        -   [`create_url_object`](https://novacbn.github.io/uristorage/classes/_overlays_file_system_.filesystemoverlay.html#create_url_object) — **shared**
        -   [`can_watch`](https://novacbn.github.io/uristorage/classes/_overlays_file_system_.filesystemoverlay.html#can_watch) — **shared**
        -   [`filter_query`](https://novacbn.github.io/uristorage/classes/_overlays_file_system_.filesystemoverlay.html#filter_query) — **shared**
        -   [`hook_watcher`](https://novacbn.github.io/uristorage/classes/_overlays_file_system_.filesystemoverlay.html#hook_watcher) — **shared**

    -   Compression

        -   [`compress`](https://novacbn.github.io/uristorage/modules/_util_compression_.html#compress) — **shared**
        -   [`decompress`](https://novacbn.github.io/uristorage/modules/_util_compression_.html#decompress) — **shared**

    -   Encoding

        -   [`decode_safe`](https://novacbn.github.io/uristorage/modules/_util_encoding_.html#decode_safe) — **shared**
        -   [`decode_text`](https://novacbn.github.io/uristorage/modules/_util_encoding_.html#decode_text) — **shared**
        -   [`encode_safe`](https://novacbn.github.io/uristorage/modules/_util_encoding_.html#encode_safe) — **shared**
        -   [`encode_text`](https://novacbn.github.io/uristorage/modules/_util_encoding_.html#encode_text) — **shared**

    -   UNIX Globs

        -   [`make_glob`](https://novacbn.github.io/uristorage/modules/_util_glob_.html#make_glob) — **shared**

    -   Mime Types

        -   [`get_mime_type`](https://novacbn.github.io/uristorage/modules/_util_mime_types_.html#get_mime_type) — **shared**

    -   Paths

        -   [`delimiter`](https://novacbn.github.io/uristorage/modules/_util_path_.html#delimiter) — **shared**
        -   [`sep`](https://novacbn.github.io/uristorage/modules/_util_path_.html#sep) — **shared**
        -   [`basename`](https://novacbn.github.io/uristorage/modules/_util_path_.html#basename) — **shared**
        -   [`dirname`](https://novacbn.github.io/uristorage/modules/_util_path_.html#dirname) — **shared**
        -   [`extname`](https://novacbn.github.io/uristorage/modules/_util_path_.html#extname) — **shared**
        -   [`join`](https://novacbn.github.io/uristorage/modules/_util_path_.html#join) — **shared**
        -   [`normalize`](https://novacbn.github.io/uristorage/modules/_util_path_.html#normalize) — **shared**
        -   [`relative`](https://novacbn.github.io/uristorage/modules/_util_path_.html#relative) — **shared**
        -   [`resolve`](https://novacbn.github.io/uristorage/modules/_util_path_.html#resolve) — **shared**
