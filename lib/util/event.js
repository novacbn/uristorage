var __defProp = Object.defineProperty;
var __markAsModule = (target) => __defProp(target, "__esModule", {value: true});
var __export = (target, all) => {
  __markAsModule(target);
  for (var name in all)
    __defProp(target, name, {get: all[name], enumerable: true});
};
__export(exports, {
  event: () => event
});
function event(start) {
  const subscribers = [];
  let stop;
  const dispatch = (details) => {
    if (subscribers.length > 0) {
      for (let index = 0; index < subscribers.length; index++) {
        const [run] = subscribers[index];
        run(details);
      }
    }
  };
  const subscribe = (run) => {
    const subscriber = [run];
    subscribers.push(subscriber);
    if (start && subscribers.length === 1)
      stop = start(dispatch);
    return () => {
      const index = subscribers.indexOf(subscriber);
      if (index > 0) {
        subscribers.splice(index, 1);
        if (stop && subscribers.length == 0) {
          stop();
          stop = null;
        }
      }
    };
  };
  return {dispatch, subscribe};
}
//# sourceMappingURL=event.js.map
