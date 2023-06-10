import { whisperMessage } from "../WHISPER.Message";

export class channel {
  _inp: whisperMessage;

  name: string;
  id: string;

  constructor(inp: whisperMessage) {
    this._inp = inp;

    this.name = inp.senderUserName;
    this.id = inp.threadID;
  }
}
