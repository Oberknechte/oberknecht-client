"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.getuser = void 0;
let oberknecht_utils_1 = require("oberknecht-utils");
let __1 = require("..");
async function getuser(sym, logins, ids, sendsingle, noautofilterids) {
    return new Promise((resolve, reject) => {
        if (!(ids ?? undefined) && !(logins ?? undefined))
            return reject(Error("No ids or users defined"));
        let users_ = (0, oberknecht_utils_1.convertToArray)(logins, false);
        let ids_ = (0, oberknecht_utils_1.convertToArray)(ids, false);
        __1.i.OberknechtAPI[sym]._getUsers(users_, ids_, noautofilterids)
            .then((u) => {
            if (Object.keys(u?.logins)?.length == 0)
                return reject(Error("API didn't return any data on user"));
            let ch = u?.details[Object.keys(u?.details)[Object.keys(u?.details).length - 1]];
            return resolve(ch);
        })
            .catch(reject);
    });
}
exports.getuser = getuser;
;
