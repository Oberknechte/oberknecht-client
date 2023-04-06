const { messageBadges, messageCommand, messageParameters, messageEmotes, messagePrefix, messageUser, messageContent } = require("oberknecht-utils");

let i = require("../index");

class privmsgMessage {
    sym;
    #action_reg = /^\u0001ACTION ([^\u0001]+)\u0001$/;

    _raw = String();

    prefix = String() || undefined;
    command = String() || undefined;

    IRCCommand = String();
    IRCParameters = Object();
    IRCMessageParts = Array();
    IRCMessagePrefix = String();

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

    get isBroadcaster() {
        return (this.channelID == this.senderUserID);
    };

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
    replyParentMessageBodyRaw = String() || undefined;
    replyParentMessageID = String() || undefined;
    replyParentUserID = String() || undefined;
    replyParentUserLogin = String() || undefined;

    serverTimestamp = Date();
    serverTimestampRaw = Number();
    serverDelay = Number();

    /** @param {Symbol} sym @param {string} rawMessage */
    constructor(sym, rawMessage) {
        this.sym = sym;
        const dn = Date.now();
        this._raw = rawMessage;

        this.IRCMessageParts = [...this._raw.split(" ").slice(0, 4), messageContent(this._raw)];
        this.IRCCommand = messageCommand(this._raw);
        this.IRCParameters = messageParameters(this._raw);
        this.IRCMessagePrefix = messagePrefix(this._raw);

        this.prefix = i.clientData[sym]._options.prefix;

        this.messageText = i.utils.correctMessage(this.IRCMessageParts[4]);
        this.messageParts = this.messageText.split(" ");
        this.messageArguments = [...this.messageParts];
        this.messageID = this.IRCParameters["id"];

        let msgmatch = this.messageText.match(new RegExp(`^${this.prefix}+\\w+`, "gi"));
        this.command = ((msgmatch ?? undefined) ? msgmatch[0].replace(new RegExp(`^${this.prefix}`), "") : undefined)
        if (msgmatch) this.messageArguments = this.messageArguments.slice(this.prefix.split(" ").length - 1);

        this.senderUserName = messageUser(this.IRCMessagePrefix);
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

        this.isSubscriberRaw = this.IRCParameters["subscriber"];
        this.isSubscriber = (this.isSubscriberRaw === "1");

        this.isModRaw = this.IRCParameters["mod"];
        this.isMod = (this.isModRaw === "1");

        this.isVipRaw = this.IRCParameters["vip"];
        this.isVip = (this.isVipRaw !== undefined);

        this.isAction = (i.regex.twitch.message.action().test(this.messageText));
        this.isCheer = (this.bits > 0);
        this.isReply = (this.replyParentMessageID !== undefined);

        this.firstMsgRaw = this.IRCParameters["first-msg"];
        this.firstMsg = (this.firstMsgRaw === "1");

        this.turbo = (this.IRCParameters["turbo"] === 1);

        this.channelName = i.utils.cleanChannelName(this.IRCMessageParts[3]);
        this.channelID = this.IRCParameters["room-id"];

        this.replyParentDisplayName = this.IRCParameters["reply-parent-display-name"] ?? undefined;
        this.replyParentMessageBodyRaw = this.IRCParameters["reply-parent-msg-body"] ?? undefined;
        this.replyParentMessageBody = this.IRCParameters["reply-parent-msg-body"]?.replace(/\\s/g, " ") ?? undefined;
        this.replyParentMessageID = this.IRCParameters["reply-parent-msg-id"] ?? undefined;
        this.replyParentUserID = this.IRCParameters["reply-parent-user-id"] ?? undefined;
        this.replyParentUserLogin = this.IRCParameters["reply-parent-user-login"] ?? undefined;

        this.serverTimestampRaw = parseInt(this.IRCParameters["tmi-sent-ts"]);
        this.serverTimestamp = new Date(this.serverTimestampRaw);
        this.serverDelay = (dn - this.serverTimestampRaw);

        this.userstate = new class userstate {
            _inp;
            /** @param {privmsgMessage} inp */
            constructor(inp) {
                this._inp = inp;
                this.username = inp.senderUserName;
                this.displayName = inp.senderDisplayName;
                this.color = inp.senderUserColor;
                this.isMod = inp.isMod;
                this.isVip = inp.isVip;
                this.subscriber = inp.isSubscriber;
                this.turbo = inp.turbo;
                this.userType = inp.senderUserType;
                this.badgeInfo = inp.badgeInfo;
                this.badges = inp.badges;
                this.badgesRaw = inp.badgesRaw;
                this.id = inp.senderUserID;
            };

            async ban(reason) { return i.OberknechtAPI[this._inp.sym].ban(this._inp.channelID, this._inp.senderUserID, reason) };
            async unban() { return i.OberknechtAPI[this._inp.sym].unban(this._inp.channelID, this._inp.senderUserID) };
            async timeout(duration, reason) { return i.OberknechtAPI[this._inp.sym].timeout(this._inp.channelID, this._inp.senderUserID, duration, reason) };
            async untimeout() { return i.OberknechtAPI[this._inp.sym].unban(this._inp.channelID, this._inp.senderUserID) }
            async shoutout() { return i.OberknechtAPI[this._inp.sym].shoutout(this._inp.channelID, this._inp.senderUserID) };

            async mod() { return i.OberknechtAPI[this._inp.sym].mod(this._inp.senderUserID) };
            async unmod() { return i.OberknechtAPI[this._inp.sym].unmod(this._inp.senderUserID) };
            async vip() { return i.OberknechtAPI[this._inp.sym].vip(this._inp.senderUserID) };
            async unvip() { return i.OberknechtAPI[this._inp.sym].unvip(this._inp.senderUserID) };
        }(this);

        this.message = new class message {
            _inp;
            /** @param {privmsgMessage} inp */
            constructor(inp) {
                this._inp = inp;
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

            async delete() { return i.OberknechtAPI[this._inp.sym].deleteMessage(this._inp.channelID, this._inp.messageID) };
        }(this);

        this.channel = new class channel {
            _inp;

            /** @param {privmsgMessage} inp */
            constructor(inp) {
                this._inp = inp;

                this.name = inp.channelName;
                this.id = inp.channelID;
            };

            async slow(wait_time) { return i.OberknechtAPI[this._inp.sym].slow(this._inp.channelID, wait_time) };
            async slowOff() { return i.OberknechtAPI[this._inp.sym].slowOff(this._inp.channelID) };
            async followers(duration) { return i.OberknechtAPI[this._inp.sym].followers(this._inp.channelID, duration) };
            async followersOff() { return i.OberknechtAPI[this._inp.sym].followersOff(this._inp.channelID) };
            async subscribers() { return i.OberknechtAPI[this._inp.sym].subscribers(this._inp.channelID) };
            async subscribersOff() { return i.OberknechtAPI[this._inp.sym].subscribersOff(this._inp.channelID) };
            async emoteOnly() { return i.OberknechtAPI[this._inp.sym].emote(this._inp.channelID) };
            async emoteOnlyOff() { return i.OberknechtAPI[this._inp.sym].emoteOff(this._inp.channelID) };
            async r9k() { return i.OberknechtAPI[this._inp.sym].r9k(this._inp.channelID) };
            async r9kOff() { return i.OberknechtAPI[this._inp.sym].r9kOff(this._inp.channelID) };
            async chatdelay(duration) { return i.OberknechtAPI[this._inp.sym].chatdelay(this._inp.channelID, duration) };
            async chatdelayOff() { return i.OberknechtAPI[this._inp.sym].chatdelayOff(this._inp.channelID) };
            async shoutout(target_channel_id) { return i.OberknechtAPI[this._inp.sym].shoutout(this._inp.channelID, target_channel_id) };
            async announce(message, color) { return i.OberknechtAPI[this._inp.sym].announce(this._inp.channelID, message, color) };
            async raid(to_broadcaster_id) { return i.OberknechtAPI[this._inp.sym].raid(this._inp.channelID, to_broadcaster_id) };
            async unraid(broadcaster_id) { return i.OberknechtAPI[this._inp.sym].unraid(broadcaster_id) };
        }(this);

        this.server = new class server {
            /** @param {privmsgMessage} inp */
            constructor(inp) {
                this._raw = inp._raw;
                this.timestamp = inp.serverTimestamp;
                this.timestampRaw = inp.serverTimestampRaw;
                this.IRCParameters = inp.IRCParameters;
            };
        }(this);
    };

    async ban(reason) { return i.OberknechtAPI[this.sym].ban(this.channelID, this.senderUserID, reason) };
    async unban() { return i.OberknechtAPI[this.sym].unban(this.channelID, this.senderUserID) };
    async timeout(duration, reason) { return i.OberknechtAPI[this.sym].timeout(this.channelID, this.senderUserID, duration, reason) };
    async untimeout() { return i.OberknechtAPI[this.sym].unban(this.channelID, this.senderUserID) }
    async delete() { return i.OberknechtAPI[this.sym].deleteMessage(this.channelID, this.messageID) };
    async shoutout() { return i.OberknechtAPI[this.sym].shoutout(this.channelID, this.senderUserID) };
    async announce(message, color) { return i.OberknechtAPI[this.sym].announce(this.channelID, message, color) };
    async slow(wait_time) { return i.OberknechtAPI[this.sym].slow(this.channelID, wait_time) };
    async slowOff() { return i.OberknechtAPI[this.sym].slowOff(this.channelID) };
    async followers(duration) { return i.OberknechtAPI[this.sym].followers(this.channelID, duration) };
    async followersOff() { return i.OberknechtAPI[this.sym].followersOff(this.channelID) };
    async subscribers() { return i.OberknechtAPI[this.sym].subscribers(this.channelID) };
    async subscribersOff() { return i.OberknechtAPI[this.sym].subscribersOff(this.channelID) };
    async emoteOnly() { return i.OberknechtAPI[this.sym].emote(this.channelID) };
    async emoteOnlyOff() { return i.OberknechtAPI[this.sym].emoteOff(this.channelID) };
    async r9k() { return i.OberknechtAPI[this.sym].r9k(this.channelID) };
    async r9kOff() { return i.OberknechtAPI[this.sym].r9kOff(this.channelID) };
    async chatdelay(duration) { return i.OberknechtAPI[this.sym].chatdelay(this.channelID, duration) };
    async chatdelayOff() { return i.OberknechtAPI[this.sym].chatdelayOff(this.channelID) };

    async mod(userid) { return i.OberknechtAPI[this.sym].mod(userid) };
    async unmod(userid) { return i.OberknechtAPI[this.sym].unmod(userid) };
    async vip(userid) { return i.OberknechtAPI[this.sym].vip(userid) };
    async unvip(userid) { return i.OberknechtAPI[this.sym].unvip(userid) };

    async raid(to_broadcaster_id) { return i.OberknechtAPI[this.sym].raid(this.channelID, to_broadcaster_id) };
    async unraid(broadcaster_id) { return i.OberknechtAPI[this.sym].unraid(broadcaster_id) };

    /** @param {"blue" | "blue_violet" | "cadet_blue" | "chocolate" | "coral" | "dodger_blue" | "firebrick" | "golden_rod" | "green" | "hot_pink" | "orange_red" | "red" | "sea_green" | "spring_green" | "yellow_green"} color */
    async updateColor(color) { return i.OberknechtAPI[this.sym].updateColor(color) };
    async getColor(userids) { return i.OberknechtAPI[this.sym].getColor(userids) };

    async send(message) { return require("../operations/privmsg")(this.sym, this.channelName, message).catch() };
    async reply(message) { return require("../operations/reply")(this.sym, message, this.channelName, this.messageID).catch() };
    async action(message) { return require("../operations/action")(this.sym, this.channelName, message).catch() };
    async sendRaw(message) { return require("../operations/sendraw")(this.sym, message).catch() };
    async whisper(message) { return require("../operations/whisper")(this.sym, this.senderUserID, message).catch() };
};

module.exports = privmsgMessage;