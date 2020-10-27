import { ENCODING_MODE } from "./constants";
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
export declare function compress(buffer: string | Uint8Array, options?: ICompressionOptions): Uint8Array;
/**
 * Returns the `buffer` decompressed, via LZ77 Compression, into a `string` or `Uint8Array`
 *
 * > **NOTE**: Some Adapters and Overlays can automatically handle compression, so make sure to not double compress
 *
 * @param buffer
 * @param options
 */
export declare function decompress(buffer: string | Uint8Array, options?: {
    mode: ENCODING_MODE.bytes;
}): Uint8Array;
export declare function decompress(buffer: string | Uint8Array, options?: {
    mode: ENCODING_MODE.text;
}): string;
