"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.userstate = void 0;
class userstate {
    _inp;
    username;
    displayName;
    color;
    turbo;
    userType;
    badges;
    badgesRaw;
    id;
    constructor(inp) {
        this._inp = inp;
        this.username = inp.senderUserName;
        this.displayName = inp.senderDisplayName;
        this.color = inp.senderUserColor;
        this.turbo = inp.turbo;
        this.userType = inp.senderUserType;
        this.badges = inp.badges;
        this.badgesRaw = inp.badgesRaw;
        this.id = inp.senderUserID;
    }
    ;
}
exports.userstate = userstate;
;
