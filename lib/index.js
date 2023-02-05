const reconnectingKnecht = require("reconnecting-websocket");

const knechtEmitter = require("./emitters/oberknecht.emitter");
const knechtActionEmitter = require("./emitters/oberknecht.action.emitter");
const OberknechtEmitter = new knechtEmitter();
const OberknechtActionEmitter = new knechtActionEmitter();

class i {
  static reconnectingKnecht = reconnectingKnecht;
  static utils = require("./util/utils");
  static OberknechtEmitter = OberknechtEmitter;
  static OberknechtActionEmitter = OberknechtActionEmitter;
  static emitTwitchAction = require("./handlers/emitTwitchAction");
  static clientData = class {
    static channels = [];
    static _options = {};
  };
};

module.exports = i;