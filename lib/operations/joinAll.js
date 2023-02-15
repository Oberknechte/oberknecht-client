/** @param {Symbol} sym @param {Array | string} channels */
function joinAll(sym, channels){
    return new Promise(async (resolve, reject) => {
        if(!(channels ?? undefined)) return;
        let i = require("../index");
        
        if(Array.isArray(channels)) channels = channels.map(a => {return i.utils.correctChannelName(a)});

        await Promise.all([...channels].map(async (v) => {
            return i.emitTwitchAction(sym, "JOIN", v);
        }))
        .then(joinchans => {
            joinchans.forEach(v => {
                if(!i.clientData[sym].channels) i.clientData[sym].channels = [];
                if(!i.clientData[sym].channels.includes(v)){i.clientData[sym].channels.push(v)};
            })
            resolve(joinchans);
        })
        .catch(reject);
    });
};

module.exports = joinAll;