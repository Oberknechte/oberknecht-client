const twitchAction = require("../handlers/twitchAction");

/** @param {Symbol} sym @param {string} channel @param {string} message */
async function privmsg(sym, channel, message) {
    if(!(channel ?? undefined) || !(message ?? undefined)) return new Promise((r, reject) => {return reject(`channel or message is undefined`)});
    
    let i = require("../index");

    channel = i.utils.correctChannelName(channel);

    return twitchAction.privmsg(sym, channel, message);
};

module.exports = privmsg;