"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports._getclientid = void 0;
let __1 = require("..");
async function _getclientid(sym, customtoken) {
    return new Promise((resolve, reject) => {
        if (!(sym ?? undefined) || !(customtoken ?? undefined))
            return reject(Error("sym or customtoken is undefined"));
        __1.i.OberknechtAPI[sym]._validatetoken(customtoken)
            .then(dat => {
            if (dat.client_id && __1.i.clientData[sym]) {
                __1.i.clientData[sym]._options = {
                    ...__1.i.clientData[sym]._options,
                    clientid: dat.client_id,
                    userid: dat.user_id,
                    username: dat.login,
                    token_scopes: dat.scopes
                };
            }
            ;
            resolve(dat.client_id);
        })
            .catch(reject);
    });
}
exports._getclientid = _getclientid;
;
