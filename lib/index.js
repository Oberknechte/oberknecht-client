class i {
  static reconnectingKnechtClient = {};
  static OberknechtEmitter = {};
  static OberknechtActionEmitter = {};
  static OberknechtQueueEmitter = {};
  static OberknechtAPI = {};
  static clientData = {};
  static utils = require("oberknecht-utils");
  static regex = require("oberknecht-utils").regex;
  static emitTwitchAction = require("./handlers/emitTwitchAction");
  get paths() { return require("./variables/paths") };
  get files() { return require("./variables/files") };
};

module.exports = i;