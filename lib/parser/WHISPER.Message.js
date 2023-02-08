const messageBadges = require("./util/messageBadges");
const messageCommand = require("./util/messageCommand");
const messageParameters = require("./util/messageParameters");
const messageEmotes = require("./util/messageEmotes");
const messagePrefix = require("./util/messagePrefix");
const messageUser = require("./util/messageUser");
const messageContent = require("./util/messageContent");

class whisperMessage {
    _raw = String();
    
    IRCCommand = String();
    IRCParameters = Object();
    IRCMessageParts = Array();
    IRCMessagePrefix = String();

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

    /**
     * @param {Symbol} sym
     * @param {string} rawMessage 
     */
    constructor(sym, rawMessage){
        let i = require("../index");

        this._raw = rawMessage;

        this.IRCCommand = messageCommand(this._raw);
        this.IRCMessageParts = [...this._raw.split(" ").slice(0, 4), messageContent(this._raw)];
        this.IRCParameters = messageParameters(this._raw);
        this.IRCMessagePrefix = messagePrefix(this._raw);

        this.prefix = i.clientData[sym]._options.prefix;

        this.badgesRaw = this.IRCParameters["badges"];
        this.badges = messageBadges(this.badgesRaw);

        this.senderUserName = messageUser(this.IRCMessagePrefix);
        this.senderDisplayName = this.IRCParameters["display-name"];
        this.senderUserID = this.IRCParameters["user-id"];
        this.senderUserType = this.IRCParameters["user-type"];
        this.senderUserColor = this.IRCParameters["color"];

        this.emotesRaw = this.IRCParameters["emotes"];
        this.emotes = messageEmotes(this.emotesRaw);

        this.messageText = i.utils.correctMessage(this.IRCMessageParts[4]);
        this.messageParts = this.messageText.split(" ");
        this.messageArguments = [...this.messageParts];

        let msgmatch = this.messageText.match(new RegExp(`^${this.prefix}+\\w+`, "gi"));
        this.command = ((msgmatch ?? undefined) ? msgmatch[0].replace(new RegExp(`^${this.prefix}`), "") : undefined)
        if (msgmatch) this.messageArguments = this.messageArguments.slice(this.prefix.split(" ").length - 1);

        this.turboRaw = this.IRCParameters["turbo"];
        this.turbo = (this.turboRaw === "1");

        this.threadID = this.IRCParameters["thread-id"];
        this.messageID = this.IRCParameters["message-id"];

        this.whisper = (message) => {
            return require("../operations/whisper")(sym, this.senderUserID, message).catch();
        };

        this.reply = this.whisper;

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