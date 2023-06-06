import { BadgesMap } from "oberknecht-utils";
import { usernoticeMessage } from "../USERNOTICE.Message";
export declare class userstate {
    _inp: usernoticeMessage;
    username: string;
    displayName: string;
    color: string;
    isMod: boolean;
    subscriber: boolean;
    userType: string;
    badgeInfo: string;
    badges: BadgesMap;
    badgesRaw: string;
    id: string;
    ban: Function;
    unban: Function;
    timeout: Function;
    untimeout: Function;
    shoutout: Function;
    constructor(inp: usernoticeMessage);
}
