import {
  messageBadges,
  messageCommand,
  messageParameters,
  messageEmoteSets,
  messagePrefix,
  messageUser,
} from "oberknecht-utils";
import { i } from "..";

export class userstateMessage {
  sym;
  _raw: string;
  timestamp: number;

  IRCCommand: string;
  IRCParameters: object;
  IRCMessageParts: string[];
  IRCMessagePrefix: string;

  badgeInfo: string;
  badges: object;
  badgesRaw: string;

  senderUserName: string | undefined;
  senderDisplayName: string | undefined;
  senderUserType: string | undefined;
  senderUserColor: string | undefined;

  channelNameRaw: string | undefined;
  channelName: string | undefined;

  emoteSets: string[];
  emoteSetsRaw: string;

  isMod: boolean;
  isModRaw: string;

  isSubscriber: boolean;
  isSubscriberRaw: string;

  turbo: boolean;
  turboRaw: string;

  messageID: string | undefined;

  constructor(sym: string, rawMessage: string) {
    const dn = Date.now();
    this.timestamp = dn;
    this.sym = sym;
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
    this.channelName = i.utils.cleanChannelName(this.channelNameRaw);

    this.emoteSetsRaw = this.IRCParameters["emote-sets"];
    this.emoteSets = messageEmoteSets(this.emoteSetsRaw);

    this.isModRaw = this.IRCParameters["mod"];
    this.isMod = this.isModRaw === "1";

    this.isSubscriberRaw = this.IRCParameters["subscriber"];
    this.isSubscriber = this.isSubscriberRaw === "1";

    this.turboRaw = this.IRCParameters["turbo"];
    this.turbo = this.turboRaw === "1";

    this.messageID = this.IRCParameters["id"] ?? undefined;
  }
}
