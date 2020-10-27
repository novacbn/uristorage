import {BaseAdapter} from "../adapters/base_adapter";
import {event} from "../util/event";

/**
 * Represents the event details dispatched to subscribers via [[BaseOverlay.EVENT_MOUNTED]] / [[BaseOverlay.EVENT_UNMOUNTED]]
 */
interface IMountedEvent {
    storage: BaseOverlay;
}

/**
 * Represents the base common API all URIStorage Overlays ad-here to
 */
export class BaseOverlay {
    /**
     * Event that dispatches whenever the Adapter is mounted
     */
    EVENT_MOUNTED = event<IMountedEvent>();

    /**
     * Event that dispatches whenever the Adapter is unmounted
     */
    EVENT_UNMOUNTED = event<IMountedEvent>();

    /**
     * Represents the Adapter configured to be overlaid
     */
    adapter: BaseAdapter;

    constructor(adapter: BaseAdapter) {
        this.adapter = adapter;

        if (!this.has_feature("is_available")) {
            throw new Error(
                "bad dispatch to 'BaseOverlay' (adapter is not available in this context)"
            );
        }

        adapter.EVENT_MOUNTED.subscribe((event) => this.EVENT_MOUNTED.dispatch({storage: this}));
        adapter.EVENT_UNMOUNTED.subscribe((event) =>
            this.EVENT_UNMOUNTED.dispatch({storage: this})
        );
    }

    /**
     * Returns if the currently assigned feature flag is enabled on the configured adapter
     * @param feature
     */
    has_feature(feature: string): boolean {
        const constructor = this.adapter.constructor as typeof BaseAdapter;

        // @ts-ignore
        return constructor[feature];
    }

    /**
     * Returns if the Overlay is currently mounted
     *
     * > **NOTE**: There is no base concept of "mounting", it could be establishing a connection to a FTP
     * > server, mounting a local SQLite3 database, etc, etc
     */
    is_mounted(): boolean {
        return this.adapter.is_mounted();
    }

    /**
     * Mounts the Overlay if currently unmounted
     *
     * > **NOTE**: There is no base concept of "mounting", it could be establishing a connection to a FTP
     * > server, mounting a local SQLite3 database, etc, etc
     */
    mount(): Promise<void> {
        return this.adapter.mount();
    }

    /**
     * Unmounts the Overlay if currently mounted
     *
     * > **NOTE**: There is no base concept of "mounting", it could be establishing a connection to a FTP
     * > server, mounting a local SQLite3 database, etc, etc
     */
    unmount(): Promise<void> {
        return this.adapter.unmount();
    }
}
