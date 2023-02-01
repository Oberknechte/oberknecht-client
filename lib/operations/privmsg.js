/**
 * @param {String} channel 
 * @param {String} message 
*/
async function privmsg(channel, message) {
    if(!(channel ?? undefined) || !(message ?? undefined)) return new Promise((r, reject) => {return reject(`channel or message is undefined`)});
    let i = require("../index");

    channel = i.utils.correctChannelName(channel);

    return i.emitTwitchAction("PRIVMSG", `${channel} :${message}`);
};

module.exports = privmsg;