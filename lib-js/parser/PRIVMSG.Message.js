"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.privmsgMessage = void 0;
const oberknecht_utils_1 = require("oberknecht-utils");
const __1 = require("..");
const PRIVMSG_userstate_1 = require("./subclasses/PRIVMSG.userstate");
const PRIVMSG_message_1 = require("./subclasses/PRIVMSG.message");
const PRIVMSG_channel_1 = require("./subclasses/PRIVMSG.channel");
const PRIVMSG_server_1 = require("./subclasses/PRIVMSG.server");
const privmsg_1 = require("../operations/privmsg");
const reply_1 = require("../operations/reply");
const action_1 = require("../operations/action");
const sendraw_1 = require("../operations/sendraw");
const whisper_1 = require("../operations/whisper");
class privmsgMessage {
    sym;
    _raw;
    timestamp;
    #action_reg = /^\u0001ACTION ([^\u0001]+)\u0001$/;
    prefix;
    command;
    IRCCommand;
    IRCParameters;
    IRCMessageParts;
    IRCMessagePrefix;
    messageText;
    messageParts;
    messageArguments;
    messageID;
    senderUserName;
    senderDisplayName;
    senderUserID;
    senderUserType;
    senderUserColor;
    badgeInfo;
    badges;
    badgesRaw;
    bits;
    emotes;
    emotesRaw;
    flags;
    isAction;
    isSubscriber;
    isSubscriberRaw;
    isMod = Boolean();
    isModRaw = String();
    get isBroadcaster() {
        return (this.channelID == this.senderUserID);
    }
    ;
    isVip;
    isVipRaw;
    isCheer;
    isReply;
    firstMsg;
    firstMsgRaw;
    turbo;
    channelName;
    channelID;
    replyParentDisplayName;
    replyParentMessageBody;
    replyParentMessageBodyRaw;
    replyParentMessageID;
    replyParentUserID;
    replyParentUserLogin;
    serverTimestamp;
    serverTimestampRaw;
    serverDelay;
    userstate;
    message;
    channel;
    server;
    constructor(sym, rawMessage) {
        const dn = Date.now();
        this.timestamp = dn;
        this.sym = sym;
        this._raw = rawMessage;
        this.IRCMessageParts = [...this._raw.split(" ").slice(0, 4), (0, oberknecht_utils_1.messageContent)(this._raw)];
        this.IRCCommand = (0, oberknecht_utils_1.messageCommand)(this._raw);
        this.IRCParameters = (0, oberknecht_utils_1.messageParameters)(this._raw);
        this.IRCMessagePrefix = (0, oberknecht_utils_1.messagePrefix)(this._raw);
        this.prefix = __1.i.clientData[sym]._options.prefix;
        this.messageText = this.IRCMessageParts[4];
        this.messageParts = this.messageText.split(" ");
        this.messageArguments = [...this.messageParts];
        this.messageID = this.IRCParameters["id"];
        let msgmatch = this.messageText.match(new RegExp(`^${this.prefix}+\\w+`, "gi"));
        this.command = ((msgmatch ?? undefined) ? msgmatch?.[0].replace(new RegExp(`^${this.prefix}`), "") : undefined);
        // @ts-ignore
        if (msgmatch)
            this.messageArguments = this.messageArguments.slice(this.prefix.split(" ").length - 1);
        this.senderUserName = (0, oberknecht_utils_1.messageUser)(this.IRCMessagePrefix);
        this.senderDisplayName = this.IRCParameters["display-name"];
        this.senderUserID = this.IRCParameters["user-id"];
        this.senderUserType = this.IRCParameters["user-type"];
        this.senderUserColor = this.IRCParameters["color"];
        this.badgeInfo = this.IRCParameters["badge-info"];
        this.badgesRaw = this.IRCParameters["badges"];
        this.badges = (0, oberknecht_utils_1.messageBadges)(this.badgesRaw);
        this.bits = parseInt(this.IRCParameters["bits"] ?? 0);
        this.emotesRaw = this.IRCParameters["emotes"];
        this.emotes = (0, oberknecht_utils_1.messageEmotes)(this.emotesRaw);
        this.flags = this.IRCParameters["flags"];
        this.isSubscriberRaw = this.IRCParameters["subscriber"];
        this.isSubscriber = (this.isSubscriberRaw === "1");
        this.isModRaw = this.IRCParameters["mod"];
        this.isMod = (this.isModRaw === "1");
        this.isVipRaw = this.IRCParameters["vip"];
        this.isVip = (this.isVipRaw !== undefined);
        this.isAction = (__1.i.regex.twitch.message.action().test(this.messageText));
        this.isCheer = (this.bits > 0);
        this.isReply = (this.replyParentMessageID !== undefined);
        this.firstMsgRaw = this.IRCParameters["first-msg"];
        this.firstMsg = (this.firstMsgRaw === "1");
        this.turbo = (this.IRCParameters["turbo"] === 1);
        this.channelName = (0, oberknecht_utils_1.cleanChannelName)(this.IRCMessageParts[3]);
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
        this.userstate = new PRIVMSG_userstate_1.userstate(this);
        this.message = new PRIVMSG_message_1.message(this);
        this.channel = new PRIVMSG_channel_1.channel(this);
        this.server = new PRIVMSG_server_1.server(this);
    }
    ;
    async ban(reason) { return __1.i.OberknechtAPI[this.sym].ban(this.channelID, this.senderUserID, reason); }
    ;
    async unban() { return __1.i.OberknechtAPI[this.sym].unban(this.channelID, this.senderUserID); }
    ;
    async timeout(duration, reason) { return __1.i.OberknechtAPI[this.sym].timeout(this.channelID, this.senderUserID, duration, reason); }
    ;
    async untimeout() { return __1.i.OberknechtAPI[this.sym].unban(this.channelID, this.senderUserID); }
    async delete() { return __1.i.OberknechtAPI[this.sym].deleteMessage(this.channelID, this.messageID); }
    ;
    async shoutout() { return __1.i.OberknechtAPI[this.sym].shoutout(this.channelID, this.senderUserID); }
    ;
    async announce(message, color) { return __1.i.OberknechtAPI[this.sym].announce(this.channelID, message, color); }
    ;
    async slow(wait_time) { return __1.i.OberknechtAPI[this.sym].slow(this.channelID, wait_time); }
    ;
    async slowOff() { return __1.i.OberknechtAPI[this.sym].slowOff(this.channelID); }
    ;
    async followers(duration) { return __1.i.OberknechtAPI[this.sym].followers(this.channelID, duration); }
    ;
    async followersOff() { return __1.i.OberknechtAPI[this.sym].followersOff(this.channelID); }
    ;
    async subscribers() { return __1.i.OberknechtAPI[this.sym].subscribers(this.channelID); }
    ;
    async subscribersOff() { return __1.i.OberknechtAPI[this.sym].subscribersOff(this.channelID); }
    ;
    async emoteOnly() { return __1.i.OberknechtAPI[this.sym].emote(this.channelID); }
    ;
    async emoteOnlyOff() { return __1.i.OberknechtAPI[this.sym].emoteOff(this.channelID); }
    ;
    async r9k() { return __1.i.OberknechtAPI[this.sym].r9k(this.channelID); }
    ;
    async r9kOff() { return __1.i.OberknechtAPI[this.sym].r9kOff(this.channelID); }
    ;
    async chatdelay(duration) { return __1.i.OberknechtAPI[this.sym].chatdelay(this.channelID, duration); }
    ;
    async chatdelayOff() { return __1.i.OberknechtAPI[this.sym].chatdelayOff(this.channelID); }
    ;
    async mod(userid) { return __1.i.OberknechtAPI[this.sym].mod(userid); }
    ;
    async unmod(userid) { return __1.i.OberknechtAPI[this.sym].unmod(userid); }
    ;
    async vip(userid) { return __1.i.OberknechtAPI[this.sym].vip(userid); }
    ;
    async unvip(userid) { return __1.i.OberknechtAPI[this.sym].unvip(userid); }
    ;
    async raid(to_broadcaster_id) { return __1.i.OberknechtAPI[this.sym].raid(this.channelID, to_broadcaster_id); }
    ;
    async unraid(broadcaster_id) { return __1.i.OberknechtAPI[this.sym].unraid(broadcaster_id); }
    ;
    async updateColor(color) { return __1.i.OberknechtAPI[this.sym].updateColor(color); }
    ;
    async getColor(userids) { return __1.i.OberknechtAPI[this.sym].getColor(userids); }
    ;
    async send(message) { return (0, privmsg_1.privmsg)(this.sym, this.channelName, message).catch(); }
    ;
    async reply(message) { return (0, reply_1.reply)(this.sym, message, this.channelName, this.messageID).catch(); }
    ;
    async action(message) { return (0, action_1.action)(this.sym, this.channelName, message).catch(); }
    ;
    async sendRaw(message) { return (0, sendraw_1.sendraw)(this.sym, message).catch(); }
    ;
    async whisper(message) { return (0, whisper_1.whisper)(this.sym, this.senderUserID, message).catch(); }
    ;
}
exports.privmsgMessage = privmsgMessage;
;
