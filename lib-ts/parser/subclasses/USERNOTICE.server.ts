import { usernoticeMessage } from "../USERNOTICE.Message";

export class server {
  _inp: usernoticeMessage;

  timestamp: Date;
  timestampRaw: number;
  IRCParameters: object;

  constructor(inp: usernoticeMessage) {
    this._inp = inp;

    this.timestamp = inp.serverTimestamp;
    this.timestampRaw = inp.serverTimestampRaw;
    this.IRCParameters = inp.IRCParameters;
  }
}
