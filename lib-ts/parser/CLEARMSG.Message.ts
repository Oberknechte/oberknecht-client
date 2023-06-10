import {
  messageCommand,
  messageContent,
  messageParameters,
  messagePrefix,
  cleanChannelName,
} from "oberknecht-utils";

export class clearmsgMessage {
  sym;
  _raw: string;
  timestamp: number;

  IRCCommand: string;
  IRCParameters: object;
  IRCMessageParts: string[];
  IRCMessagePrefix: string;

  moderatorLogin: string;

  targetUserName: string;
  targetMessageID: string;
  targetMessageText: string;

  channelName: string | undefined;
  channelID: string | undefined;

  serverTimestamp: Date;
  serverTimestampRaw: number;
  serverDelay: number;

  constructor(sym: string, rawMessage: string) {
    const dn = Date.now();
    this.timestamp = dn;
    this.sym = sym;
    this._raw = rawMessage;

    this.IRCCommand = messageCommand(rawMessage);
    this.IRCParameters = messageParameters(this._raw);
    this.IRCMessageParts = [
      ...this._raw.split(" ").slice(0, 4),
      messageContent(this._raw),
    ];
    this.IRCMessagePrefix = messagePrefix(this._raw);

    this.targetMessageID = this.IRCParameters["target-msg-id"];
    this.targetUserName = this.IRCParameters["login"];
    this.targetMessageText = this.IRCMessageParts[4];

    this.channelName = cleanChannelName(this.IRCMessageParts[3]);
    this.channelID = this.IRCParameters["room-id"] ?? undefined;

    this.serverTimestampRaw = parseInt(this.IRCParameters["tmi-sent-ts"]);
    this.serverTimestamp = new Date(this.serverTimestampRaw);
    this.serverDelay = dn - this.serverTimestampRaw;
  }
}
