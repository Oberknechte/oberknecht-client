"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.sendraw = void 0;
const __1 = require("..");
async function sendraw(sym, msg, wsnum) {
    return new Promise((resolve, reject) => {
        if (!(msg ?? undefined))
            return reject(Error("msg is undefined"));
        return __1.i.emitTwitchAction(sym, wsnum, "RAW", "", "", msg);
    });
}
exports.sendraw = sendraw;
;
