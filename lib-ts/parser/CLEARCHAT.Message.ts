import {
  messageCommand,
  messageContent,
  messageParameters,
  correctChannelName,
} from "oberknecht-utils";

export class clearchatMessage {
  sym;
  _raw: string;
  timestamp: number;

  IRCCommand: string;
  IRCParameters: object;
  IRCMessageParts: string[];

  banDuration: number | undefined;
  channelName: string;
  channelID: string;

  targetUserID: string | undefined;
  targetUserName: string | undefined;

  serverTimestamp: Date;
  serverTimestampRaw: number;
  serverDelay: number;

  constructor(sym: string, rawMessage: string) {
    const dn = Date.now();
    this.sym = sym;
    this.timestamp = dn;
    this._raw = rawMessage;

    this.IRCCommand = messageCommand(rawMessage);
    this.IRCMessageParts = [
      ...this._raw.split(" ").slice(0, 4),
      messageContent(this._raw),
    ];
    this.IRCParameters = messageParameters(this._raw);

    this.banDuration = this.IRCParameters["ban-duration"] ?? undefined;
    this.channelName = correctChannelName(this.IRCMessageParts[3]);
    this.channelID = this.IRCParameters["room-id"];

    this.targetUserID = this.IRCParameters["target-user-id"] ?? undefined;
    this.targetUserName = this.IRCMessageParts[4] ?? undefined;

    this.serverTimestampRaw = parseInt(this.IRCParameters["tmi-sent-ts"]);
    this.serverTimestamp = new Date(this.serverTimestampRaw);
    this.serverDelay = dn - this.serverTimestampRaw;
  }
}
