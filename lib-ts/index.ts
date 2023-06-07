import { emitTwitchAction } from "./handlers/emitTwitchAction";
import * as oberknechtUtils from "oberknecht-utils";

export class i {
  static reconnectingKnechtClient = {};
  static OberknechtEmitter = {};
  static OberknechtActionEmitter = {};
  static OberknechtQueueEmitter = {};
  static OberknechtAPI = {};
  static clientData = {};
  static utils = oberknechtUtils;
  static regex = oberknechtUtils.regex;
  static emitTwitchAction = emitTwitchAction;
};

export let iDynamic = () => {
  return i;
};