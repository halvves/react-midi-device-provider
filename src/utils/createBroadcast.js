// @flow
export type Broadcast = {
  publish: (nextState: Object) => void,
  subscribe: (listener: (state: Object) => void) => Function,
};

export function createBroadcast(initialState: Object): Broadcast {
  let listeners = [];
  let state = initialState;

  function publish(nextState: Object) {
    state = { ...state, ...nextState };

    listeners.forEach(listener => {
      listener(state);
    });
  }

  function subscribe(listener: Function) {
    listeners.push(listener);
    listener(state);
    return () => {
      listeners = listeners.filter(l => l !== listener);
    };
  }

  return { publish, subscribe };
}

export default createBroadcast;
