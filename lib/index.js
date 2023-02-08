class i {
  static reconnectingKnechtClient = {};
  static utils = require("./util/utils");
  static regex = require("./var/regex");
  static OberknechtEmitter = {};
  static OberknechtActionEmitter = {};
  static emitTwitchAction = require("./handlers/emitTwitchAction");
  static clientData = {};
};

module.exports = i;