const { expectedEventName: expectedEventName_ } = require("oberknecht-utils");

const oberknechtActionEmitterOptions = require("../arguments/oberknecht.action.emitter.options");

class knechtActionEmitter {
  defaultdelay = 300;
  timeout = 3000;
  queue = [];
  isWorkingHard = false;
  #alwaysResolve = ["PRIVMSG"];
  #alwaysIgnore = ["PRIVMSG"];
  _options = oberknechtActionEmitterOptions;

  /** @param {oberknechtActionEmitterOptions} options */
  constructor(options) {
    this.queue = [];
    if(!options) options = {};

    this._options = options;
  };

  /** @param {string} eventName @param {*} args */
  emit = (eventName, args, returntype) => {
    if (this.queue.length === 0) return;
    if (this.#alwaysIgnore.includes(eventName)) return;

    let events = this.queue.filter((e) => {
      return (e.inQueue && !e.isDone && !e.timedOut && (e.expectedEventName ?? e.eventName).toUpperCase() == eventName);
    });
    let event = events[0];

    if (!event) {
      if (
        this.queue.filter((e) => {
          return (!e.isDone && e.inQueue && !e.timedOut);
        }).length === 0
      ) {
        this.queue = [];
      };
      return;
    }

    event.inQueue = false;
    event.isDone = true;
    clearTimeout(event.to);
    returntype = (!(returntype ?? undefined) ? 1 : returntype);
    switch (returntype) {
      case 1: default: return event.resolve(args);
      case 2: return event.reject(args);
    }
  };

  emitresolve = (eventName, args) => {
    return this.emit(eventName, args, 1);
  };

  emitreject = (eventName, args) => {
    return this.emit(eventName, args, 2);
  };

  once = (eventName, fn, args, expectedEventName, customDelay, sendAsync) => {
    return new Promise((resolve, reject) => {
      if (this.#alwaysResolve.includes(eventName) || sendAsync) {
        fn(args);
        return resolve();
      };

      const item = {
        sym: Symbol(),
        eventName: eventName,
        expectedEventName: expectedEventName ?? (this._options.useExpectedEventNames ? expectedEventName_(eventName) : undefined),
        fn: fn,
        resolve: resolve,
        reject: reject,
        delay: customDelay ?? null,
        args: args ?? undefined,
        inQueue: false,
        isDone: false,
        timedOut: false,
        to: undefined,
      };

      this.queue.push(item);

      if (!this.isWorkingHard) {
        this.next(item.sym);
      }
    });
  };

  next = (sym) => {
    this.isWorkingHard = true;
    const item = this.queue.filter((v, i) => {
      return v.sym === sym;
    })[0];

    if (!item) {
      return console.error("item not found", this.queue);
    };

    item.inQueue = true;
    item.fn(item.args);
    item.to = setTimeout(() => {
      item.timedOut = true;
      return item.reject(Error("action timed out"));
    }, this.timeout);

    const next =
      this.queue.indexOf(item) > -1 && this.queue[this.queue.indexOf(item) + 1]
        ? this.queue[this.queue.indexOf(item) + 1]
        : undefined;

    if (!next) {
      this.isWorkingHard = false;
      return;
    };

    setTimeout(() => {
      this.next(next.sym);
    }, (next.delay ?? this.defaultdelay));
  };
};

module.exports = knechtActionEmitter;