class i {
  static reconnectingKnechtClient = {};
  static OberknechtEmitter = {};
  static OberknechtActionEmitter = {};
  static OberknechtAPI = {};
  static clientData = {};
  static utils = require("oberknecht-utils");
  static regex = require("./var/regex");
  static emitTwitchAction = require("./handlers/emitTwitchAction");
};

module.exports = i;