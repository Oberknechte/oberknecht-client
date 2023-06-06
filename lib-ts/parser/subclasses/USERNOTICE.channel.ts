import { usernoticeMessage } from "../USERNOTICE.Message";

export class channel {
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

    constructor(inp: usernoticeMessage) {
        this._inp = inp;

        this.name = inp.channelName;
        this.id = inp.channelID;

        this.slow = inp.slow;
        this.slowOff = inp.slowOff;
        this.followers = inp.followers;
        this.followersOff = inp.followersOff;
        this.subscribers = inp.subscribers;
        this.subscribersOff = inp.subscribersOff;
        this.emoteOnly = inp.emoteOnly;
        this.emoteOnlyOff = inp.emoteOnlyOff;
        this.r9k = inp.r9k;
        this.r9kOff = inp.r9kOff;
        this.chatdelay = inp.chatdelay;
        this.chatdelayOff = inp.chatdelayOff;
        this.announce = inp.announce;
    };
};