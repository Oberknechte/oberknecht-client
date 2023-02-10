const messageCommand = require("../util/message.Command");
const messageContent = require("../util/message.Content");
const messageParameters = require("../util/message.Parameters");

class clearmsgMessage {
    _raw = String();

    IRCCommand = String();
    IRCParameters = Object();
    IRCMessageParts = Array();
    IRCMessagePrefix = String();

    moderatorLogin = String();

    targetUserName = String();
    targetMessageID = String();
    targetMessageText = String();

    channelName = String() || undefined;
    channelID = String() || undefined;

    serverTimestamp = Date();
    serverTimestampRaw = Number();

    get serverDelay(){
        return (Date.now()-this.serverTimestampRaw);
    };

    /**
     * @param {Symbol} sym
     * @param {string} rawMessage 
     */
    constructor(sym, rawMessage) {
        let i = require("../index");

        this._raw = rawMessage;

        this.IRCCommand = messageCommand(rawMessage);
        this.IRCParameters = this.IRCParameters = messageParameters(this._raw);
        this.IRCMessageParts = [...this._raw.split(" ").slice(0, 4), messageContent(this._raw)];
        this.IRCMessagePrefix = messagePrefix(this._raw);

        this.targetMessageID = IRCParameters["target-msg-id"];
        this.targetUserName = this.IRCParameters["login"];
        this.targetMessageText = this.IRCMessageParts[4];

        this.channelName = i.utils.cleanChannelName(this.IRCMessageParts[3]);
        this.channelID = IRCParameters["room-id"] ?? undefined;

        this.serverTimestampRaw = parseInt(IRCParameters["tmi-sent-ts"]);
        this.serverTimestamp = new Date(this.serverTimestampRaw);
    };
};

module.exports = clearmsgMessage;