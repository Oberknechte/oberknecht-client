const { messageBadges, messageCommand, messageContent, messageEmotes, messageParameters } = require("oberknecht-utils");

let i = require("../index");

class usernoticeMessage {
    #sym;
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

    get isBroadcaster() {
        return (this.channelID == this.senderUserID);
    };

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

    get serverDelay() {
        return (Date.now() - this.serverTimestampRaw);
    };

    async ban(reason) { return i.OberknechtAPI[this.#sym].ban(this.channelID, this.senderUserID, reason) };
    async unban() { return i.OberknechtAPI[this.#sym].unban(this.channelID, this.senderUserID) };
    async untimeout() { return i.OberknechtAPI[this.#sym].unban(this.channelID, this.senderUserID) }
    async timeout(duration, reason) { return i.OberknechtAPI[this.#sym].timeout(this.channelID, this.senderUserID, duration, reason) };
    async delete() { return i.OberknechtAPI[this.#sym].deleteMessage(this.channelID, this.messageID) };
    async shoutout() { return i.OberknechtAPI[this.#sym].shoutout(this.channelID, this.senderUserID) };
    async announce(message) { return i.OberknechtAPI[this.#sym].announce(message) };
    async slow(wait_time) { return i.OberknechtAPI[this.#sym].slow(this.channelID, wait_time) };
    async slowOff() { return i.OberknechtAPI[this.#sym].slowOff(this.channelID) };
    async followers(duration) { return i.OberknechtAPI[this.#sym].followers(this.channelID, duration) };
    async followersOff() { return i.OberknechtAPI[this.#sym].followersOff(this.channelID) };
    async subscribers() { return i.OberknechtAPI[this.#sym].subscribers(this.channelID) };
    async subscribersOff() { return i.OberknechtAPI[this.#sym].subscribersOff(this.channelID) };
    async emoteOnly() { return i.OberknechtAPI[this.#sym].emote(this.channelID) };
    async emoteOnlyOff() { return i.OberknechtAPI[this.#sym].emoteOff(this.channelID) };
    async r9k() { return i.OberknechtAPI[this.#sym].r9k(this.channelID) };
    async r9kOff() { return i.OberknechtAPI[this.#sym].r9kOff(this.channelID) };
    async chatdelay(duration) { return i.OberknechtAPI[this.#sym].chatdelay(this.channelID, duration) };
    async chatdelayOff() { return i.OberknechtAPI[this.#sym].chatdelayOff(this.channelID) };

    async send(message) { return require("../operations/privmsg")(this.#sym, this.channelName, message).catch() };
    async reply(message) { return require("../operations/reply")(this.#sym, message, this.channelName, this.messageID).catch() };
    async action(message) { return require("../operations/action")(this.#sym, this.channelName, message).catch() };
    async sendRaw(message) { return require("../operations/sendraw")(this.#sym, message).catch() };
    async whisper(message) { return require("../operations/whisper")(this.#sym, this.senderUserID, message).catch() };

    /** @param {Symbol} sym @param {string} rawMessage */
    constructor(sym, rawMessage) {
        this.#sym = sym;
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

                this.ban = inp.ban;
                this.unban = inp.unban;
                this.timeout = inp.timeout;
                this.untimeout = inp.untimeout;
                this.shoutout = inp.shoutout;
            };
        }(this);

        this.message = new class message {
            /** @param {usernoticeMessage} inp */
            constructor(inp) {
                this.id = inp.messageID;
                this.type = inp.IRCCommand;
                this.emotes = inp.emotes;
                this.emotesRaw = inp.emotesRaw;
                this.emotecount = this.emotes.length;
                this.timestamp = inp.serverTimestamp;
                this.timestampRaw = inp.serverTimestampRaw;

                this.delete = inp.delete;
            };
        }(this);

        this.channel = new class channel {
            /** @param {usernoticeMessage} inp */
            constructor(inp) {
                this.name = inp.channelName;
                this.id = inp.channelID;

                this.slow = inp.slow;
                this.slowOff = inp.slowOff;
                this.followers = inp.followers;
                this.followersOff = inp.followersOff;
                this.subscribers = inp.subscribers;
                this.subscribersOff = inp.subscribersOff;
                this.emoteOnly = inp.emoteOnly;
                this.emoteOnlyOff = inp.emoteOnlyOff;
                this.r9k = inp.r9k;
                this.r9kOff = inp.r9kOff;
                this.chatdelay = inp.chatdelay;
                this.chatdelayOff = inp.chatdelayOff;
                this.announce = inp.announce;
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