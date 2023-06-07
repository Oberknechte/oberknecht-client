"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.clearchatMessage = void 0;
let oberknecht_utils_1 = require("oberknecht-utils");
class clearchatMessage {
    sym;
    _raw;
    timestamp;
    IRCCommand;
    IRCParameters;
    IRCMessageParts;
    banDuration;
    channelName;
    channelID;
    targetUserID;
    targetUserName;
    serverTimestamp;
    serverTimestampRaw;
    serverDelay;
    constructor(sym, rawMessage) {
        const dn = Date.now();
        this.sym = sym;
        this.timestamp = dn;
        this._raw = rawMessage;
        this.IRCCommand = (0, oberknecht_utils_1.messageCommand)(rawMessage);
        this.IRCMessageParts = [...this._raw.split(" ").slice(0, 4), (0, oberknecht_utils_1.messageContent)(this._raw)];
        this.IRCParameters = (0, oberknecht_utils_1.messageParameters)(this._raw);
        this.banDuration = this.IRCParameters["ban-duration"] ?? undefined;
        this.channelName = (0, oberknecht_utils_1.correctChannelName)(this.IRCMessageParts[3]);
        this.channelID = this.IRCParameters["room-id"];
        this.targetUserID = this.IRCParameters["target-user-id"] ?? undefined;
        this.targetUserName = this.IRCMessageParts[4] ?? undefined;
        this.serverTimestampRaw = parseInt(this.IRCParameters["tmi-sent-ts"]);
        this.serverTimestamp = new Date(this.serverTimestampRaw);
        this.serverDelay = (dn - this.serverTimestampRaw);
    }
    ;
}
exports.clearchatMessage = clearchatMessage;
;
