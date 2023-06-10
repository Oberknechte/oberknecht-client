"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.message = void 0;
class message {
    _inp;
    messageText;
    id;
    threadID;
    type;
    emotes;
    emotesRaw;
    emotecount;
    constructor(inp) {
        this._inp = inp;
        this.messageText = inp.messageText;
        this.id = inp.messageID;
        this.threadID = inp.threadID;
        this.type = inp.IRCCommand;
        this.emotes = inp.emotes;
        this.emotesRaw = inp.emotesRaw;
        this.emotecount = Object.keys(inp.emotes).length;
    }
}
exports.message = message;
