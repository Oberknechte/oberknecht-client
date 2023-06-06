"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.message = void 0;
class message {
    _inp;
    id;
    type;
    emotes;
    emotesRaw;
    emotecount;
    timestamp;
    timestampRaw;
    delete;
    constructor(inp) {
        this._inp = inp;
        this.id = inp.messageID;
        this.type = inp.IRCCommand;
        this.emotes = inp.emotes;
        this.emotesRaw = inp.emotesRaw;
        this.emotecount = Object.keys(this.emotes).length;
        this.timestamp = inp.serverTimestamp;
        this.timestampRaw = inp.serverTimestampRaw;
        this.delete = inp.delete;
    }
    ;
}
exports.message = message;
;
