"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.channel = void 0;
class channel {
    _inp;
    name;
    id;
    constructor(inp) {
        this._inp = inp;
        this.name = inp.senderUserName;
        this.id = inp.threadID;
    }
    ;
}
exports.channel = channel;
;
