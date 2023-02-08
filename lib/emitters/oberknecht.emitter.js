class knechtEmitter {
  events = {};

  constructor() {
    this.events = {};
  };

  on = (eventName, callback) => {
    if (!Array.isArray(eventName)) eventName = [eventName];

    eventName.forEach((eventName2) => {
      if (!this.events[eventName2]) {
        this.events[eventName2] = [];
      }

      this.events[eventName2].push(callback);
    });
  };

  addListener = this.on;

  once = (eventName, callback) => {
    if(!Array.isArray(eventName)) eventName = [eventName];
    const onceCallback = (args) => {
      this.removeListener(eventName, onceCallback);
      callback(args);
    };

    this.on(eventName, onceCallback);
  };

  removeListener = (eventName, callback) => {
    if (!this.events[eventName]) return;

    this.events[eventName] = this.events[eventName].filter(
      (cb) => cb !== callback
    );
  };

  removeAllListeners = (eventName) => {
    if (!this.events[eventName]) return;

    delete this.events[eventName];
  };

  getListeners = (eventName) => {
    return this.events[eventName] || [];
  };

  emit = (eventName, args) => {
    if (!Array.isArray(eventName)) eventName = [eventName];

    eventName.forEach((eventName2) => {
      this.getListeners(eventName2).forEach((callback) => {
        callback(args ?? undefined);
      });
      this.getListeners("_all").forEach((callback) => {
        callback(args ?? undefined);
      })
    });
  };

  emitError = (eventName, error) => {
    if(this.getListeners("error").length === 0 && this.getListeners("unhandledRejection").length === 0){
      process.emitWarning(new Error(`${eventName}: ${error.message ?? error}`));
    };
    this.emit(["error"].concat(eventName), (error instanceof Error ? error : new Error(error)));
  };
};

module.exports = knechtEmitter;