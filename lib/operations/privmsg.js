/** @param {Symbol} sym @param {string} channel @param {string} message */
async function privmsg(sym, channel, message) {
    if(!(channel ?? undefined) || !(message ?? undefined)) return new Promise((r, reject) => {return reject(`channel or message is undefined`)});
    
    let i = require("../index");

    channel = i.utils.correctChannelName(channel);

    return i.emitTwitchAction(sym, "PRIVMSG", `${channel} :${message}`);
};

module.exports = privmsg;