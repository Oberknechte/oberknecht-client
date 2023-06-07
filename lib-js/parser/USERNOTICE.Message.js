"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.usernoticeMessage = void 0;
let oberknecht_utils_1 = require("oberknecht-utils");
let __1 = require("..");
let USERNOTICE_userstate_1 = require("./subclasses/USERNOTICE.userstate");
let USERNOTICE_message_1 = require("./subclasses/USERNOTICE.message");
let USERNOTICE_channel_1 = require("./subclasses/USERNOTICE.channel");
let USERNOTICE_server_1 = require("./subclasses/USERNOTICE.server");
let privmsg_1 = require("../operations/privmsg");
let reply_1 = require("../operations/reply");
let action_1 = require("../operations/action");
let sendraw_1 = require("../operations/sendraw");
let whisper_1 = require("../operations/whisper");
class usernoticeMessage {
    sym;
    _raw;
    timestamp;
    IRCCommand;
    IRCParameters;
    IRCMessageParts;
    badgeInfo;
    badges;
    badgesRaw;
    senderUserName;
    senderDisplayName;
    senderUserID;
    senderUserType;
    senderUserColor;
    targetUserName;
    targetUserDisplayName;
    targetUserID;
    channelName;
    channelID;
    emotes;
    emotesRaw;
    isMod;
    isModRaw;
    get isBroadcaster() { return (this.channelID === this.senderUserID); }
    ;
    isVip;
    isVipRaw;
    isSubscriber;
    isSubscriberRaw;
    msgID;
    systemMessage;
    systemMessageRaw;
    messageID;
    get isAnySub() { return ["sub", "resub", "subgift", "submysterygift", "rewardgift", "giftpaidupgrade", "anongiftpaidupgrade"].includes(this.msgID); }
    ;
    serverTimestamp;
    serverTimestampRaw;
    serverDelay;
    userstate;
    message;
    channel;
    server;
    constructor(sym, rawMessage) {
        this.sym = sym;
        const dn = Date.now();
        this.timestamp = dn;
        this._raw = rawMessage;
        this.IRCCommand = (0, oberknecht_utils_1.messageCommand)(rawMessage);
        this.IRCMessageParts = [...this._raw.split(" ").slice(0, 4), (0, oberknecht_utils_1.messageContent)(this._raw)];
        this.IRCParameters = (0, oberknecht_utils_1.messageParameters)(this._raw);
        this.badgeInfo = this.IRCParameters["badge-info"];
        this.badgesRaw = this.IRCParameters["badges"];
        this.badges = (0, oberknecht_utils_1.messageBadges)(this.badgesRaw);
        this.senderUserName = this.IRCParameters["login"];
        this.senderDisplayName = this.IRCParameters["display-name"];
        this.senderUserID = this.IRCParameters["user-id"];
        this.senderUserType = this.IRCParameters["user-type"];
        this.senderUserColor = this.IRCParameters["color"];
        this.channelID = this.IRCParameters["room-id"];
        this.channelName = (0, oberknecht_utils_1.cleanChannelName)(this.IRCMessageParts[3]);
        this.emotesRaw = this.IRCParameters["emotes"];
        this.emotes = (0, oberknecht_utils_1.messageEmotes)(this.emotesRaw);
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
        this.serverDelay = (dn - this.serverTimestampRaw);
        this.targetUserName = this.IRCParameters["msg-param-recipient-user-name"];
        this.targetUserDisplayName = this.IRCParameters["msg-param-recipient-display-name"];
        this.targetUserID = this.IRCParameters["msg-param-recipient-id"];
        this.userstate = new USERNOTICE_userstate_1.userstate(this);
        this.message = new USERNOTICE_message_1.message(this);
        this.channel = new USERNOTICE_channel_1.channel(this);
        this.server = new USERNOTICE_server_1.server(this);
    }
    ;
    async ban(reason) { return __1.i.OberknechtAPI[this.sym].ban(this.channelID, this.senderUserID, reason); }
    ;
    async unban() { return __1.i.OberknechtAPI[this.sym].unban(this.channelID, this.senderUserID); }
    ;
    async untimeout() { return __1.i.OberknechtAPI[this.sym].unban(this.channelID, this.senderUserID); }
    async timeout(duration, reason) { return __1.i.OberknechtAPI[this.sym].timeout(this.channelID, this.senderUserID, duration, reason); }
    ;
    async delete() { return __1.i.OberknechtAPI[this.sym].deleteMessage(this.channelID, this.messageID); }
    ;
    async shoutout() { return __1.i.OberknechtAPI[this.sym].shoutout(this.channelID, this.senderUserID); }
    ;
    async announce(message) { return __1.i.OberknechtAPI[this.sym].announce(message); }
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
exports.usernoticeMessage = usernoticeMessage;
;
