"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.userstate = void 0;
class userstate {
    _inp;
    username;
    displayName;
    color;
    isMod;
    subscriber;
    userType;
    badgeInfo;
    badges;
    badgesRaw;
    id;
    ban;
    unban;
    timeout;
    untimeout;
    shoutout;
    constructor(inp) {
        this._inp = inp;
        this.username = inp.senderUserName;
        this.displayName = inp.senderDisplayName;
        this.color = inp.senderUserColor;
        this.isMod = inp.isMod;
        this.subscriber = inp.isSubscriber;
        this.userType = inp.senderUserType;
        this.badgeInfo = inp.badgeInfo;
        this.badges = inp.badges;
        this.badgesRaw = inp.badgesRaw;
        this.id = inp.senderUserID;
        this.ban = inp.ban;
        this.unban = inp.unban;
        this.timeout = inp.timeout;
        this.untimeout = inp.untimeout;
        this.shoutout = inp.shoutout;
    }
}
exports.userstate = userstate;
