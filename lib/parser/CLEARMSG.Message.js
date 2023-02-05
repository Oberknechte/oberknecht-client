const messageCommand = require("./util/messageCommand");
const messageParameters = require("./util/messageParameters");

class clearmsgMessage {
    _raw = String();
    
    IRCCommand = String();
    IRCParameters = Object();
    IRCMessageParts = Array();

    moderatorLogin = String();
    
    targetUserName = String();
    targetMessageID = String();
    
    channelName = String() || undefined;
    channelID = String() || undefined;
    
    serverTimestamp = Date();
    serverTimestampRaw = Number();
    
    /**
     * @param {string} rawMessage 
     */
    constructor(rawMessage){
        let i = require("..");
        
        this._raw = rawMessage;

        this.IRCCommand = messageCommand(rawMessage);
        this.IRCMessageParts = [...this._raw.split(" ").filter((v, i) => {return i < 4}), this._raw.split(" ")[4]];
        let IRCParameters = this.IRCParameters = messageParameters(this._raw);

        this.moderatorLogin = IRCParameters["login"];
        
        this.targetMessageID = IRCParameters["target-msg-id"];
        this.targetUserName = this.IRCMessageParts[4]?.substring(4) ?? undefined;

        this.channelName = i.utils.cleanChannelName(this.IRCMessageParts[3]);
        this.channelID = IRCParameters["room-id"] ?? undefined;

        this.serverTimestamp = new Date(IRCParameters["tmi-sent-ts"]);
        this.serverTimestampRaw = parseInt(IRCParameters["tmi-sent-ts"]);
    };
};

module.exports = clearmsgMessage;