const request = require("request");
const i = require("../index");

/** @param {Symbol} sym @param {string} customtoken */
async function _validatetoken(sym, customtoken) {
    return new Promise((resolve, reject) => {
        if(!customtoken) {
            customtoken = sym;
            sym = undefined;
        };
        request(`https://id.twitch.tv/oauth2/validate`, {
            headers: {
                "Content-Type": "application/json",
                "Authorization": `OAuth ${customtoken ?? i.apiclientData[sym]?._options?.token}`
            }
        }, (e, r) => {
            if(e || r.statusCode !== 200) return reject(Error(e ?? r.body));

            let dat = JSON.parse(r.body);
            return resolve(dat);
        });
    });
};

module.exports = _validatetoken;