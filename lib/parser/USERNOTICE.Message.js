const messageBadges = require("../util/message.Badges");
const messageCommand = require("../util/message.Command");
const messageContent = require("../util/message.Content");
const messageEmotes = require("../util/message.Emotes");
const messageParameters = require("../util/message.Parameters");

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

    get serverDelay(){
        return (Date.now()-this.serverTimestampRaw);
    };

    /**
     * @param {Symbol} sym
     * @param {string} rawMessage 
     */
    constructor(sym, rawMessage) {
        let i = require("../index");

        this._raw = rawMessage;

        this.IRCCommand = messageCommand(rawMessage);
        this.IRCMessageParts = [...this._raw.split(" ").slice(0, 4), messageContent(this._raw)];
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
        this.isVip = (this.isVipRaw !== undefined);

        this.isSubscriberRaw = this.IRCParameters["subscriber"];
        this.isSubscriber = (this.isSubscriberRaw !== undefined);

        this.msgID = this.IRCParameters["msg-id"];
        this.systemMessage = this.IRCParameters["system-msg"];

        this.messageID = (this.IRCParameters["id"] ?? undefined);

        this.serverTimestampRaw = parseInt(this.IRCParameters["tmi-sent-ts"]);
        this.serverTimestamp = new Date(this.serverTimestampRaw);

        Object.keys(this.IRCParameters).filter(a => { return a.startsWith("msg-param") }).forEach(a => {
            this[a] = this.IRCParameters[a];
        });

        this.send = (message) => {
            return require("../operations/privmsg")(sym, this.channelName, message).catch();
        };

        this.reply = (message) => {
            return require("../operations/reply")(sym, message, this.channelName, this.messageID).catch();
        };

        this.action = (message) => {
            return require("../operations/action")(sym, this.channelName, message).catch();
        };

        this.sendRaw = (message) => {
            return require("../operations/sendraw")(sym, message).catch();
        };

        this.whisper = (message) => {
            return require("../operations/whisper")(sym, this.senderUserID, message).catch();
        };

        this.userstate = new class userstate {
            /** @param {usernoticeMessage} inp */
            constructor(inp) {
                this.username = inp.senderUserName;
                this.displayName = inp.senderDisplayName;
                this.color = inp.senderUserColor;
                this.isMod = inp.isMod;
                this.subscriber = inp.isSubscriber;
                this.userType = inp.senderUserType;
                this.badgeInfo = inp.badgeInfo;
                this.badges = inp.badges;
                this.badgesRaw = inp.badgesRaw;
                this.id = inp.senderUserID;
            };
        }(this);

        this.message = new class message {
            /** @param {usernoticeMessage} inp */
            constructor(inp) {
                this.messageText = inp.systemMessage;
                this.id = inp.messageID;
                this.type = inp.IRCCommand;
                this.emotes = inp.emotes;
                this.emotesRaw = inp.emotesRaw;
                this.emotecount = this.emotes.length;
                this.timestamp = inp.serverTimestamp;
                this.timestampRaw = inp.serverTimestampRaw;
            };
        }(this);

        this.channel = new class channel {
            /** @param {usernoticeMessage} inp */
            constructor(inp) {
                this.name = inp.channelName;
                this.id = inp.channelID;
            };
        }(this);

        this.server = new class server {
            /** @param {usernoticeMessage} inp */
            constructor(inp) {
                this._raw = inp._raw;
                this.timestamp = inp.serverTimestamp;
                this.timestampRaw = inp.serverTimestampRaw;
                this.IRCParameters = inp.IRCParameters;
            };
        }(this);
    };
};

module.exports = usernoticeMessage;