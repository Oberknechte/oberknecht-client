/** @param {Symbol} sym @param {string} channel */
async function join(sym, channel){
    if(!(channel ?? undefined)) return;
    let i = require("../index");
    
    channel = i.utils.correctChannelName(channel);
    
    return i.emitTwitchAction(sym, "JOIN", channel)
    .then(a => {
        if(!i.clientData[sym].channels) i.clientData[sym].channels = [];
        if(!i.clientData[sym].channels.includes(channel)) i.clientData[sym].channels.push(channel);
    })
};

module.exports = join;