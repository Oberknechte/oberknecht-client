"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.pong = void 0;
let __1 = require("..");
async function pong(sym, wsnum) {
    return __1.i.emitTwitchAction(sym, wsnum, "PONG");
}
exports.pong = pong;
;
