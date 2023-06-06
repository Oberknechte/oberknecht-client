import { messageEmotesReturn } from "oberknecht-utils";
import { privmsgMessage } from "../PRIVMSG.Message";
export declare class message {
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
    constructor(inp: privmsgMessage);
    delete(): Promise<any>;
}
