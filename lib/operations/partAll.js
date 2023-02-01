/**
 * @param {Array | String} channels 
 */
async function partAll(channels){
    if(!channels) return;
    let i = require("../index");
    if(Array.isArray(channels)) channels = channels.map(a => {return i.utils.correctChannelName(a)});

    return Promise.all([...channels].forEach(async (v, i) => {
        return await i.emitTwitchAction("PART", v);
    }));
};

module.exports = partAll;