const messageCommand = require("./util/messageCommand");
const messageParameters = require("./util/messageParameters");

class noticeMessage {
    _raw = String();
    
    IRCCommand = String();
    IRCParameters = Object();
    IRCMessageParts = Array();

    msgID = String();
    messageText = String() || undefined;
    targetUserID = String() || undefined;
    
    channelName = String() || undefined;
    
    serverTimestamp = Date();
    serverTimestampRaw = Number();
    
    /**
     * @param {Symbol} sym
     * @param {string} rawMessage 
     */
    constructor(sym, rawMessage){
        let i = require("../index");
        
        this._raw = rawMessage;

        this.IRCCommand = messageCommand(rawMessage);
        this.IRCMessageParts = [...this._raw.split(" ").filter((v, i) => {return i < 4}), this._raw.split(" ")[4]];
        this.IRCParameters = messageParameters(this._raw);

        this.msgID = this.IRCParameters["msg-id"];
        this.messageText = this.IRCMessageParts[4]?.substring(1) ?? undefined;
        this.targetUserID = this.IRCParameters["target-user-id"] ?? undefined;
        
        this.channelName = i.utils.cleanChannelName(this.IRCMessageParts[3]) ?? undefined;

        this.serverTimestampRaw = parseInt(this.IRCParameters["tmi-sent-ts"]);
        this.serverTimestamp = new Date(this.serverTimestampRaw);
    };
};

module.exports = noticeMessage;