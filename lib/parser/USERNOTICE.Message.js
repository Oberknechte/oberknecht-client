const messageBadges = require("./util/messageBadges");
const messageCommand = require("./util/messageCommand");
const messageParameters = require("./util/messageParameters");
const messageEmotes = require("./util/messageEmotes");

class usernoticeMessage {
    _raw = String();

    IRCCommand = String();
    IRCParameters = Object();
    IRCMessageParts = Array();

    badgeInfo = String();
    badges = Object();
    badgesRaw = String();

    senderUserName = String();
    senderDisplayName = String();
    senderUserID = String();
    senderUserType = String();
    senderUserColor = String();

    channelName = String();
    channelID = String();

    emotes = Array();
    emotesRaw = String();

    isMod = Boolean();
    isModRaw = String();

    isVip = Boolean();
    isVipRaw = String();

    isSubscriber = Boolean();
    isSubscriberRaw = String();

    msgID = String();
    systemMessage = String();

    messageID = String();

    get isAnySub() {
        return ["sub", "resub", "subgift", "submysterygift", "rewardgift", "giftpaidupgrade", "anongiftpaidupgrade"].includes(this.msgID);
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

        this.IRCCommand = messageCommand(rawMessage);
        this.IRCMessageParts = [...this._raw.split(" ").filter((v, i) => { return i < 4 }), this._raw.split(" ")[4]];
        this.IRCParameters = messageParameters(this._raw);

        this.badgeInfo = this.IRCParameters["badge-info"];
        this.badgesRaw = this.IRCParameters["badges"];
        this.badges = messageBadges(this.badgesRaw);

        this.senderUserName = this.IRCParameters["login"];
        this.senderDisplayName = this.IRCParameters["display-name"];
        this.senderUserID = this.IRCParameters["user-id"];
        this.senderUserType = this.IRCParameters["user-type"];
        this.senderUserColor = this.IRCParameters["color"];

        this.channelID = this.IRCParameters["room-id"];
        this.channelName = (i.utils.cleanChannelName(this.IRCMessageParts[3]));

        this.emotesRaw = this.IRCParameters["emotes"];
        this.emotes = messageEmotes(this.emotesRaw);

        this.isModRaw = this.IRCParameters["mod"];
        this.isMod = (this.isModRaw === "1");

        this.isVipRaw = this.IRCParameters["vip"];
        this.isVip = (this.isVipRaw === "1");

        this.isSubscriberRaw = this.IRCParameters["subscriber"];
        this.isSubscriber = (this.isSubscriberRaw === "1");

        this.msgID = this.IRCParameters["msg-id"];
        this.systemMessage = this.IRCParameters["system-msg"];

        this.serverTimestampRaw = parseInt(this.IRCParameters["tmi-sent-ts"]);
        this.serverTimestamp = new Date(this.serverTimestampRaw);

        Object.keys(this.IRCParameters).filter(a => {return a.startsWith("msg-param")}).forEach(a => {
            this[a] = this.IRCParameters[a];
        });
    };
};

module.exports = usernoticeMessage;