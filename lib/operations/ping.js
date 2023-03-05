/** @param {Symbol} sym */
async function ping(sym, wsnum) {
    return new Promise((resolve, reject) => {
        let i = require("../index");

        let pingstart = Date.now();

        i.emitTwitchAction(sym, (wsnum ?? undefined), "PING")
            .then(() => {
                return resolve(Date.now() - pingstart);
            })
            .catch(reject);
    });
};

module.exports = ping;