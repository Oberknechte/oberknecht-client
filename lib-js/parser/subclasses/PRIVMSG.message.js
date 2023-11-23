"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.message = void 0;
const __1 = require("../..");
class message {
    _inp;
    messageText;
    isAction;
    isCheer;
    isReply;
    id;
    bits;
    type;
    emotes;
    emotesRaw;
    emotecount;
    timestamp;
    timestampRaw;
    constructor(inp) {
        this._inp = inp;
        this.messageText = inp.messageText;
        this.isAction = inp.isAction;
        this.isCheer = inp.isCheer;
        this.isReply = inp.isReply;
        this.id = inp.messageID;
        this.bits = inp.bits;
        this.type = inp.IRCCommand;
        this.emotes = inp.emotes;
        this.emotesRaw = inp.emotesRaw;
        this.emotecount = this.emotes.length;
        this.timestamp = inp.serverTimestamp;
        this.timestampRaw = inp.serverTimestampRaw;
    }
    async delete() {
        return __1.i.OberknechtAPI[this._inp.sym].deleteMessage(this._inp.channelID, this._inp.messageID);
    }
}
exports.message = message;
