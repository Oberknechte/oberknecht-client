import { colorsType } from "oberknecht-api/lib-ts/types/endpoints/color";
import { privmsgMessage } from "../PRIVMSG.Message";
export declare class channel {
    _inp: privmsgMessage;
    name: string;
    id: string;
    constructor(inp: privmsgMessage);
    slow(wait_time: number): Promise<any>;
    slowOff(): Promise<any>;
    followers(duration?: number): Promise<any>;
    followersOff(): Promise<any>;
    subscribers(): Promise<any>;
    subscribersOff(): Promise<any>;
    emoteOnly(): Promise<any>;
    emoteOnlyOff(): Promise<any>;
    r9k(): Promise<any>;
    r9kOff(): Promise<any>;
    chatdelay(duration: number): Promise<any>;
    chatdelayOff(): Promise<any>;
    shoutout(target_channel_id: string): Promise<any>;
    announce(message: string, color?: colorsType): Promise<any>;
    raid(to_broadcaster_id: string): Promise<any>;
    unraid(): Promise<any>;
}
