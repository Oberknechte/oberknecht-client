/**
 * @param {Symbol} sym 
 */
async function pong(sym){
    let i = require("../index");

    return i.emitTwitchAction(sym, "PONG");
};

module.exports = pong;