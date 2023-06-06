import { BadgesMap } from "oberknecht-utils";
import { whisperMessage } from "../WHISPER.Message";
export declare class userstate {
    _inp: whisperMessage;
    username: string;
    displayName: string;
    color: string;
    turbo: boolean;
    userType: string;
    badges: BadgesMap;
    badgesRaw: string;
    id: string;
    constructor(inp: whisperMessage);
}
