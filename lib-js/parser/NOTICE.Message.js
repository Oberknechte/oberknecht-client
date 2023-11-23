"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.noticeMessage = void 0;
const oberknecht_utils_1 = require("oberknecht-utils");
class noticeMessage {
    sym;
    timestamp;
    _raw;
    IRCCommand;
    IRCParameters;
    IRCMessageParts;
    msgID;
    messageText;
    targetUserID;
    channelName;
    serverTimestamp;
    serverTimestampRaw;
    serverDelay;
    constructor(sym, rawMessage) {
        const dn = Date.now();
        this.timestamp = dn;
        this.sym = sym;
        this._raw = rawMessage;
        this.IRCCommand = (0, oberknecht_utils_1.messageCommand)(rawMessage);
        this.IRCMessageParts = [
            ...this._raw.split(" ").slice(0, 4),
            (0, oberknecht_utils_1.messageContent)(this._raw),
        ];
        this.IRCParameters = (0, oberknecht_utils_1.messageParameters)(this._raw);
        this.msgID = this.IRCParameters["msg-id"];
        this.messageText = this.IRCMessageParts[4]?.substring(1) ?? undefined;
        this.targetUserID = this.IRCParameters["target-user-id"] ?? undefined;
        this.channelName = (0, oberknecht_utils_1.cleanChannelName)(this.IRCMessageParts[3]) ?? undefined;
        this.serverTimestampRaw = parseInt(this.IRCParameters["tmi-sent-ts"]);
        this.serverTimestamp = new Date(this.serverTimestampRaw);
        this.serverDelay = dn - this.serverTimestampRaw;
    }
}
exports.noticeMessage = noticeMessage;
