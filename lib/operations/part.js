/** @param {Symbol} sym @param {string} channel */
async function part(sym, channel) {
    if (!(channel ?? undefined)) return;
    let i = require("../index");

    channel = i.utils.correctChannelName(channel);

    return new Promise((resolve, reject) => {
        let wsnum = i.clientData[sym].knechtSockets.channels[channel];
        i.emitTwitchAction(sym, wsnum, "PART", channel)
            .then(() => {
                if (i.clientData[sym].channels?.includes(channel)) i.clientData[sym].channels.splice(i.clientData[sym].channels.indexOf(channel), 1);
                if (i.clientData[sym].knechtSockets[wsnum].channels.includes(channel)) i.clientData[sym].knechtSockets[wsnum].channels.splice(i.clientData[sym].knechtSockets[wsnum].channels.indexOf(channel), 1);
                if (i.clientData[sym].knechtSockets.channels[channel]) delete i.clientData[sym].knechtSockets.channels[channel];
                resolve(channel);
            })
            .catch(reject);
    });
};

module.exports = part;