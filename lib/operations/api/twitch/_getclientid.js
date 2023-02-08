let i = require("../../..");
const _validatetoken = require("./_validatetoken");

/**
 * @param {Symbol} sym 
 * @param {string} customtoken 
 */
function _getclientid(sym, customtoken){
    return new Promise((resolve, reject) => {
        if(!(sym ?? undefined) || !(customtoken ?? undefined)) return reject(Error("sym or customtoken is undefined"));

        _validatetoken(sym, customtoken)
        .then(dat => {
            if(dat.client_id && i.clientData[sym]) {
                i.clientData[sym]._options = {
                    ...i.clientData[sym]._options, 
                    clientid: dat.client_id,
                    userid: dat.user_id,
                    username: dat.login,
                    token_scopes: dat.scopes
                };
            };
            resolve(dat.client_id);
        })
        .catch(reject);
    });
};

module.exports = _getclientid;