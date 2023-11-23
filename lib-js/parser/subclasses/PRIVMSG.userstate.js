"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.userstate = void 0;
const __1 = require("../..");
class userstate {
    _inp;
    username;
    displayName;
    color;
    isMod;
    isVip;
    subscriber;
    turbo;
    userType;
    badgeInfo;
    badges;
    badgesRaw;
    id;
    constructor(inp) {
        this._inp = inp;
        this.username = inp.senderUserName;
        this.displayName = inp.senderDisplayName;
        this.color = inp.senderUserColor;
        this.isMod = inp.isMod;
        this.isVip = inp.isVip;
        this.subscriber = inp.isSubscriber;
        this.turbo = inp.turbo;
        this.userType = inp.senderUserType;
        this.badgeInfo = inp.badgeInfo;
        this.badges = inp.badges;
        this.badgesRaw = inp.badgesRaw;
        this.id = inp.senderUserID;
    }
    async ban(reason) {
        return __1.i.OberknechtAPI[this._inp.sym].ban(this._inp.channelID, this._inp.senderUserID, reason);
    }
    async unban() {
        return __1.i.OberknechtAPI[this._inp.sym].unban(this._inp.channelID, this._inp.senderUserID);
    }
    async timeout(duration, reason) {
        return __1.i.OberknechtAPI[this._inp.sym].timeout(this._inp.channelID, this._inp.senderUserID, duration, reason);
    }
    async untimeout() {
        return __1.i.OberknechtAPI[this._inp.sym].unban(this._inp.channelID, this._inp.senderUserID);
    }
    async shoutout() {
        return __1.i.OberknechtAPI[this._inp.sym].shoutout(this._inp.channelID, this._inp.senderUserID);
    }
    async mod() {
        return __1.i.OberknechtAPI[this._inp.sym].mod(this._inp.senderUserID);
    }
    async unmod() {
        return __1.i.OberknechtAPI[this._inp.sym].unmod(this._inp.senderUserID);
    }
    async vip() {
        return __1.i.OberknechtAPI[this._inp.sym].vip(this._inp.senderUserID);
    }
    async unvip() {
        return __1.i.OberknechtAPI[this._inp.sym].unvip(this._inp.senderUserID);
    }
}
exports.userstate = userstate;
