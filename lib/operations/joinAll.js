/**
 * @param {Array | String} channels 
 */
function joinAll(channels){
    if(!channels) return;
    let i = require("../index");
    if(Array.isArray(channels)) channels = channels.map(a => {return i.utils.correctChannelName(a)});

    return new Promise(async (resolve, reject) => {
        await Promise.all([...channels].map(async (v) => {
            return i.emitTwitchAction("JOIN", v);
        }))
        .then(joinchans => {
            joinchans.forEach(v => {
                if(!i.clientData.channels.includes(v)){i.clientData.channels.push(v)};
            })
            resolve(joinchans);
        })
        .catch(reject);
    });
};

module.exports = joinAll;