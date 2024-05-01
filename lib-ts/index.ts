import { oberknechtActionEmitter, oberknechtEmitter } from "oberknecht-emitters";
import { emitTwitchAction } from "./handlers/emitTwitchAction";
import * as oberknechtUtils from "oberknecht-utils";

export class i {
  static reconnectingKnechtClient = {};
  static OberknechtEmitter: Record<string, oberknechtEmitter> = {};
  static OberknechtActionEmitter: Record<string, oberknechtActionEmitter> = {};
  static OberknechtQueueEmitter = {};
  static OberknechtAPI = {};
  static clientData = {};
  static utils = oberknechtUtils;
  static regex = oberknechtUtils.regex;
  static emitTwitchAction = emitTwitchAction;
}

export let iDynamic = () => {
  return i;
};
