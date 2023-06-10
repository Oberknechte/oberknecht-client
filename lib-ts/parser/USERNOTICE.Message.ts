import {
  BadgesMap,
  cleanChannelName,
  messageBadges,
  messageCommand,
  messageContent,
  messageEmotes,
  messageEmotesReturn,
  messageParameters,
} from "oberknecht-utils";
import { i } from "..";
import { userstate } from "./subclasses/USERNOTICE.userstate";
import { message } from "./subclasses/USERNOTICE.message";
import { channel } from "./subclasses/USERNOTICE.channel";
import { server } from "./subclasses/USERNOTICE.server";
import { privmsg } from "../operations/privmsg";
import { reply } from "../operations/reply";
import { action } from "../operations/action";
import { sendraw } from "../operations/sendraw";
import { whisper } from "../operations/whisper";

export class usernoticeMessage {
  sym;
  _raw: string;
  timestamp: number;

  IRCCommand: string;
  IRCParameters: object;
  IRCMessageParts: string[];

  badgeInfo: string;
  badges: BadgesMap;
  badgesRaw: string;

  senderUserName: string;
  senderDisplayName: string;
  senderUserID: string;
  senderUserType: string;
  senderUserColor: string;

  targetUserName: string;
  targetUserDisplayName: string;
  targetUserID: string;

  channelName: string;
  channelID: string;

  emotes: messageEmotesReturn;
  emotesRaw: string;

  isMod: boolean;
  isModRaw: string;

  get isBroadcaster() {
    return this.channelID === this.senderUserID;
  }

  isVip: boolean;
  isVipRaw: string;

  isSubscriber: boolean;
  isSubscriberRaw: string;

  msgID: string;
  systemMessage: string;
  systemMessageRaw: string;

  messageID: string;

  get isAnySub() {
    return [
      "sub",
      "resub",
      "subgift",
      "submysterygift",
      "rewardgift",
      "giftpaidupgrade",
      "anongiftpaidupgrade",
    ].includes(this.msgID);
  }

  serverTimestamp: Date;
  serverTimestampRaw: number;
  serverDelay: number;

  userstate: userstate;
  message: message;
  channel: channel;
  server: server;

  constructor(sym: string, rawMessage: string) {
    this.sym = sym;
    const dn = Date.now();
    this.timestamp = dn;
    this._raw = rawMessage;

    this.IRCCommand = messageCommand(rawMessage);
    this.IRCMessageParts = [
      ...this._raw.split(" ").slice(0, 4),
      messageContent(this._raw),
    ];
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
    this.channelName = cleanChannelName(this.IRCMessageParts[3]);

    this.emotesRaw = this.IRCParameters["emotes"];
    this.emotes = messageEmotes(this.emotesRaw);

    this.isModRaw = this.IRCParameters["mod"];
    this.isMod = this.isModRaw === "1";

    this.isVipRaw = this.IRCParameters["vip"];
    this.isVip = this.isVipRaw !== undefined;

    this.isSubscriberRaw = this.IRCParameters["subscriber"];
    this.isSubscriber = this.isSubscriberRaw !== undefined;

    this.msgID = this.IRCParameters["msg-id"];
    this.systemMessage = this.IRCParameters["system-msg"];

    this.messageID = this.IRCParameters["id"] ?? undefined;

    this.serverTimestampRaw = parseInt(this.IRCParameters["tmi-sent-ts"]);
    this.serverTimestamp = new Date(this.serverTimestampRaw);
    this.serverDelay = dn - this.serverTimestampRaw;

    this.targetUserName = this.IRCParameters["msg-param-recipient-user-name"];
    this.targetUserDisplayName = this.IRCParameters[
      "msg-param-recipient-display-name"
    ];
    this.targetUserID = this.IRCParameters["msg-param-recipient-id"];

    this.userstate = new userstate(this);
    this.message = new message(this);
    this.channel = new channel(this);
    this.server = new server(this);
  }

  async ban(reason?: string) {
    return i.OberknechtAPI[this.sym].ban(
      this.channelID,
      this.senderUserID,
      reason
    );
  }
  async unban() {
    return i.OberknechtAPI[this.sym].unban(this.channelID, this.senderUserID);
  }
  async untimeout() {
    return i.OberknechtAPI[this.sym].unban(this.channelID, this.senderUserID);
  }
  async timeout(duration, reason) {
    return i.OberknechtAPI[this.sym].timeout(
      this.channelID,
      this.senderUserID,
      duration,
      reason
    );
  }
  async delete() {
    return i.OberknechtAPI[this.sym].deleteMessage(
      this.channelID,
      this.messageID
    );
  }
  async shoutout() {
    return i.OberknechtAPI[this.sym].shoutout(
      this.channelID,
      this.senderUserID
    );
  }
  async announce(message: string) {
    return i.OberknechtAPI[this.sym].announce(message);
  }
  async slow(wait_time: number) {
    return i.OberknechtAPI[this.sym].slow(this.channelID, wait_time);
  }
  async slowOff() {
    return i.OberknechtAPI[this.sym].slowOff(this.channelID);
  }
  async followers(duration?: number) {
    return i.OberknechtAPI[this.sym].followers(this.channelID, duration);
  }
  async followersOff() {
    return i.OberknechtAPI[this.sym].followersOff(this.channelID);
  }
  async subscribers() {
    return i.OberknechtAPI[this.sym].subscribers(this.channelID);
  }
  async subscribersOff() {
    return i.OberknechtAPI[this.sym].subscribersOff(this.channelID);
  }
  async emoteOnly() {
    return i.OberknechtAPI[this.sym].emote(this.channelID);
  }
  async emoteOnlyOff() {
    return i.OberknechtAPI[this.sym].emoteOff(this.channelID);
  }
  async r9k() {
    return i.OberknechtAPI[this.sym].r9k(this.channelID);
  }
  async r9kOff() {
    return i.OberknechtAPI[this.sym].r9kOff(this.channelID);
  }
  async chatdelay(duration: number) {
    return i.OberknechtAPI[this.sym].chatdelay(this.channelID, duration);
  }
  async chatdelayOff() {
    return i.OberknechtAPI[this.sym].chatdelayOff(this.channelID);
  }

  async send(message: string) {
    return privmsg(this.sym, this.channelName, message).catch();
  }
  async reply(message: string) {
    return reply(this.sym, message, this.channelName, this.messageID).catch();
  }
  async action(message: string) {
    return action(this.sym, this.channelName, message).catch();
  }
  async sendRaw(message: string) {
    return sendraw(this.sym, message).catch();
  }
  async whisper(message: string) {
    return whisper(this.sym, this.senderUserID, message).catch();
  }
}
