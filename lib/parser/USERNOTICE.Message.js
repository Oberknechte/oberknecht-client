const messageBadges = require("./util/messageBadges");
const messageCommand = require("./util/messageCommand");
const messageParameters = require("./util/messageParameters");
const messageEmotes = require("./util/messageEmotes");

class usernoticeMsg {
    #subscriptiontags = {
        "msg-param-cumulative-months": ["sub", "resub"],
        "msg-param-displayName": ["raid"],
        "msg-param-login": ["raid"],
        "msg-param-months": ["subgift"],
        "msg-param-promo-gift-total": ["anongiftpaidupgrade", "giftpaidupgrade"],
        "msg-param-promo-gift-total": ["anongiftpaidupgrade", "giftpaidupgrade"],
        "msg-param-recipient-display-name": ["subgift"],
        "msg-param-recipient-id": ["subgift"],
        "msg-param-recipient-user-name": ["subgift"],
        "msg-param-sender-login": ["giftpaidupgrade"],
        "msg-param-sender-name": ["giftpaidupgrade"],
        "msg-param-should-share-streak": ["sub", "resub"],
        "msg-param-streak-months": ["sub", "resub"],
        "msg-param-sub-plan": ["sub", "resub", "subgift"],
        "msg-param-sub-plan-name": ["sub", "resub", "subgift"],
        "msg-param-viewerCount": ["raid"],
        "msg-param-ritual-name": ["ritual"],
        "msg-param-threshold": ["bitsbadgetier"],
        "msg-param-gift-months": ["subgift"]
    };

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

    turbo = Boolean();
    turboRaw = String();

    msgID = String();
    systemMessage = String();

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

        this.turboRaw = this.IRCParameters["turbo"];
        this.turbo = (this.turboRaw === "1");

        this.msgID = this.IRCParameters["msg-id"];
        this.systemMessage = this.IRCParameters["system-msg"];

        this.serverTimestamp = new Date(this.IRCParameters["tmi-sent-ts"]);
        this.serverTimestampRaw = parseInt(this.IRCParameters["tmi-sent-ts"]);

        Object.keys(this.#subscriptiontags).forEach(a => {
            if(this.#subscriptiontags[a].includes(this.msgID)){
                this[a] = this.IRCParameters[a] ?? undefined;
            };
        });
    };
};

module.exports = usernoticeMsg;