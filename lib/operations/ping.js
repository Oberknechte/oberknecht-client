/**
 * @param {Symbol} sym 
 */
async function ping(sym){
    let i = require("../index");
    let pingstart = Date.now();
    return new Promise((resolve, reject) => {
        i.emitTwitchAction(sym, "PING")
        .then(() => {
            return resolve(Date.now()-pingstart);
        })
        .catch(reject);
    })
};

module.exports = ping;