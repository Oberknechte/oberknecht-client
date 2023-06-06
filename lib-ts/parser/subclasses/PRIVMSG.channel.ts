import { colorsType } from "oberknecht-api/lib-ts/types/endpoints/color";
import { i } from "../..";
import { privmsgMessage } from "../PRIVMSG.Message";

export class channel {
    _inp: privmsgMessage;
    name: string;
    id: string;

    constructor(inp: privmsgMessage) {
        this._inp = inp;

        this.name = inp.channelName;
        this.id = inp.channelID;
    };

    async slow(wait_time: number) { return i.OberknechtAPI[this._inp.sym].slow(this._inp.channelID, wait_time) };
    async slowOff() { return i.OberknechtAPI[this._inp.sym].slowOff(this._inp.channelID) };
    async followers(duration?: number) { return i.OberknechtAPI[this._inp.sym].followers(this._inp.channelID, duration) };
    async followersOff() { return i.OberknechtAPI[this._inp.sym].followersOff(this._inp.channelID) };
    async subscribers() { return i.OberknechtAPI[this._inp.sym].subscribers(this._inp.channelID) };
    async subscribersOff() { return i.OberknechtAPI[this._inp.sym].subscribersOff(this._inp.channelID) };
    async emoteOnly() { return i.OberknechtAPI[this._inp.sym].emote(this._inp.channelID) };
    async emoteOnlyOff() { return i.OberknechtAPI[this._inp.sym].emoteOff(this._inp.channelID) };
    async r9k() { return i.OberknechtAPI[this._inp.sym].r9k(this._inp.channelID) };
    async r9kOff() { return i.OberknechtAPI[this._inp.sym].r9kOff(this._inp.channelID) };
    async chatdelay(duration: number) { return i.OberknechtAPI[this._inp.sym].chatdelay(this._inp.channelID, duration) };
    async chatdelayOff() { return i.OberknechtAPI[this._inp.sym].chatdelayOff(this._inp.channelID) };
    async shoutout(target_channel_id: string) { return i.OberknechtAPI[this._inp.sym].shoutout(this._inp.channelID, target_channel_id) };
    async announce(message: string, color?: colorsType) { return i.OberknechtAPI[this._inp.sym].announce(this._inp.channelID, message, color) };
    async raid(to_broadcaster_id: string) { return i.OberknechtAPI[this._inp.sym].raid(this._inp.channelID, to_broadcaster_id) };
    async unraid() { return i.OberknechtAPI[this._inp.sym].unraid(this._inp.channelID) };
};