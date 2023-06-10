"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.channel = void 0;
class channel {
    _inp;
    name;
    id;
    slow;
    slowOff;
    followers;
    followersOff;
    subscribers;
    subscribersOff;
    emoteOnly;
    emoteOnlyOff;
    r9k;
    r9kOff;
    chatdelay;
    chatdelayOff;
    announce;
    constructor(inp) {
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
    }
}
exports.channel = channel;
