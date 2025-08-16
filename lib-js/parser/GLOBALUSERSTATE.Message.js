"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.globaluserstateMessage = void 0;
let oberknecht_utils_1 = require("oberknecht-utils");
class globaluserstateMessage {
    sym;
    _raw;
    timestamp;
    ircParameters;
    badgeInfo;
    badgeInfoRaw;
    badges;
    badgesRaw;
    color;
    colorRaw;
    displayName;
    emoteSets;
    emoteSetsRaw;
    turbo;
    userID;
    userIDRaw;
    userType;
    constructor(sym, rawMessage) {
        const dn = Date.now();
        this.timestamp = dn;
        this.sym = sym;
        this._raw = rawMessage;
        let ircParameters = (this.ircParameters = (0, oberknecht_utils_1.messageParameters)(rawMessage));
        this.badgeInfo = ircParameters.badgeInfo;
        this.badgeInfoRaw = ircParameters.badgeInfoRaw;
        this.badgesRaw = ircParameters.badgesRaw;
        this.badges = (0, oberknecht_utils_1.messageBadges)(this.badgesRaw);
        this.colorRaw = ircParameters.colorRaw;
        this.color = ircParameters.color;
        this.displayName = ircParameters.displayName;
        this.emoteSetsRaw = ircParameters.emoteSetsRaw;
        this.emoteSets = (0, oberknecht_utils_1.messageEmoteSets)(this.emoteSetsRaw);
        this.turbo = ircParameters.turbo === "1";
        this.userID = ircParameters.userID;
        this.userIDRaw = ircParameters.userIDRaw;
    }
}
exports.globaluserstateMessage = globaluserstateMessage;
