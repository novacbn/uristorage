import {event as event2} from "../util/event";
import {ImmutableMap} from "../util/map";
class StorageRegistry extends ImmutableMap {
  constructor() {
    super();
    this.EVENT_MOUNTED = event2();
    this.EVENT_REGISTERED = event2();
    this.EVENT_UNMOUNTED = event2();
    this.EVENT_UNREGISTERED = event2();
    this.clone = (node) => {
      const {namespace, storage} = node;
      return {namespace, storage};
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
  register(namespace, storage) {
    if (this.has(namespace)) {
      throw new Error(`bad argument #0 to 'register' (namespace '${namespace}' already registered)`);
    }
    const node = {namespace, storage};
    super.set(namespace, node);
    storage.EVENT_MOUNTED.subscribe(() => this.EVENT_MOUNTED.dispatch({namespace, storage}));
    storage.EVENT_UNMOUNTED.subscribe(() => this.EVENT_UNMOUNTED.dispatch({namespace, storage}));
    this.EVENT_REGISTERED.dispatch({namespace, storage});
    return this;
  }
  unregister(namespace) {
    const node = this.get(namespace);
    if (!node) {
      throw new Error(`bad argument #0 to 'unregister' (namespace '${namespace}' not registered)`);
    }
    super.delete(namespace);
    this.EVENT_UNREGISTERED.dispatch({namespace, storage: node.storage});
    return this;
  }
  resolve(uri) {
    let url;
    try {
      url = new URL(uri);
    } catch (err) {
      return null;
    }
    const namespace = url.protocol.slice(0, -1);
    const node = this.get(namespace);
    if (!node)
      return null;
    return {...node, path: url.pathname};
  }
}
export {
  StorageRegistry
};
//# sourceMappingURL=storage.mjs.map
