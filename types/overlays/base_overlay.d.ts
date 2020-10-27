import { BaseAdapter } from "../adapters/base_adapter";
/**
 * Represents the event details dispatched to subscribers via [[BaseOverlay.EVENT_MOUNTED]] / [[BaseOverlay.EVENT_UNMOUNTED]]
 */
interface IMountedEvent {
    storage: BaseOverlay;
}
/**
 * Represents the base common API all URIStorage Overlays ad-here to
 */
export declare class BaseOverlay {
    /**
     * Event that dispatches whenever the Adapter is mounted
     */
    EVENT_MOUNTED: import("../util/event").IEvent<IMountedEvent>;
    /**
     * Event that dispatches whenever the Adapter is unmounted
     */
    EVENT_UNMOUNTED: import("../util/event").IEvent<IMountedEvent>;
    /**
     * Represents the Adapter configured to be overlaid
     */
    adapter: BaseAdapter;
    constructor(adapter: BaseAdapter);
    /**
     * Returns if the currently assigned feature flag is enabled on the configured adapter
     * @param feature
     */
    has_feature(feature: string): boolean;
    /**
     * Returns if the Overlay is currently mounted
     *
     * > **NOTE**: There is no base concept of "mounting", it could be establishing a connection to a FTP
     * > server, mounting a local SQLite3 database, etc, etc
     */
    is_mounted(): boolean;
    /**
     * Mounts the Overlay if currently unmounted
     *
     * > **NOTE**: There is no base concept of "mounting", it could be establishing a connection to a FTP
     * > server, mounting a local SQLite3 database, etc, etc
     */
    mount(): Promise<void>;
    /**
     * Unmounts the Overlay if currently mounted
     *
     * > **NOTE**: There is no base concept of "mounting", it could be establishing a connection to a FTP
     * > server, mounting a local SQLite3 database, etc, etc
     */
    unmount(): Promise<void>;
}
export {};
