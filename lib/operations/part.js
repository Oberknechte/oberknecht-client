/**
 * @param {String} channel 
 */
async function part(channel){
    if(!channel) return;
    let i = require("../index");
    channel = i.utils.correctChannelName(channel);

    return i.emitTwitchAction("PART", channel)
    .then(() => {
        i.clientData.channels.splice(i.clientData.channels.indexOf(channel), 1);
    });
};

module.exports = part;