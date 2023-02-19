const twitchAction = require("../handlers/twitchAction");

/** @param {Symbol} sym @param {string} channel */
async function join(sym, channel) {
    if (!(channel ?? undefined)) return;
    let i = require("../index");

    channel = i.utils.correctChannelName(channel);

    return new Promise(async (resolve, reject) => {
        await twitchAction.join(sym, channel)
            .then(() => { resolve(channel) }).catch(reject);
    });
};

module.exports = join;