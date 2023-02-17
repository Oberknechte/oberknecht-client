const twitchAction = require("../handlers/twitchAction");

/** @param {Symbol} sym @param {string} channel */
async function join(sym, channel){
    if(!(channel ?? undefined)) return;
    let i = require("../index");
    
    channel = i.utils.correctChannelName(channel);

    return twitchAction.join(sym, channel);
};

module.exports = join;