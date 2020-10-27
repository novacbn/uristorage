// @ts-ignore
import {decode as decode_base85, encode as encode_base85} from "base85";

import {ENCODING_MODE} from "./constants";

// NOTE: Abstracted for backend / package changes while remaining API-compatible

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
export function decode_safe(
    buffer: string | Uint8Array,
    options?: {mode: ENCODING_MODE.text}
): string;
export function decode_safe(
    buffer: string | Uint8Array,
    options?: {mode: ENCODING_MODE.bytes}
): Uint8Array;
export function decode_safe(
    buffer: Uint8Array | string,
    options: IEncodingOptions = {}
): string | Uint8Array {
    const {mode = ENCODING_MODE.text} = options;

    switch (mode) {
        case ENCODING_MODE.bytes:
            return decode_base85(buffer, "ByteArray");

        case ENCODING_MODE.text:
            return decode_base85(buffer, "String");

        default:
            throw new Error(
                `bad option 'options.mode' to 'decode_safe' (encoding mode '${mode}' not available)`
            );
    }
}

/**
 * Returns the given `buffer` decoded from a UTF-8 encoded `Uint8Array` into a `string`
 * @param buffer
 */
export function decode_utf8(buffer: Uint8Array): string {
    const decoder = new TextDecoder();

    return decoder.decode(buffer);
}

/**
 * Returns a [ASCII85](https://en.wikipedia.org/wiki/Ascii85 encoded `string` or `Uint8Array` from the given `buffer`
 *
 * > **NOTE**: Some Adapters and Overlays can automatically handle encoding for safe storage, so make sure to not double encode
 *
 * @param buffer
 * @param options
 */
export function encode_safe(
    buffer: string | Uint8Array,
    options?: {mode: ENCODING_MODE.text}
): string;
export function encode_safe(
    buffer: string | Uint8Array,
    options?: {mode: ENCODING_MODE.bytes}
): Uint8Array;
export function encode_safe(
    buffer: Uint8Array | string,
    options: IEncodingOptions = {}
): Uint8Array | string {
    const {mode = ENCODING_MODE.text} = options;

    switch (mode) {
        case ENCODING_MODE.bytes:
            return encode_base85(buffer, "ByteArray");

        case ENCODING_MODE.text:
            return encode_base85(buffer, "String");

        default:
            throw new Error(
                `bad option 'options.mode' to 'encode_safe' (encoding mode '${mode}' not available)`
            );
    }
}

/**
 * Returns the given `text` into a UTF-8 encoded `Uint8Array`
 * @param text
 */
export function encode_utf8(text: string): Uint8Array {
    const encoder = new TextEncoder();

    return encoder.encode(text);
}
