/** @param {Symbol} sym @param {string} user */
async function getuser(sym, user) {
    return new Promise((resolve, reject) => {
        let i = require("../index");

        if (!(sym ?? undefined) || !(user ?? undefined)) return reject(Error("No sym or user defined"))

        i.OberknechtAPI[sym].getUsers([user])
            .then((u) => {
                if (Object.keys(u?.logins)?.length == 0) return reject(Error("API didn't return any data on user"));

                let ch = u?.details[Object.keys(u?.details)[Object.keys(u?.details).length - 1]];
                return resolve(ch);
            })
            .catch(e => {
                return reject(Error(e));
            });
    });
};

module.exports = getuser;