"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.clearmsgMessage = void 0;
let oberknecht_utils_1 = require("oberknecht-utils");
class clearmsgMessage {
    sym;
    _raw;
    timestamp;
    IRCCommand;
    IRCParameters;
    IRCMessageParts;
    IRCMessagePrefix;
    moderatorLogin;
    targetUserName;
    targetMessageID;
    targetMessageText;
    channelName;
    channelID;
    serverTimestamp;
    serverTimestampRaw;
    serverDelay;
    constructor(sym, rawMessage) {
        const dn = Date.now();
        this.timestamp = dn;
        this.sym = sym;
        this._raw = rawMessage;
        this.IRCCommand = (0, oberknecht_utils_1.messageCommand)(rawMessage);
        this.IRCParameters = (0, oberknecht_utils_1.messageParameters)(this._raw);
        this.IRCMessageParts = [...this._raw.split(" ").slice(0, 4), (0, oberknecht_utils_1.messageContent)(this._raw)];
        this.IRCMessagePrefix = (0, oberknecht_utils_1.messagePrefix)(this._raw);
        this.targetMessageID = this.IRCParameters["target-msg-id"];
        this.targetUserName = this.IRCParameters["login"];
        this.targetMessageText = this.IRCMessageParts[4];
        this.channelName = (0, oberknecht_utils_1.cleanChannelName)(this.IRCMessageParts[3]);
        this.channelID = this.IRCParameters["room-id"] ?? undefined;
        this.serverTimestampRaw = parseInt(this.IRCParameters["tmi-sent-ts"]);
        this.serverTimestamp = new Date(this.serverTimestampRaw);
        this.serverDelay = (dn - this.serverTimestampRaw);
    }
    ;
}
exports.clearmsgMessage = clearmsgMessage;
;
