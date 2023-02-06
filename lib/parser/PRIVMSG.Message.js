const messageCommand = require("./util/messageCommand");
const messageParameters = require("./util/messageParameters");
const messageBadges = require("./util/messageBadges");
const messageEmotes = require("./util/messageEmotes");

class privmsgMessage {
    #action_reg = /^\u0001ACTION ([^\u0001]+)\u0001$/;

    _raw = String();

    prefix = String() || undefined;
    command = String() || undefined;

    IRCCommand = String();
    IRCParameters = Object();
    IRCMessageParts = Array();

    messageText = String();
    messageParts = Array();
    messageArguments = Array();
    messageID = String();

    senderUserName = String();
    senderDisplayName = String();
    senderUserID = String();
    senderUserType = String();
    senderUserColor = String();

    badgeInfo = String();
    badges = Object();
    badgesRaw = String();
    bits = Number();
    emotes = Array();
    emotesRaw = String();
    flags = String() || undefined;

    isAction = Boolean();

    isSubscriber = Boolean();
    isSubscriberRaw = String();

    isMod = Boolean();
    isModRaw = String();

    isVip = Boolean();
    isVipRaw = String();

    isCheer = Boolean();
    isReply = Boolean();

    firstMsg = Boolean();
    firstMsgRaw = String();

    turbo = Boolean();

    channelName = String();
    channelID = String();

    replyParentDisplayName = String() || undefined;
    replyParentMessageBody = String() || undefined;
    replyParentMessageID = String() || undefined;
    replyParentUserID = String() || undefined;
    replyParentUserLogin = String() || undefined;

    reply = (replyMessage) => {
        return require("../operations/reply")(replyMessage, this.channelName, this.messageID);
    };

    send = (sendMessage) => {
        return require("../operations/privmsg")(this.channelName, sendMessage);
    };

    serverTimestamp = Date();
    serverTimestampRaw = Number();

    /**
     * @param {Symbol} sym
     * @param {string} rawMessage 
     */
    constructor(sym, rawMessage) {
        let i = require("../index");
        this._raw = rawMessage;

        this.IRCMessageParts = [...this._raw.split(" ").filter((v, i) => { return i < 4 }), this._raw.split(" ").slice(4).join(" ").substring(1).replace(/(^\s|\s$)/g, "").replace(/[\s]{2,}/g, " ")];
        this.IRCCommand = messageCommand(this._raw);
        this.IRCParameters = messageParameters(this._raw);

        this.prefix = i.clientData[sym]._options.prefix;

        this.messageText = i.utils.correctMessage(this.IRCMessageParts[4]);
        this.messageParts = this.messageText.split(" ");
        this.messageArguments = [...this.messageParts];
        this.isAction = (this.#action_reg.test(this.messageText));
        this.messageID = this.IRCParameters["id"];

        let msgmatch = this.messageText.match(new RegExp(`^${this.prefix}+\\w+`, "gi"));
        this.command = ((msgmatch ?? undefined) ? msgmatch[0].replace(new RegExp(`^${this.prefix}`), "") : undefined)
        if (msgmatch) this.messageArguments = this.messageArguments.slice(this.prefix.split(" ").length - 1);

        this.senderUserName = this.IRCParameters["display-name"].toLowerCase();
        this.senderDisplayName = this.IRCParameters["display-name"];
        this.senderUserID = this.IRCParameters["user-id"];
        this.senderUserType = this.IRCParameters["user-type"];
        this.senderUserColor = this.IRCParameters["color"];

        this.badgeInfo = this.IRCParameters["badge-info"];
        this.badgesRaw = this.IRCParameters["badges"];
        this.badges = messageBadges(this.badgesRaw);
        this.bits = parseInt(this.IRCParameters["bits"] ?? 0);
        this.emotesRaw = this.IRCParameters["emotes"];
        this.emotes = messageEmotes(this.emotesRaw);
        this.flags = this.IRCParameters["flags"];

        this.isAction = this.#action_reg.test(this.messageText);

        this.isSubscriberRaw = this.IRCParameters["subscriber"];
        this.isSubscriber = (this.isSubscriberRaw === "1");

        this.isModRaw = this.IRCParameters["mod"];
        this.isMod = (this.isModRaw === "1");

        this.isVip = (this.IRCParameters["vip"] ?? false);

        this.isCheer = (this.bits > 0);
        this.isReply = (this.replyParentMessageID ?? false);

        this.firstMsgRaw = this.IRCParameters["first-msg"];
        this.firstMsg = (this.firstMsgRaw === "1");

        this.turbo = (this.IRCParameters["turbo"] === 1);

        this.channelName = i.utils.cleanChannelName(this.IRCMessageParts[3]);
        this.channelID = this.IRCParameters["room-id"];

        this.replyParentDisplayName = this.IRCParameters["reply-parent-display-name"] ?? undefined;
        this.replyParentMessageBody = this.IRCParameters["reply-parent-msg-body"] ?? undefined;
        this.replyParentMessageID = this.IRCParameters["reply-parent-msg-id"] ?? undefined;
        this.replyParentUserID = this.IRCParameters["reply-parent-user-id"] ?? undefined;
        this.replyParentUserLogin = this.IRCParameters["reply-parent-user-login"] ?? undefined;

        this.serverTimestampRaw = parseInt(this.IRCParameters["tmi-sent-ts"]);
        this.serverTimestamp = new Date(this.serverTimestampRaw);

        this.userstate = new class userstate {
            /**
             * @param {privmsgMessage} inp 
             */
            constructor(inp) {
                this.username = inp.senderUserName;
                this.displayName = inp.senderDisplayName;
                this.color = inp.senderUserColor;
                this.isMod = inp.isMod;
                this.subscriber = inp.isSubscriber;
                this.turbo = inp.turbo;
                this.userType = inp.senderUserType;
                this.badgeInfo = inp.badgeInfo;
                this.badges = inp.badges;
                this.badgesRaw = inp.badgesRaw;
                this.firstmsg = inp.firstMsg;
                this.id = inp.senderUserID;
            };
        }(this);
    
        this.message = new class message {
            /**
             * @param {privmsgMessage} inp 
             */
            constructor(inp) {
                this.messageText = inp.messageText;
                this.isAction = inp.isAction;
                this.isCheer = inp.isCheer;
                this.isReply = inp.isReply;
                this.id = inp.messageID;
                this.bits = inp.bits;
                this.type = inp.IRCCommand;
                this.emotes = inp.emotes;
                this.emotesRaw = inp.emotesRaw;
                this.emotecount = this.emotes.length;
                this.timestamp = inp.serverTimestamp;
                this.timestampRaw = inp.serverTimestampRaw;
            };
        }(this);
    
        this.channel = new class channel {
            /**
             * @param {privmsgMessage} inp 
             */
            constructor(inp){
                this.name = inp.channelName;
                this.id = inp.channelID;
            };
        }(this);
    
        this.server = new class server {
            /**
             * @param {privmsgMessage} inp 
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

module.exports = privmsgMessage;