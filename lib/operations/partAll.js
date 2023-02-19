const part = require("./part");

/** @param {Symbol} sym @param {Array | string} channels */
async function partAll(sym, channels){
    if(!(channels ?? undefined)) return;
    let i = require("../index");
    
    if(Array.isArray(channels)) channels = channels.map(a => {return i.utils.correctChannelName(a)});

    return Promise.all([...channels].forEach(async (v, i) => {
        return await part(v);
    }))
    .then(parts => {
        parts.forEach(a => {
            if(i.clientData[sym].channels?.includes(a)) i.clientData[sym].channels.splice(i.clientData[sym].channels.indexOf(a), 1);
        });
    });
};

module.exports = partAll;