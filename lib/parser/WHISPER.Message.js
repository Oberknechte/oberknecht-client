const messageBadges = require("./util/messageBadges");
const messageCommand = require("./util/messageCommand");
const messageParameters = require("./util/messageParameters");
const messageEmotes = require("./util/messageEmotes");

class whisperMessage {
    _raw = String();
    
    IRCCommand = String();
    IRCParameters = Object();
    IRCMessageParts = Array();

    prefix = String();
    command = String();

    badges = Object();
    badgesRaw = String();
    
    messageText = String();
    messageParts = Array();
    messageArguments = Array();

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

        this.prefix = i.clientData._options.prefix;

        this.badgesRaw = this.IRCParameters["badges"];
        this.badges = messageBadges(this.badgesRaw);

        this.senderUserName = this.IRCParameters["display-name"].toLowerCase();
        this.senderDisplayName = this.IRCParameters["display-name"];
        this.senderUserID = this.IRCParameters["user-id"];
        this.senderUserType = this.IRCParameters["user-type"];
        this.senderUserColor = this.IRCParameters["color"];

        this.emotesRaw = this.IRCParameters["emotes"];
        this.emotes = messageEmotes(this.emotesRaw);

        this.messageText = i.utils.correctMessage(this.IRCParameters[4]);
        this.messageParts = this.messageText.split(" ");
        this.messageArguments = [...this.messageParts];

        let msgmatch = this.messageText.match(new RegExp(`^${this.prefix}+\\w+`, "gi"));
        this.command = ((msgmatch ?? undefined) ? msgmatch[0].replace(new RegExp(`^${this.prefix}`), "") : undefined)
        if (msgmatch) this.messageArguments = this.messageArguments.slice(this.prefix.split(" ").length - 1);

        this.turboRaw = this.IRCParameters["turbo"];
        this.turbo = (this.turboRaw === "1");

        this.threadID = this.IRCParameters["thread-id"];
        this.messageID = this.IRCParameters["message-id"];

        this.serverTimestampRaw = parseInt(this.IRCParameters["tmi-sent-ts"]);
        this.serverTimestamp = new Date(this.serverTimestampRaw);

        this.userstate = new class userstate {
            /**
             * @param {whisperMessage} inp 
             */
            constructor(inp) {
                this.username = inp.senderUserName;
                this.displayName = inp.senderDisplayName;
                this.color = inp.senderUserColor;
                this.turbo = inp.turbo;
                this.userType = inp.senderUserType;
                this.badges = inp.badges;
                this.badgesRaw = inp.badgesRaw;
                this.id = inp.senderUserID;
            };
        }(this);
    
        this.message = new class message {
            /**
             * @param {whisperMessage} inp 
             */
            constructor(inp) {
                this.messageText = inp.messageText;
                this.id = inp.messageID;
                this.threadID = inp.threadID;
                this.type = inp.IRCCommand;
                this.emotes = inp.emotes;
                this.emotesRaw = inp.emotesRaw;
                this.emotecount = inp.emotes.length;
                this.timestamp = inp.serverTimestamp;
                this.timestampRaw = inp.serverTimestampRaw;
            };
        }(this);
    
        this.channel = new class channel {
            /**
             * @param {whisperMessage} inp 
             */
            constructor(inp){
                this.name = inp.senderUserName;
                this.id = inp.threadID;
            };
        }(this);
    
        this.server = new class server {
            /**
             * @param {whisperMessage} inp 
             */
            constructor(inp){
                this._raw = inp._raw;
                this.timestamp = inp.serverTimestamp;
                this.timestampRaw = inp.serverTimestampRaw;
                this.IRCParameters = inp.IRCParameters;
            };
        }(this);
    };
};

module.exports = whisperMessage;