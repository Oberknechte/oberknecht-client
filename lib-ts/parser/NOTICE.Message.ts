import {
  messageCommand,
  messageContent,
  messageParameters,
  cleanChannelName,
} from "oberknecht-utils";

export class noticeMessage {
  sym;
  timestamp: number;
  _raw: string;

  IRCCommand: string;
  IRCParameters: object;
  IRCMessageParts: string[];

  msgID: string;
  messageText: string;
  targetUserID: string | undefined;

  channelName: string;

  serverTimestamp: Date;
  serverTimestampRaw: number;
  serverDelay: number;

  constructor(sym: string, rawMessage: string) {
    const dn = Date.now();
    this.timestamp = dn;
    this.sym = sym;
    this._raw = rawMessage;

    this.IRCCommand = messageCommand(rawMessage);
    this.IRCMessageParts = [
      ...this._raw.split(" ").slice(0, 4),
      messageContent(this._raw),
    ];
    this.IRCParameters = messageParameters(this._raw);

    this.msgID = this.IRCParameters["msg-id"];
    this.messageText = this.IRCMessageParts[4]?.substring(1) ?? undefined;
    this.targetUserID = this.IRCParameters["target-user-id"] ?? undefined;

    this.channelName = cleanChannelName(this.IRCMessageParts[3]) ?? undefined;

    this.serverTimestampRaw = parseInt(this.IRCParameters["tmi-sent-ts"]);
    this.serverTimestamp = new Date(this.serverTimestampRaw);
    this.serverDelay = dn - this.serverTimestampRaw;
  }
}
