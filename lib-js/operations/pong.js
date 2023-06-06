"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.pong = void 0;
const __1 = require("..");
async function pong(sym, wsnum) {
    return __1.i.emitTwitchAction(sym, wsnum, "PONG");
}
exports.pong = pong;
;
