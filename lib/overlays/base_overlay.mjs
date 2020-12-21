import {event as event2} from "../util/event";
class BaseOverlay {
  constructor(adapter) {
    this.EVENT_MOUNTED = event2();
    this.EVENT_UNMOUNTED = event2();
    this.adapter = adapter;
    if (!this.has_feature("is_available")) {
      throw new Error("bad dispatch to 'BaseOverlay' (adapter is not available in this context)");
    }
    adapter.EVENT_MOUNTED.subscribe((event3) => this.EVENT_MOUNTED.dispatch({storage: this}));
    adapter.EVENT_UNMOUNTED.subscribe((event3) => this.EVENT_UNMOUNTED.dispatch({storage: this}));
  }
  has_feature(feature) {
    const constructor = this.adapter.constructor;
    return constructor[feature];
  }
  is_mounted() {
    return this.adapter.is_mounted();
  }
  mount() {
    return this.adapter.mount();
  }
  unmount() {
    return this.adapter.unmount();
  }
}
export {
  BaseOverlay
};
//# sourceMappingURL=base_overlay.mjs.map
