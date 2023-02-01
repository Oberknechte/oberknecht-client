/**
 * @param {String} msg 
 */

async function sendraw(msg){
    if(!msg) return;
    let i = require("../index");

    return i.emitTwitchAction("RAW", "", "", msg);
};

module.exports = sendraw;