const request = require("request");
const urls = require("../variables/urls");
const _joinurlquery = require("../functions/_joinurlquery");
const _chunkArray = require("../functions/_chunkArray");
const _validatetoken = require("./_validatetoken");
const i = require("..");
const { cleanChannelName } = require("oberknecht-utils");
const { regex } = require("..");

/** @param {Symbol} sym @param {Array?} logins @param {Array?} ids @param {string?} customtoken */
async function getUsers(sym, logins, ids, customtoken) {
    return new Promise(async (resolve, reject) => {
        if (!(sym ?? undefined) || (!(logins ?? undefined) && !(ids ?? undefined))) return reject(Error("sym or logins and ids undefined"));

        let idsinlogins = (logins?.filter(a => regex.numregex().test(a)) ?? []);
        if (!(ids ?? undefined) && (idsinlogins.length > 0)) {
            ids = idsinlogins; idsinlogins.forEach(a => logins.splice(logins.indexOf(a)));
        };

        logins = ((logins ?? undefined) && !Array.isArray(logins) ? [logins] : logins ?? []).map(a => cleanChannelName(a));
        ids = ((ids ?? undefined) && !Array.isArray(ids) ? [ids] : ids ?? []);

        let clientid = i.apiclientData[sym]?._options?.clientid;

        if ((customtoken ?? undefined)) {
            await _validatetoken(undefined, customtoken)
                .then(a => {
                    clientid = a.client_id;
                })
                .catch();
        };

        let chunks = _chunkArray([...logins, ...ids], 100);
        let ret = {
            logins: {},
            ids: {},
            details: {}
        };

        await Promise.all(
            chunks.map(chunk => {
                let chunkLogins = chunk.filter(a => logins.includes(a));
                let chunkIDs = chunk.filter(a => ids.includes(a));
                return new Promise((resolve2, reject2) => {
                    request(`${urls._url("twitch", "users")}${_joinurlquery("login", chunkLogins, true)}${_joinurlquery("id", chunkIDs, ((logins ?? []).length == 0 ? true : false))}`, { headers: urls.twitch._headers(sym, customtoken, clientid) }, (e, r) => {
                        if (e || (r.statusCode !== 200)) return reject2(Error(e ?? r.body));

                        let dat = JSON.parse(r.body);

                        if (i.apiclientData[sym]?._options?.saveIDs) {
                            dat.data.forEach(async a => {
                                await i.apiclientData[sym].jsonsplitters.users.addKey(["logins", a.login], a.id);
                                await i.apiclientData[sym].jsonsplitters.users.addKey(["ids", a.id], a.login);

                                if (!await i.apiclientData[sym].jsonsplitters.users.getKey(["details"], true)) await i.apiclientData[sym].jsonsplitters.users.addKey(["details"], {});
                                await i.apiclientData[sym].jsonsplitters.users.addKey(["details", a.id], a);
                            });
                        };

                        dat.data.forEach(a => {
                            ret.logins[a.login] = a.id;
                            ret.ids[a.id] = a.login;
                            ret.details[a.id] = a;
                        });

                        return resolve2();
                    });
                });
            })
        )
            .then(() => {
                return resolve(ret);
            });
    });
};

module.exports = getUsers;