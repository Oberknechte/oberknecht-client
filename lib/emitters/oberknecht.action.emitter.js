const expectedEventName = require("../util/expectedEventName");

module.exports = class knechtActionEmitter {
  defaultdelay = 300;
  timeout = 3000;
  queue = [];
  isWorkingHard = false;
  #alwaysResolve = ["PRIVMSG"];
  #alwaysIgnore = ["PRIVMSG"];

  constructor() {
    this.queue = [];
  };

  emit = (eventName, args) => {
    // console.log(`emit`, eventName, args);
    if (this.queue.length === 0) return;
    if (this.#alwaysIgnore.includes(eventName)) return;
    
    let events = this.queue.filter((e) => {
      return (
        e.inQueue &&
        !e.isDone &&
        (e.expectedEventName ?? e.eventName) === eventName
        );
      });
      let event = events[0];
      // console.log(`\t`, event);

    if (!event) {
      if (
        this.queue.filter((e) => {
          return !e.isDone;
        }).length === 0
      ) {
        this.queue = [];
      };

      return;
    }

    event.inQueue = false;
    event.isDone = true;
    clearTimeout(event.to);
    return event.resolve(args);
  };

  emitresolve = this.emit;

  emitreject = (eventName, args) => {
    if (this.queue.length === 0) return;
    if (this.#alwaysIgnore.includes(eventName)) return;
    
    let events = this.queue.filter((e) => {
      return (
        e.inQueue &&
        !e.isDone &&
        (e.expectedEventName ?? e.eventName) === eventName
        );
      });
      let event = events[0];

    if (!event) {
      if (
        this.queue.filter((e) => {
          return !e.isDone;
        }).length === 0
      ) {
        this.queue = [];
      };

      return;
    }

    event.inQueue = false;
    event.isDone = true;
    clearTimeout(event.to);
    return event.reject(args);
  };

  once = (eventName, fn, args, expectedEventName2, customDelay) => {
    return new Promise((resolve, reject) => {
      if (this.#alwaysResolve.includes(eventName)) {
        fn(args);
        return resolve();
      }

      const item = {
        sym: Symbol(),
        eventName: eventName,
        expectedEventName: expectedEventName2 ?? expectedEventName(eventName),
        fn: fn,
        resolve: resolve,
        reject: reject,
        delay: customDelay ?? null,
        args: args ?? undefined,
        inQueue: false,
        isDone: false,
        to: undefined,
      };

      this.queue.push(item);

      if (!this.isWorkingHard) {
        this.next(item.sym);
      }
    });
  };

  next = (sym) => {
    let i = require("../");

    this.isWorkingHard = true;
    const item = this.queue.filter((v, i) => {
      return v.sym === sym;
    })[0];

    if (!item) {
      return console.error("item not found", this.queue);
    }

    item.inQueue = true;
    item.fn(item.args);
    item.to = setTimeout(() => {
      return item.reject(new Error("action timed out"));
    }, this.timeout);

    const next =
      this.queue.indexOf(item) > -1 && this.queue[this.queue.indexOf(item) + 1]
        ? this.queue[this.queue.indexOf(item) + 1]
        : undefined;

    if (!next) {
      this.isWorkingHard = false;
      return;
    }

    setTimeout(() => {
      this.next(next.sym);
    }, next.delay ?? this.defaultdelay);
  };
};