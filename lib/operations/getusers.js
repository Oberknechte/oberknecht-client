const { convertToArray } = require("oberknecht-utils");

/** @param {Symbol} sym @param {Array} logins @param {Array?} ids @param {Boolean?} sendsingle @param {Boolean?} noautofilterids */
async function getusers(sym, logins, ids, sendsingle, noautofilterids) {
    return new Promise((resolve, reject) => {
        let i = require("../index");

        if (!(sym ?? undefined) || !(logins ?? undefined)) return reject(Error("No sym or user defined"));
        let users_ = convertToArray(logins);
        let ids_ = convertToArray(ids);

        i.OberknechtAPI[sym]._getUsers(users_, ids_, noautofilterids)
            .then((u) => {
                if ((sendsingle ?? undefined) && users_.length === 1) {
                    if (Object.keys(u?.logins)?.length == 0) return reject(Error("API didn't return any data on user"));

                    let ch = u?.details[Object.keys(u?.details)[Object.keys(u?.details).length - 1]];
                    return resolve(ch);
                } else {
                    return resolve(Object.values(u.details));
                };
            })
            .catch(e => {
                return reject(Error(e));
            });
    });
};

module.exports = getusers;