/** @param {Symbol} sym @param {string} channel  @param {string} message */
async function action(sym, channel, message) {
    if(!(channel ?? undefined) || !(message ?? undefined)) return new Promise((r, reject) => {return reject(`channel or message is undefined`)});
    
    let i = require("../index");

    channel = i.utils.correctChannelName(channel);

    return i.emitTwitchAction(sym, "PRIVMSG", `${channel} :\u0001ACTION ${message}\u0001`);
};

module.exports = action;