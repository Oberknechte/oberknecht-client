/** @param {Symbol} sym @param {string} channel */
async function part(sym, channel){
    if(!(channel ?? undefined)) return;
    let i = require("../index");
    
    channel = i.utils.correctChannelName(channel);

    return new Promise((resolve, reject) => {
        i.emitTwitchAction(sym, "PART", channel)
        .then(() => {
            if(i.clientData[sym].channels?.includes(channel)) i.clientData[sym].channels.splice(i.clientData[sym].channels.indexOf(channel), 1);
            resolve(channel);
        })
        .catch(reject);
    });
};

module.exports = part;