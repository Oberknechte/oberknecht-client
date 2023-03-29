require("./lib/arguments/oberknecht.action.emitter.options");

require("oberknecht-utils");
// This is all because JS won't show any values on the callbacks unless I import them here  FeelsWeirdMan

module.exports = class {
    static oberknechtEmitter = require("./lib/emitters/oberknecht.emitter");
    static oberknechtActionEmitter = require("./lib/emitters/oberknecht.action.emitter");
    static oberknechtQueueEmitter = require("./lib/emitters/oberknecht.queue.emitter");
};