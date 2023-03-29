let i = require("../index");
const getusers = require("../endpoints/getUsers");

/**
 * @param {Symbol} sym 
 * @param {string} user 
 */
async function _getuser(sym, user) {
    return new Promise((resolve, reject) => {
        if (!(sym ?? undefined) || !(user ?? undefined)) return reject(Error("no sym or users defined"))
        if (!i.apiclientData[sym].cache) i.apiclientData[sym].cache = {};
        if (!i.apiclientData[sym].cache.twitch) i.apiclientData[sym].cache.twitch = {};
        if (!i.apiclientData[sym].cache.twitch.userids) i.apiclientData[sym].cache.twitch.userids = { logins: {}, ids: {} };

        let clientDataCacheTwitchUserids = i.apiclientData[sym].cache.twitch.userids;
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

module.exports = _getuser;