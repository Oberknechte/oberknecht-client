let i = require("../..");
const getusers = require("./twitch/_getusers");

/**
 * @param {Symbol} sym 
 * @param {string} user 
 */
async function getuser(sym, user) {
    return new Promise((resolve, reject) => {
        if (!(sym ?? undefined) || !(user ?? undefined)) return reject(Error("no sym or users defined"))
        if (!i.clientData[sym].cache) i.clientData[sym].cache = {};
        if (!i.clientData[sym].cache.twitch) i.clientData[sym].cache.twitch = {};
        if (!i.clientData[sym].cache.twitch.userids) i.clientData[sym].cache.twitch.userids = { logins: {}, ids: {} };

        let clientDataCacheTwitchUserids = i.clientData[sym].cache.twitch.userids;
        if (clientDataCacheTwitchUserids.logins[user]) {
            return (clientDataCacheTwitchUserids.logins[user]);
        } else if (clientDataCacheTwitchUserids.ids[user]) {
            return (clientDataCacheTwitchUserids.ids[user]);
        }

        getusers(sym, (i.regex.twitch.usernamereg().test(user) ? user : undefined), (i.regex.numregex().test(user) ? user : undefined))
            .then((u) => {
                if (!u.data[0]) return reject(Error("api didn't return any data on user"));

                let ch = u.data[0];
                clientDataCacheTwitchUserids.logins[ch.login] = ch.id;
                clientDataCacheTwitchUserids.ids[ch.id] = ch.login;

                return resolve(class {
                    static _raw = ch;
                    static login = ch.login;
                    static id = ch.id;
                })
            })
            .catch(e => {
                return reject(Error(e));
            });
    });
};

module.exports = getuser;