import { ENCODING_MODE } from "./constants";
/**
 * Represents the options passable into [[decode_safe]] / [[encode_safe]]
 */
export interface IEncodingOptions {
    /**
     * Represents the returned value's encoded type
     */
    mode?: ENCODING_MODE;
}
/**
 * Returns a decoded [ASCII85](https://en.wikipedia.org/wiki/Ascii85 `buffer` into a `string` or `Uint8Array`
 *
 * > **NOTE**: Some Adapters and Overlays can automatically handle encoding for safe storage, so make sure to not double encode
 *
 * @param buffer
 * @param options
 */
export declare function decode_safe(buffer: string | Uint8Array, options?: {
    mode: ENCODING_MODE.text;
}): string;
export declare function decode_safe(buffer: string | Uint8Array, options?: {
    mode: ENCODING_MODE.bytes;
}): Uint8Array;
/**
 * Returns the given `buffer` decoded from a UTF-8 encoded `Uint8Array` into a `string`
 * @param buffer
 */
export declare function decode_utf8(buffer: Uint8Array): string;
/**
 * Returns a [ASCII85](https://en.wikipedia.org/wiki/Ascii85 encoded `string` or `Uint8Array` from the given `buffer`
 *
 * > **NOTE**: Some Adapters and Overlays can automatically handle encoding for safe storage, so make sure to not double encode
 *
 * @param buffer
 * @param options
 */
export declare function encode_safe(buffer: string | Uint8Array, options?: {
    mode: ENCODING_MODE.text;
}): string;
export declare function encode_safe(buffer: string | Uint8Array, options?: {
    mode: ENCODING_MODE.bytes;
}): Uint8Array;
/**
 * Returns the given `text` into a UTF-8 encoded `Uint8Array`
 * @param text
 */
export declare function encode_utf8(text: string): Uint8Array;
