import { privmsgMessage } from "../PRIVMSG.Message";

export class server {
  _inp: privmsgMessage;

  timestamp: Date;
  timestampRaw: number;
  IRCParameters: object;

  constructor(inp: privmsgMessage) {
    this._inp = inp;

    this.timestamp = inp.serverTimestamp;
    this.timestampRaw = inp.serverTimestampRaw;
    this.IRCParameters = inp.IRCParameters;
  }
}
