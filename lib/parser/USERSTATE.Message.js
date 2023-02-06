const messageBadges = require("./util/messageBadges");
const messageCommand = require("./util/messageCommand");
const messageParameters = require("./util/messageParameters");
const messageEmoteSets = require("./util/messageEmoteSets");

class userstateMessage {
    _raw = String();
    
    IRCCommand = String();
    IRCParameters = Object();
    IRCMessageParts = Array();

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
    constructor(sym, rawMessage){
        let i = require("../index");
        
        this._raw = rawMessage;

        this.IRCCommand = messageCommand(rawMessage);
        this.IRCMessageParts = [...this._raw.split(" ").filter((v, i) => {return i < 4})];
        this.IRCParameters = messageParameters(this._raw);

        this.badgeInfo = this.IRCParameters["badge-info"];
        this.badgesRaw = this.IRCParameters["badges"];
        this.badges = messageBadges(this.badgesRaw);

        this.senderUserName = this.IRCParameters["displayName"]?.toLowerCase() ?? undefined;
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