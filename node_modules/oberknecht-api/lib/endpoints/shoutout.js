const request = require("request");
const i = require("../index");
const _joinurlquery = require("../functions/_joinurlquery");
const urls = require("../variables/urls");
const _getuser = require("../operations/_getuser");
const _validatetoken = require("./_validatetoken");

/** @param {Symbol} sym @param {string} from_broadcaster_id @param {string} to_broadcaster_id @param {string?} customtoken */
async function shoutout(sym, from_broadcaster_id, to_broadcaster_id, customtoken) {
    return new Promise(async (resolve, reject) => {
        if (!(from_broadcaster_id ?? undefined) || !(to_broadcaster_id ?? undefined)) return reject(Error(`from_broadcaster_id and/or to_broadcaster_id is undefined`));

        let moderator_id = i.api[sym]?._options?.userid;
        let clientid = i.apiclientData[sym]?._options?.clientid;
        if ((customtoken ?? undefined)) {
            await _validatetoken(undefined, customtoken)
                .then(a => {
                    moderator_id = a.user_id;
                    clientid = a.client_id;
                })
                .catch(e => {
                    if (!sym) return reject(e);
                    moderator_id = i.apiclientData[sym]._options.userid;
                    clientid = i.apiclientData[sym]._options.clientid;
                });
        };

        if (!i.regex.numregex().test(from_broadcaster_id) && i.regex.twitch.usernamereg().test(from_broadcaster_id)) {
            await _getuser(sym, from_broadcaster_id)
                .then(u => {
                    from_broadcaster_id = u[1];
                })
                .catch();
        };

        if (!i.regex.numregex().test(to_broadcaster_id) && i.regex.twitch.usernamereg().test(to_broadcaster_id)) {
            await _getuser(sym, to_broadcaster_id)
                .then(u => {
                    to_broadcaster_id = u[1];
                })
                .catch();
        };

        request(`${urls._url("twitch", "shoutouts")}${_joinurlquery(["moderator_id", "from_broadcaster_id", "to_broadcaster_id"], [moderator_id, from_broadcaster_id, to_broadcaster_id], true)}`, { headers: urls.twitch._headers(sym, customtoken, clientid), method: urls.twitch.shoutouts.method }, (e, r) => {
            if (e || (r.statusCode !== urls._code("twitch", "shoutouts"))) return reject(Error(e ?? r.body));

            return resolve();
        });
    });
};

module.exports = shoutout;