const messageCommand = require("./util/messageCommand");
const messageParameters = require("./util/messageParameters");
const reply = require("../operations/reply");
const privmsg = require("../operations/privmsg");

class privmsgMessage {
    _raw = String();
    #twitch_irc = /tmi\.twitch\.tv/g;
    #action_reg = /^\u0001ACTION ([^\u0001]+)\u0001$/;
    
    messageParts = Array();

    ircCommand = String();
    ircParameters = Object();
    
    messageText = String();
    messageID = String();

    senderUsername = String();
    displayName = String();
    senderUserID = String();
    
    isAction = Boolean();
    badgeInfo = String();
    badgesInfoRaw = String();
    badges = String();
    badgesRaw = String();
    
    bits = String() || undefined;
    bitsRaw = String() || undefined;
    
    color = String();
    colorRaw = String();
    
    flags = String() || undefined;
    flagsRaw = String() || undefined;
    
    isMod = Boolean();
    isModRaw = String();
    
    channelName = String();
    channelID = String();
    
    serverTimestamp = Date();
    serverTimestampRaw = Number();
    
    isCheer = Boolean();
    isReply = Boolean();
    
    replyParentDisplayName = String() || undefined;
    replyParentMessageBody = String() || undefined;
    replyParentMessageID = String() || undefined;
    replyParentUserID = String() || undefined;
    replyParentUserLogin = String() || undefined;

    /**
     * @param {String} replyMessage 
     */
    reply = (replyMessage) => {};

    /**
     * @param {String} sendMessage 
     */
    send = (sendMessage) => {}

    /**
     * @param {String} rawMessage 
     */
    constructor(rawMessage) {
        let i = require("../index");
        this._raw = rawMessage;
        
        this.messageParts = [...this._raw.split(" ").filter((v, i) => {return i < 4}), this._raw.split(" ").slice(4).join(" ")];
        
        this.ircCommand = messageCommand(this._raw);
        let ircParameters = this.ircParameters = messageParameters(this._raw);

        this.messageText = i.utils.correctMessage(this.messageParts[4].substring(1));
        this.isAction = (this.#action_reg.test(this.messageText));
        
        this.displayName = ircParameters["display-name"];
        this.senderUsername = ircParameters["display-name"].toLowerCase();
        this.senderUserID = ircParameters["user-id"];
        
        this.badgeInfo = ircParameters["badge-info"];
        this.badgeInfoRaw = ircParameters["badge-info"];

        this.badges = ircParameters["badges"];
        this.badgesRaw = ircParameters["badges"];
        
        this.bits = ircParameters["bits"] ?? null;
        this.bitsRaw = ircParameters["bits"] ?? "0";
        
        this.color = ircParameters["color"];
        this.colorRaw = ircParameters["color"];
        
        this.flags = ircParameters["flags"];
        this.flagsRaw = ircParameters["flags"];
        
        this.replyParentDisplayName = ircParameters["reply-parent-display-name"] ?? undefined;
        this.replyParentMessageBody = ircParameters["reply-parent-msg-body"] ?? undefined;
        this.replyParentMessageID = ircParameters["reply-parent-msg-id"] ?? undefined;
        this.replyParentUserID = ircParameters["reply-parent-user-id"] ?? undefined;
        this.replyParentUserLogin = ircParameters["reply-parent-user-login"] ?? undefined;
        
        this.messageID = ircParameters["id"];
        
        this.isMod = (ircParameters["mod"] == "1");
        this.isMod = ircParameters["mod"];
        
        this.channelName = i.utils.cleanChannelName(this.messageParts[3]);
        this.channelNameRaw = this.messageParts[3];
        this.channelID = ircParameters["room-id"];
        
        this.serverTimestampRaw = parseInt(ircParameters["tmi-sent-ts"]);
        this.serverTimestamp = new Date(this.serverTimestampRaw);

        this.isCheer = (this.bits > 0);
        this.isReply = (this.replyParentMessageID != undefined);

        this.reply = (replyMessage) => {
            reply(replyMessage, this.channelName, this.messageID);
        };

        this.send = (sendMessage) => {
            privmsg(this.channelName, sendMessage);
        };
    };
};

module.exports = privmsgMessage;