import { messageEmotesReturn } from "oberknecht-utils";
import { privmsgMessage } from "../PRIVMSG.Message";
import { i } from "../..";

export class message {
  _inp: privmsgMessage;

  messageText: string;
  isAction: boolean;
  isCheer: boolean;
  isReply: boolean;
  id: string;
  bits: number;
  type: string;
  emotes: messageEmotesReturn;
  emotesRaw: string;
  emotecount: number;
  timestamp: Date;
  timestampRaw: number;

  constructor(inp: privmsgMessage) {
    this._inp = inp;

    this.messageText = inp.messageText;
    this.isAction = inp.isAction;
    this.isCheer = inp.isCheer;
    this.isReply = inp.isReply;
    this.id = inp.messageID;
    this.bits = inp.bits;
    this.type = inp.IRCCommand;
    this.emotes = inp.emotes;
    this.emotesRaw = inp.emotesRaw;
    this.emotecount = this.emotes.length;
    this.timestamp = inp.serverTimestamp;
    this.timestampRaw = inp.serverTimestampRaw;
  }

  async delete() {
    return i.OberknechtAPI[this._inp.sym].deleteMessage(
      this._inp.channelID,
      this._inp.messageID
    );
  }
}
