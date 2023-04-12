/** @param {Symbol} sym @param {string} msg */
async function sendraw(sym, msg, wsnum) {
    if (!(msg ?? undefined)) return;

    let i = require("../index");

    return i.emitTwitchAction(sym, (wsnum ?? undefined), "RAW", "", "", msg);
};

module.exports = sendraw;