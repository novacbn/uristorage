import {event as event2} from "./util/event";
import {ImmutableMap} from "./util/map";
class StorageRegistry extends ImmutableMap {
  constructor() {
    super();
    this.EVENT_MOUNTED = event2();
    this.EVENT_REGISTERED = event2();
    this.EVENT_UNMOUNTED = event2();
    this.EVENT_UNREGISTERED = event2();
    this.clone = (node) => {
      const {storage} = node;
      return {storage};
    };
  }
  clear() {
    const nodes = this.entries();
    for (const [namespace, node] of nodes) {
      const {storage} = node;
      this.EVENT_UNREGISTERED.dispatch({namespace, storage});
    }
    super.clear();
  }
  delete(namespace) {
    const node = this.get(namespace);
    const deleted = super.delete(namespace);
    if (deleted && node) {
      this.EVENT_UNREGISTERED.dispatch({namespace, storage: node.storage});
    }
    return deleted;
  }
  resolve(uri) {
    let url;
    try {
      url = new URL(uri);
    } catch (err) {
      return void 0;
    }
    const namespace = url.protocol.slice(0, -1);
    const node = this.get(namespace);
    if (!node)
      return void 0;
    return {...node, namespace, path: url.pathname};
  }
  set(namespace, node) {
    const {storage} = node;
    super.set(namespace, {...node, namespace});
    storage.EVENT_MOUNTED.subscribe(() => this.EVENT_MOUNTED.dispatch({namespace, storage}));
    storage.EVENT_UNMOUNTED.subscribe(() => this.EVENT_UNMOUNTED.dispatch({namespace, storage}));
    this.EVENT_REGISTERED.dispatch({namespace, storage});
    return this;
  }
}
export {
  StorageRegistry
};
//# sourceMappingURL=storage_registry.js.map
