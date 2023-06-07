"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.channel = void 0;
let __1 = require("../..");
class channel {
    _inp;
    name;
    id;
    constructor(inp) {
        this._inp = inp;
        this.name = inp.channelName;
        this.id = inp.channelID;
    }
    ;
    async slow(wait_time) { return __1.i.OberknechtAPI[this._inp.sym].slow(this._inp.channelID, wait_time); }
    ;
    async slowOff() { return __1.i.OberknechtAPI[this._inp.sym].slowOff(this._inp.channelID); }
    ;
    async followers(duration) { return __1.i.OberknechtAPI[this._inp.sym].followers(this._inp.channelID, duration); }
    ;
    async followersOff() { return __1.i.OberknechtAPI[this._inp.sym].followersOff(this._inp.channelID); }
    ;
    async subscribers() { return __1.i.OberknechtAPI[this._inp.sym].subscribers(this._inp.channelID); }
    ;
    async subscribersOff() { return __1.i.OberknechtAPI[this._inp.sym].subscribersOff(this._inp.channelID); }
    ;
    async emoteOnly() { return __1.i.OberknechtAPI[this._inp.sym].emote(this._inp.channelID); }
    ;
    async emoteOnlyOff() { return __1.i.OberknechtAPI[this._inp.sym].emoteOff(this._inp.channelID); }
    ;
    async r9k() { return __1.i.OberknechtAPI[this._inp.sym].r9k(this._inp.channelID); }
    ;
    async r9kOff() { return __1.i.OberknechtAPI[this._inp.sym].r9kOff(this._inp.channelID); }
    ;
    async chatdelay(duration) { return __1.i.OberknechtAPI[this._inp.sym].chatdelay(this._inp.channelID, duration); }
    ;
    async chatdelayOff() { return __1.i.OberknechtAPI[this._inp.sym].chatdelayOff(this._inp.channelID); }
    ;
    async shoutout(target_channel_id) { return __1.i.OberknechtAPI[this._inp.sym].shoutout(this._inp.channelID, target_channel_id); }
    ;
    async announce(message, color) { return __1.i.OberknechtAPI[this._inp.sym].announce(this._inp.channelID, message, color); }
    ;
    async raid(to_broadcaster_id) { return __1.i.OberknechtAPI[this._inp.sym].raid(this._inp.channelID, to_broadcaster_id); }
    ;
    async unraid() { return __1.i.OberknechtAPI[this._inp.sym].unraid(this._inp.channelID); }
    ;
}
exports.channel = channel;
;
