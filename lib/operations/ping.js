/** @param {Symbol} sym */
async function ping(sym){
    return new Promise((resolve, reject) => {
        let i = require("../index");
        
        let pingstart = Date.now();

        i.emitTwitchAction(sym, "PING")
        .then(() => {
            return resolve(Date.now()-pingstart);
        })
        .catch(reject);
    });
};

module.exports = ping;