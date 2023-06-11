import { messageEmotesReturn } from "oberknecht-utils";
import { usernoticeMessage } from "../USERNOTICE.Message";

export class message {
  _inp: usernoticeMessage;

  id: string;
  type: string;
  emotes: messageEmotesReturn;
  emotesRaw: string;
  emotecount: number;
  timestamp: Date;
  timestampRaw: number;

  delete: Function;

  constructor(inp: usernoticeMessage) {
    this._inp = inp;

    this.id = inp.messageID;
    this.type = inp.IRCCommand;
    this.emotes = inp.emotes;
    this.emotesRaw = inp.emotesRaw;
    this.emotecount = this.emotes.length;
    this.timestamp = inp.serverTimestamp;
    this.timestampRaw = inp.serverTimestampRaw;

    this.delete = inp.delete;
  }
}
