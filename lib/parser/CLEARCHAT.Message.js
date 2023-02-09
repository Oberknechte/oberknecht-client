const messageCommand = require("../util/message.Command");
const messageContent = require("../util/message.Content");
const messageParameters = require("../util/message.Parameters");

class clearchatMessage {
    _raw = String();

    IRCCommand = String();
    IRCParameters = Object();
    IRCMessageParts = Array();

    banDuration = Number() || undefined;
    channelName = String();
    channelID = String();

    targetUserID = String() || undefined;
    targetUserName = String() || undefined;

    serverTimestamp = Date();
    serverTimestampRaw = Number();

    /**
     * @param {Symbol} sym
     * @param {string} rawMessage 
     */
    constructor(sym, rawMessage) {
        let i = require("../index");

        this._raw = rawMessage;

        this.IRCCommand = messageCommand(rawMessage);
        this.IRCMessageParts = [...this._raw.split(" ").slice(0, 4), messageContent(this._raw)];
        this.IRCParameters = messageParameters(this._raw);

        this.banDuration = this.IRCParameters["ban-duration"] ?? undefined;
        this.channelName = i.utils.correctChannelName(this.IRCMessageParts[3]);
        this.channelID = this.IRCParameters["room-id"];

        this.targetUserID = this.IRCParameters["target-user-id"] ?? undefined;
        this.targetUserName = this.IRCMessageParts[4] ?? undefined;

        this.serverTimestampRaw = parseInt(this.IRCParameters["tmi-sent-ts"]);
        this.serverTimestamp = new Date(this.serverTimestampRaw);
    };
};

module.exports = clearchatMessage;