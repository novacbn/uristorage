import {compress as compress_lz, decompress as decompress_lz} from "lzutf8";

import {ENCODING_MODE} from "./constants";

// NOTE: Abstracted for backend / package changes while remaining API-compatible

/**
 * Represents the options passable into [[compress]] / [[decompress]]
 */
export interface ICompressionOptions {
    /**
     * Represents the returned value's encoded type
     */
    mode?: ENCODING_MODE;
}

/**
 * Returns the `buffer` compressed via LZ77 Compression
 *
 * > **NOTE**: Only [[ENCODING_MODE.bytes]] supports for [[ICompressionOptions.mode]]
 *
 * > **NOTE**: Some Adapters and Overlays can automatically handle compression, so make sure to not double compress
 *
 * @param buffer
 * @param options
 */
export function compress(
    buffer: string | Uint8Array,
    options: ICompressionOptions = {}
): Uint8Array {
    const {mode = ENCODING_MODE.bytes} = options;

    switch (mode) {
        case ENCODING_MODE.bytes:
            return compress_lz(buffer, {outputEncoding: "ByteArray"});

        default:
            throw new Error(
                `bad option 'options.mode' to 'compress' (encoding mode '${mode}' not available)`
            );
    }
}

/**
 * Returns the `buffer` decompressed, via LZ77 Compression, into a `string` or `Uint8Array`
 *
 * > **NOTE**: Some Adapters and Overlays can automatically handle compression, so make sure to not double compress
 *
 * @param buffer
 * @param options
 */
export function decompress(
    buffer: string | Uint8Array,
    options?: {mode: ENCODING_MODE.bytes}
): Uint8Array;
export function decompress(
    buffer: string | Uint8Array,
    options?: {mode: ENCODING_MODE.text}
): string;
export function decompress(
    buffer: string | Uint8Array,
    options: ICompressionOptions = {}
): string | Uint8Array {
    const {mode = ENCODING_MODE.bytes} = options;

    switch (mode) {
        case ENCODING_MODE.bytes:
            return decompress_lz(buffer, {outputEncoding: "ByteArray"});

        case ENCODING_MODE.text:
            return decompress_lz(buffer, {outputEncoding: "String"});

        default:
            throw new Error(
                `bad option 'options.mode' to 'decompress' (encoding mode '${mode}' not available)`
            );
    }
}
