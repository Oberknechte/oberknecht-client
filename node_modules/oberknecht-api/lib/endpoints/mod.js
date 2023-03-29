const request = require("request");
const i = require("../index");
const urls = require("../variables/urls");
const _getuser = require("../operations/_getuser");
const _validatetoken = require("./_validatetoken");

/** @param {Symbol} sym @param {string} broadcaster_id @param {string} user_id @param {string?} customtoken */
async function mod(sym, broadcaster_id, user_id, customtoken) {
    return new Promise(async (resolve, reject) => {
        if (!(user_id ?? undefined)) return reject(Error(`user_id is undefined`));
        broadcaster_id = broadcaster_id?.toString(); user_id = user_id.toString();

        if(!(broadcaster_id ?? undefined)) broadcaster_id = i.apiclientData[sym]?._options?.userid;
        let clientid = i.apiclientData[sym]?._options?.clientid;

        if ((customtoken ?? undefined)) {
            await _validatetoken(sym, customtoken)
                .then(a => {
                    broadcaster_id = a.user_id;
                    clientid = a.client_id;
                })
                .catch(e => {
                    if (!sym) return reject(e);
                    broadcaster_id = i.apiclientData[sym]._options.userid;
                    clientid = i.apiclientData[sym]._options.clientid;
                });
        };

        if (!i.regex.numregex().test(broadcaster_id)) {
            await _getuser(sym, broadcaster_id)
                .then(u => {
                    broadcaster_id = u[1];
                })
                .catch();
        };

        if (!i.regex.numregex().test(user_id)) {
            await _getuser(sym, user_id)
                .then(u => {
                    user_id = u[1];
                })
                .catch();
        };

        request(`${urls._url("twitch", "mod")}?broadcaster_id=${broadcaster_id}&user_id=${user_id}`, { method: urls.twitch.mod.method, headers: urls.twitch._headers(sym, customtoken, clientid) }, (e, r) => {
            if (e || (r.statusCode !== urls._code("twitch", "mod"))) return reject(Error(e ?? r.body));

            return resolve();
        });
    });
};

module.exports = mod;