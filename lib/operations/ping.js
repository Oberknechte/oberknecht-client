/**
 * @param {Symbol} sym 
 */
async function ping(sym){
    let i = require("../index");

    return i.emitTwitchAction(sym, "PING");
};

module.exports = ping;