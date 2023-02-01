const reconnectingKnecht = require("reconnecting-websocket");

const knechtEmitter = require("./emitters/oberknecht.emitter");
const knechtactionEmitter = require("./emitters/oberknecht.action.emitter");
const OberknechtEmitter = new knechtEmitter();
const OberknechtactionEmitter = new knechtactionEmitter();

class i {
  static reconnectingKnecht = reconnectingKnecht;
  static utils = require("./util/utils");
  static OberknechtEmitter = OberknechtEmitter;
  static OberknechtactionEmitter = OberknechtactionEmitter;
  static emitTwitchAction = require("./handlers/emitTwitchAction");
  static clientData = class {
    static channels = [];
    static _options = {};
  };
};

module.exports = i;