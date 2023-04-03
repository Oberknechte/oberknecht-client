const { convertToArray } = require("oberknecht-utils");

/** @param {Symbol} sym @param {string} user */
async function getusers(sym, users) {
    return new Promise((resolve, reject) => {
        let i = require("../index");

        if (!(sym ?? undefined) || !(users ?? undefined)) return reject(Error("No sym or user defined"));
        users = convertToArray(users);

        i.OberknechtAPI[sym].getUsers([...users])
            .then((u) => {
                if (users.length == 1) {
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