/**
 * @param {String} channel 
 */
async function join(channel){
    if(!channel) return;
    let i = require("../index");
    channel = i.utils.correctChannelName(channel);
    
    return i.emitTwitchAction("JOIN", channel)
    .then(a => {
        if(!i.clientData.channels.includes(channel)) i.clientData.channels.push(channel);
    })
};

module.exports = join;