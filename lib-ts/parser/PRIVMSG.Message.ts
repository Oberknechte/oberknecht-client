import {
  messageBadges,
  messageCommand,
  messageParameters,
  messageEmotes,
  messagePrefix,
  messageUser,
  messageContent,
  cleanChannelName,
  messageEmotesReturn,
  correctMessage,
} from "oberknecht-utils";
import { i } from "..";
import { userstate } from "./subclasses/PRIVMSG.userstate";
import { message } from "./subclasses/PRIVMSG.message";
import { channel } from "./subclasses/PRIVMSG.channel";
import { server } from "./subclasses/PRIVMSG.server";
import { colorsType } from "oberknecht-api/lib-ts/types/endpoints/color";
import { privmsg } from "../operations/privmsg";
import { reply } from "../operations/reply";
import { action } from "../operations/action";
import { sendraw } from "../operations/sendraw";
import { whisper } from "../operations/whisper";

export class privmsgMessage {
  sym;
  _raw: string;
  timestamp: number;

  #action_reg = /^\u0001ACTION ([^\u0001]+)\u0001$/;

  prefix: string | undefined;
  command: string | undefined;

  IRCCommand: string;
  IRCParameters: object;
  IRCMessageParts: string[];
  IRCMessagePrefix: string;

  messageText: string;
  messageParts: string[];
  messageArguments: string[];
  messageID: string;

  senderUserName: string;
  senderDisplayName: string;
  senderUserID: string;
  senderUserType: string;
  senderUserColor: string;

  badgeInfo: string;
  badges: object;
  badgesRaw: string;
  bits: number;
  emotes: messageEmotesReturn;
  emotesRaw: string;
  flags: string | undefined;

  isAction: boolean;

  isSubscriber: boolean;
  isSubscriberRaw: string;

  isMod = Boolean();
  isModRaw = String();

  get isBroadcaster() {
    return this.channelID == this.senderUserID;
  }

  isVip: boolean;
  isVipRaw: string;

  isCheer: boolean;
  isReply: boolean;

  firstMsg: boolean;
  firstMsgRaw: string;

  turbo: boolean;

  channelName: string;
  channelID: string;

  replyParentDisplayName: string | undefined;
  replyParentMessageBody: string | undefined;
  replyParentMessageBodyRaw: string | undefined;
  replyParentMessageID: string | undefined;
  replyParentUserID: string | undefined;
  replyParentUserLogin: string | undefined;

  serverTimestamp: Date;
  serverTimestampRaw: number;
  serverDelay: number;

  userstate: userstate;
  message: message;
  channel: channel;
  server: server;

  constructor(sym: string, rawMessage: string) {
    const dn = Date.now();
    this.timestamp = dn;
    this.sym = sym;
    this._raw = rawMessage;

    this.IRCMessageParts = [
      ...this._raw.split(" ").slice(0, 4),
      messageContent(this._raw),
    ];
    this.IRCCommand = messageCommand(this._raw);
    this.IRCParameters = messageParameters(this._raw);
    this.IRCMessagePrefix = messagePrefix(this._raw);

    this.prefix = i.clientData[sym]._options.prefix;

    this.messageText = this.IRCMessageParts[4];
    this.messageParts = this.messageText.split(" ");
    this.messageArguments = [...this.messageParts];
    this.messageID = this.IRCParameters["id"];

    let msgmatch = this.messageText.match(
      new RegExp(`^${this.prefix}+\\w+`, "gi")
    );
    this.command =
      msgmatch ?? undefined
        ? msgmatch?.[0].replace(new RegExp(`^${this.prefix}`), "")
        : undefined;
    // @ts-ignore
    if (msgmatch)
      this.messageArguments = this.messageArguments.slice(
        this.prefix.split(" ").length - 1
      );

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
    this.isSubscriber = this.isSubscriberRaw === "1";

    this.isModRaw = this.IRCParameters["mod"];
    this.isMod = this.isModRaw === "1";

    this.isVipRaw = this.IRCParameters["vip"];
    this.isVip = this.isVipRaw !== undefined;

    this.isAction = i.regex.twitch.message.action().test(this.messageText);
    this.isCheer = this.bits > 0;
    this.isReply = this.replyParentMessageID !== undefined;

    this.firstMsgRaw = this.IRCParameters["first-msg"];
    this.firstMsg = this.firstMsgRaw === "1";

    this.turbo = this.IRCParameters["turbo"] === 1;

    this.channelName = cleanChannelName(this.IRCMessageParts[3]);
    this.channelID = this.IRCParameters["room-id"];

    this.replyParentDisplayName =
      this.IRCParameters["reply-parent-display-name"] ?? undefined;
    this.replyParentMessageBodyRaw =
      this.IRCParameters["reply-parent-msg-body"] ?? undefined;
    this.replyParentMessageBody =
      this.IRCParameters["reply-parent-msg-body"]?.replace(/\\s/g, " ") ??
      undefined;
    this.replyParentMessageID =
      this.IRCParameters["reply-parent-msg-id"] ?? undefined;
    this.replyParentUserID =
      this.IRCParameters["reply-parent-user-id"] ?? undefined;
    this.replyParentUserLogin =
      this.IRCParameters["reply-parent-user-login"] ?? undefined;

    this.serverTimestampRaw = parseInt(this.IRCParameters["tmi-sent-ts"]);
    this.serverTimestamp = new Date(this.serverTimestampRaw);
    this.serverDelay = dn - this.serverTimestampRaw;

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
  async timeout(duration: number, reason?: string) {
    return i.OberknechtAPI[this.sym].timeout(
      this.channelID,
      this.senderUserID,
      duration,
      reason
    );
  }
  async untimeout() {
    return i.OberknechtAPI[this.sym].unban(this.channelID, this.senderUserID);
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
  async announce(message: string, color?: string) {
    return i.OberknechtAPI[this.sym].announce(this.channelID, message, color);
  }
  async slow(wait_time: number) {
    return i.OberknechtAPI[this.sym].slow(this.channelID, wait_time);
  }
  async slowOff() {
    return i.OberknechtAPI[this.sym].slowOff(this.channelID);
  }
  async followers(duration: number) {
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

  async mod(userid: string) {
    return i.OberknechtAPI[this.sym].mod(userid);
  }
  async unmod(userid: string) {
    return i.OberknechtAPI[this.sym].unmod(userid);
  }
  async vip(userid: string) {
    return i.OberknechtAPI[this.sym].vip(userid);
  }
  async unvip(userid: string) {
    return i.OberknechtAPI[this.sym].unvip(userid);
  }

  async raid(to_broadcaster_id: string) {
    return i.OberknechtAPI[this.sym].raid(this.channelID, to_broadcaster_id);
  }
  async unraid(broadcaster_id: string) {
    return i.OberknechtAPI[this.sym].unraid(broadcaster_id);
  }

  async updateColor(color: colorsType) {
    return i.OberknechtAPI[this.sym].updateColor(color);
  }
  async getColor(userids: string | string[]) {
    return i.OberknechtAPI[this.sym].getColor(userids);
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
