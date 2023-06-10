import { whisperMessage } from "../WHISPER.Message";

export class server {
  _inp: whisperMessage;

  IRCParameters: object;

  constructor(inp: whisperMessage) {
    this._inp = inp;

    this.IRCParameters = inp.IRCParameters;
  }
}
