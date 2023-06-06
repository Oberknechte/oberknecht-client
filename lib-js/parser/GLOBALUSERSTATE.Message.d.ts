import { BadgesMap } from "oberknecht-utils";
export declare class globaluserstateMessage {
    sym: any;
    _raw: string;
    timestamp: number;
    ircParameters: object;
    badgeInfo: string;
    badgeInfoRaw: string;
    badges: BadgesMap;
    badgesRaw: string;
    color: string;
    colorRaw: string;
    displayName: string;
    emoteSets: string[];
    emoteSetsRaw: string;
    turbo: boolean;
    userID: string;
    userIDRaw: string;
    userType: string;
    constructor(sym: string, rawMessage: string);
}
