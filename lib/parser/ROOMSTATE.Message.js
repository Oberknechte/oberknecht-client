const { messageCommand, messageContent, messageParameters } = require("oberknecht-utils");

class roomstateMessage {
    _raw = String();

    IRCCommand = String();
    IRCParameters = Object();
    IRCMessageParts = Array();

    channelID = String();
    channelName = String();

    isEmoteOnly = Boolean();
    emoteOnlyRaw = Boolean();

    isFollowersOnly = Boolean();
    followersOnlyRaw = Boolean();

    isR9k = Boolean();
    r9kRaw = Boolean();

    isSubsOnly = Boolean();
    subsOnlyRaw = Boolean();

    isSlow = Boolean();
    slow = Number();
    slowRaw = String();

    serverTimestamp = Date();
    serverTimestampRaw = Number();

    get serverDelay() {
        return (Date.now() - this.serverTimestampRaw);
    };

    /** @param {Symbol} sym @param {string} rawMessage */
    constructor(sym, rawMessage) {
        let i = require("../index");

        this._raw = rawMessage;

        this.IRCCommand = messageCommand(rawMessage);
        this.IRCMessageParts = [...this._raw.split(" ").slice(0, 4), messageContent(this._raw)];
        this.IRCParameters = messageParameters(this._raw);

        this.channelID = this.IRCParameters["room-id"];
        this.channelName = i.utils.cleanChannelName(this.IRCMessageParts[3]);

        this.emoteOnlyRaw = this.IRCParameters["emote-only"];
        this.isEmoteOnly = (this.emoteOnlyRaw === "1");

        this.followersOnlyRaw = this.IRCParameters["followers-only"];
        this.isFollowersOnly = (this.followersOnlyRaw === "1");

        this.r9kRaw = this.IRCParameters["r9k"];
        this.isR9k = (this.r9kRaw === "1");

        this.subsOnlyRaw = this.IRCParameters["subs-only"];
        this.isSubsOnly = (this.subsOnlyRaw === "1");

        this.slowRaw = this.IRCParameters["slow"];
        this.slow = parseInt(this.slowRaw);
        this.isSlow = (this.slow > 0);

        this.serverTimestampRaw = parseInt(this.IRCParameters["tmi-sent-ts"]);
        this.serverTimestamp = new Date(this.serverTimestampRaw);
    };
};

module.exports = roomstateMessage;