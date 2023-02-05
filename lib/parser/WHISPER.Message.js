const messageBadges = require("./util/messageBadges");
const messageCommand = require("./util/messageCommand");
const messageParameters = require("./util/messageParameters");
const messageEmotes = require("./util/messageEmotes");

class whisperMessage {
    _raw = String();
    
    IRCCommand = String();
    IRCParameters = Object();
    IRCMessageParts = Array();

    badges = Object();
    badgesRaw = String();
    
    senderUserName = String();
    senderDisplayName = String();
    senderUserID = String();
    senderUserType = String();
    senderUserColor = String();
    
    emotes = Array();
    emotesRaw = String();

    turbo = Boolean();
    turboRaw = String();

    threadID = String();
    messageID = String();
    
    serverTimestamp = Date();
    serverTimestampRaw = Number();
    
    /**
     * @param {string} rawMessage 
     */
    constructor(rawMessage){
        let i = require("../index");
        
        this._raw = rawMessage;

        this.IRCCommand = messageCommand(rawMessage);
        this.IRCMessageParts = [...this._raw.split(" ").filter((v, i) => {return i < 4}), this._raw.split(" ")[4]];
        this.IRCParameters = messageParameters(this._raw);

        this.badgeInfo = this.IRCParameters["badge-info"];
        this.badgesRaw = this.IRCParameters["badges"];
        this.badges = messageBadges(this.badgesRaw);

        this.senderUserName = this.IRCParameters["display-name"].toLowerCase();
        this.senderDisplayName = this.IRCParameters["display-name"];
        this.senderUserID = this.IRCParameters["user-id"];
        this.senderUserType = this.IRCParameters["user-type"];
        this.senderUserColor = this.IRCParameters["color"];

        this.emotesRaw = this.IRCParameters["emotes"];
        this.emotes = messageEmotes(this.emotesRaw);

        this.turboRaw = this.IRCParameters["turbo"];
        this.turbo = (this.turboRaw === "1");

        this.threadID = this.IRCParameters["thread-id"];
        this.messageID = this.IRCParameters["message-id"];

        this.serverTimestampRaw = parseInt(this.IRCParameters["tmi-sent-ts"]);
        this.serverTimestamp = new Date(this.serverTimestampRaw);
    };
};

module.exports = whisperMessage;