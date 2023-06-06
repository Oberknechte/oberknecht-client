import { messageEmotesReturn } from "oberknecht-utils";
import { whisperMessage } from "../WHISPER.Message";
export declare class message {
    _inp: whisperMessage;
    messageText: string;
    id: string;
    threadID: string;
    type: string;
    emotes: messageEmotesReturn;
    emotesRaw: string;
    emotecount: number;
    constructor(inp: whisperMessage);
}
