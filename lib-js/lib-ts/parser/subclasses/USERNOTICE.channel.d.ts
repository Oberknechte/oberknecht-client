import { usernoticeMessage } from "../USERNOTICE.Message";
export declare class channel {
    _inp: usernoticeMessage;
    name: string;
    id: string;
    slow: Function;
    slowOff: Function;
    followers: Function;
    followersOff: Function;
    subscribers: Function;
    subscribersOff: Function;
    emoteOnly: Function;
    emoteOnlyOff: Function;
    r9k: Function;
    r9kOff: Function;
    chatdelay: Function;
    chatdelayOff: Function;
    announce: Function;
    constructor(inp: usernoticeMessage);
}
