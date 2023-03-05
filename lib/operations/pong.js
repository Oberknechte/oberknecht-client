/** @param {Symbol} sym */
async function pong(sym, wsnum) {
    let i = require("../index");

    return i.emitTwitchAction(sym, (wsnum ?? undefined), "PONG");
};

module.exports = pong;