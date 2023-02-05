const messageCommand = require("./util/messageCommand");
const messageParameters = require("./util/messageParameters");

class clearchatMsg {
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
     * @param {string} rawMessage 
     */
    constructor(rawMessage) {
        let i = require("../index");

        this._raw = rawMessage;

        this.IRCCommand = messageCommand(rawMessage);
        this.IRCMessageParts = [...this._raw.split(" ").filter((v, i) => {return i < 4}), (this._raw.split(" ")[4] ? this._raw.split(" ").slice(4).join(" ").substring(1) : undefined)];
        this.IRCParameters = messageParameters(this._raw);
        
        this.banDuration = this.IRCParameters["ban-duration"] ?? undefined;
        this.channelName = i.utils.correctChannelName(this.IRCMessageParts[3]);
        this.channelID = this.IRCParameters["room-id"];

        this.targetUserID = this.IRCParameters["target-user-id"] ?? undefined;
        this.targetUserName = this.IRCMessageParts[4] ?? undefined;

        this.serverTimestamp = new Date(this.IRCParameters["tmi-sent-ts"]);
        this.serverTimestampRaw = parseInt(this.IRCParameters["tmi-sent-ts"]);
    };
};

module.exports = clearchatMsg;