const request = require("request");
const i = require("../..");

/** 
 * @param {Symbol} sym 
 * @param {string} customtoken 
 */
async function _getclientid(sym, customtoken) {
    return new Promise((resolve, reject) => {
        if(!customtoken) {
            customtoken = sym;
            sym = undefined;
        };
        request(`https://id.twitch.tv/oauth2/validate`, {
            headers: {
                "Content-Type": "application/json",
                "Authorization": `OAuth ${customtoken ?? i.clientData[sym]._options.token ?? ""}`
            }
        }, (e, r) => {
            if(e || r.statusCode !== 200) return reject(e);

            let dat = JSON.parse(r.body);
            if(sym && dat.client_id) {
                i.clientData[sym]._options = {
                    ...i.clientData[sym]._options, 
                    clientid: dat.client_id,
                    userid: dat.user_id,
                    login: dat.login,
                    token_scopes: dat.scopes
                };
            };
            return resolve(dat?.client_id ?? dat);
        });
    });
};

module.exports = _getclientid;