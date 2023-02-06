/**
 * @param {Symbol} sym
 * @param {string} msg 
 */

async function sendraw(sym, msg){
    if(!msg) return;
    let i = require("../index");

    return i.emitTwitchAction(sym, "RAW", "", "", msg);
};

module.exports = sendraw;