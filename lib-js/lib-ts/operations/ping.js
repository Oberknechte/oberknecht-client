"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.ping = void 0;
let __1 = require("..");
async function ping(sym, wsnum) {
    return new Promise((resolve, reject) => {
        let pingstart = Date.now();
        __1.i.emitTwitchAction(sym, wsnum, "PING")
            .then(() => {
            return resolve(Date.now() - pingstart);
        })
            .catch(reject);
    });
}
exports.ping = ping;
;
