"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.server = void 0;
class server {
    _inp;
    timestamp;
    timestampRaw;
    IRCParameters;
    constructor(inp) {
        this._inp = inp;
        this.timestamp = inp.serverTimestamp;
        this.timestampRaw = inp.serverTimestampRaw;
        this.IRCParameters = inp.IRCParameters;
    }
}
exports.server = server;
