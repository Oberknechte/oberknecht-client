const { messageBadges, messageCommand, messageParameters, messageEmoteSets, messagePrefix, messageUser } = require("oberknecht-utils");

class userstateMessage {
    _raw = String();

    IRCCommand = String();
    IRCParameters = Object();
    IRCMessageParts = Array();
    IRCMessagePrefix = String();

    badgeInfo = String();
    badges = Object();
    badgesRaw = String();

    senderUserName = String() || undefined;
    senderDisplayName = String() || undefined;
    senderUserType = String() || undefined;
    senderUserColor = String() || undefined;

    channelNameRaw = String() || undefined;
    channelName = String() || undefined;

    emoteSets = Array();
    emotesSetsRaw = String();

    isMod = Boolean();
    isModRaw = String();

    isSubscriber = Boolean();
    isSubscriberRaw = String();

    turbo = Boolean();
    turboRaw = String();

    messageID = String() || undefined;

    /**
     * @param {Symbol} sym
     * @param {string} rawMessage 
     */
    constructor(sym, rawMessage) {
        let i = require("../index");

        this._raw = rawMessage;

        this.IRCCommand = messageCommand(rawMessage);
        this.IRCMessageParts = this._raw.split(" ");
        this.IRCParameters = messageParameters(this._raw);
        this.IRCMessagePrefix = messagePrefix(this._raw);
        this.senderUserName = messageUser(this.IRCMessagePrefix);

        this.badgeInfo = this.IRCParameters["badge-info"];
        this.badgesRaw = this.IRCParameters["badges"];
        this.badges = messageBadges(this.badgesRaw);

        this.senderUserName = messageUser(this.IRCMessagePrefix);
        this.senderDisplayName = this.IRCParameters["display-name"] ?? undefined;
        this.senderUserType = this.IRCParameters["user-type"] ?? undefined;
        this.senderUserColor = this.IRCParameters["color"] ?? undefined;

        this.channelNameRaw = this.IRCMessageParts[3] ?? undefined;
        this.channelName = (i.utils.cleanChannelName(this.channelNameRaw));

        this.emoteSetsRaw = this.IRCParameters["emote-sets"];
        this.emoteSets = messageEmoteSets(this.emotesSetsRaw);

        this.isModRaw = this.IRCParameters["mod"];
        this.isMod = (this.isModRaw === "1");

        this.isSubscriberRaw = this.IRCParameters["subscriber"];
        this.isSubscriber = (this.isSubscriberRaw === "1");

        this.turboRaw = this.IRCParameters["turbo"];
        this.turbo = (this.turboRaw === "1");

        this.messageID = this.IRCParameters["id"] ?? undefined;
    };
};

module.exports = userstateMessage;