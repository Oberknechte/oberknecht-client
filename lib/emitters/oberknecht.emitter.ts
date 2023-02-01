// type EventMap = Record<string,Function>;

// type EventKey<T extends EventMap> = string & keyof;
// // type EventKey<T extends EventMap> = string & keyof T;
// type EventCallback<P> = (params: P) => {};

// interface oberknechtEmitter<T extends EventMap> {
//     addListener<K extends EventKey<T>> (eventName: K, callback: EventCallback<T>);
// };