import { privmsgMessage } from "../PRIVMSG.Message";
export declare class userstate {
    _inp: privmsgMessage;
    username: string;
    displayName: string;
    color: string;
    isMod: boolean;
    isVip: boolean;
    subscriber: boolean;
    turbo: boolean;
    userType: string;
    badgeInfo: string;
    badges: object;
    badgesRaw: string;
    id: string;
    constructor(inp: privmsgMessage);
    ban(reason: any): Promise<any>;
    unban(): Promise<any>;
    timeout(duration: any, reason: any): Promise<any>;
    untimeout(): Promise<any>;
    shoutout(): Promise<any>;
    mod(): Promise<any>;
    unmod(): Promise<any>;
    vip(): Promise<any>;
    unvip(): Promise<any>;
}
