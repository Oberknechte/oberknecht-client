import { oberknechtActionEmitter, oberknechtEmitter } from "oberknecht-emitters";
import { emitTwitchAction } from "./handlers/emitTwitchAction";
import * as oberknechtUtils from "oberknecht-utils";
export declare class i {
    static reconnectingKnechtClient: {};
    static OberknechtEmitter: Record<string, oberknechtEmitter>;
    static OberknechtActionEmitter: Record<string, oberknechtActionEmitter>;
    static OberknechtQueueEmitter: {};
    static OberknechtAPI: {};
    static clientData: {};
    static utils: typeof oberknechtUtils;
    static regex: typeof oberknechtUtils.regex;
    static emitTwitchAction: typeof emitTwitchAction;
}
export declare let iDynamic: () => typeof i;
