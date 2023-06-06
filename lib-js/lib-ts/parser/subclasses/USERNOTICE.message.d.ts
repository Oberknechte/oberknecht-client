import { messageEmotesReturn } from "oberknecht-utils";
import { usernoticeMessage } from "../USERNOTICE.Message";
export declare class message {
    _inp: usernoticeMessage;
    id: string;
    type: string;
    emotes: messageEmotesReturn;
    emotesRaw: string;
    emotecount: number;
    timestamp: Date;
    timestampRaw: number;
    delete: Function;
    constructor(inp: usernoticeMessage);
}
