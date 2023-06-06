import { messageEmotesReturn } from "oberknecht-utils";
import { whisperMessage } from "../WHISPER.Message";

export class message {
    _inp: whisperMessage;

    messageText: string;
    id: string;
    threadID: string;
    type: string;
    emotes: messageEmotesReturn;
    emotesRaw: string;
    emotecount: number;

    constructor(inp: whisperMessage) {
        this._inp = inp;

        this.messageText = inp.messageText;
        this.id = inp.messageID;
        this.threadID = inp.threadID;
        this.type = inp.IRCCommand;
        this.emotes = inp.emotes;
        this.emotesRaw = inp.emotesRaw;
        this.emotecount = Object.keys(inp.emotes).length;
    };
};