"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.getusers = void 0;
const oberknecht_utils_1 = require("oberknecht-utils");
const __1 = require("..");
async function getusers(sym, logins, ids, noautofilterids) {
    return new Promise((resolve, reject) => {
        if (!(ids ?? undefined) && !(logins ?? undefined))
            return reject(Error("No ids or users defined"));
        let users_ = (0, oberknecht_utils_1.convertToArray)(logins, false);
        let ids_ = (0, oberknecht_utils_1.convertToArray)(ids, false);
        __1.i.OberknechtAPI[sym]
            ._getUsers(users_, ids_, noautofilterids)
            .then((u) => {
            return resolve(Object.values(u.details));
        })
            .catch(reject);
    });
}
exports.getusers = getusers;
