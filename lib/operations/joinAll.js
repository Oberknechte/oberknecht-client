const twitchAction = require("../handlers/twitchAction");

/** @param {Symbol} sym @param {Array | string} channels */
function joinAll(sym, channels) {
    return new Promise(async (resolve, reject) => {
        if (!(channels ?? undefined)) return;
        const i = require("../index");

        if (Array.isArray(channels)) channels = channels.map(a => i.utils.correctChannelName(a));

        await Promise.all([...channels].map(async (v) => {
            return new Promise((resolve) => {
                twitchAction.join(sym, v)
                    .then(() => {
                        return resolve(v);
                    });
            });
        }))
            .then(joinchans => {
                resolve(joinchans);
            })
            .catch(reject);
    });
};

module.exports = joinAll;