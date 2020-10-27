/**
 * Represents the default [Mime Type](https://en.wikipedia.org/wiki/Media_type#Mime.types) to use whenever one is not
 * specified, or could not be queried
 */
export const DEFAULT_MIME_TYPE = "application/octet-stream";

/**
 * Represents encoding modes supported by various functions, e.g. [[decompress]]
 */
export enum ENCODING_MODE {
    /**
     * Represents that the input or output should be encoded into a `Uint8Array` byte array
     */
    bytes = "MODE_BYTES",

    /**
     * Represents that the input or output should be encoded into a `string`
     */
    text = "MODE_TEXT",
}

export enum NODE_CHANGES {
    attached = "CHANGE_ATTACHED",

    created = "CHANGE_CREATED",

    updated = "CHANGE_UPDATED",

    removed = "CHANGE_REMOVED",
}

/**
 * Represents the standard Node types supported by URIStorage Adapters
 */
export enum NODE_TYPES {
    /**
     * Represents that the Node should be processed as a Directory of Nodes
     */
    directory = "NODE_DIRECTORY",

    /**
     * Represents that the Node should be processed as a File payload
     */
    file = "NODE_FILE",

    /**
     * Represents that the Node has no instrinic representation
     */
    undefined = "NODE_UNDEFINED",
}
