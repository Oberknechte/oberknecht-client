"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.roomstateMessage = void 0;
const oberknecht_utils_1 = require("oberknecht-utils");
const __1 = require("..");
class roomstateMessage {
    sym;
    _raw;
    timestamp;
    IRCCommand;
    IRCParameters;
    IRCMessageParts;
    channelID;
    channelName;
    isEmoteOnly;
    emoteOnlyRaw;
    isFollowersOnly;
    followersOnlyRaw;
    isR9k;
    r9kRaw;
    isSubsOnly;
    subsOnlyRaw;
    isSlow;
    slow;
    slowRaw;
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
        this.channelID = this.IRCParameters["room-id"];
        this.channelName = __1.i.utils.cleanChannelName(this.IRCMessageParts[3]);
        this.emoteOnlyRaw = this.IRCParameters["emote-only"];
        this.isEmoteOnly = this.emoteOnlyRaw === "1";
        this.followersOnlyRaw = this.IRCParameters["followers-only"];
        this.isFollowersOnly = this.followersOnlyRaw === "1";
        this.r9kRaw = this.IRCParameters["r9k"];
        this.isR9k = this.r9kRaw === "1";
        this.subsOnlyRaw = this.IRCParameters["subs-only"];
        this.isSubsOnly = this.subsOnlyRaw === "1";
        this.slowRaw = this.IRCParameters["slow"];
        this.slow = parseInt(this.slowRaw);
        this.isSlow = this.slow > 0;
        this.serverTimestampRaw = parseInt(this.IRCParameters["tmi-sent-ts"]);
        this.serverTimestamp = new Date(this.serverTimestampRaw);
        this.serverDelay = dn - this.serverTimestampRaw;
    }
}
exports.roomstateMessage = roomstateMessage;
