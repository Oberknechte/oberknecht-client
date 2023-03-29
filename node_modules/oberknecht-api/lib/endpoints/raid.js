const request = require("request");
const i = require("..");
const _getuser = require("../operations/_getuser");
const urls = require("../variables/urls");
const _validatetoken = require("./_validatetoken");

/** @param {Symbol} sym @param {string} from_broadcaster_id @param {string} to_broadcaster_id @param {string?} customtoken */
async function raid(sym, from_broadcaster_id, to_broadcaster_id, customtoken) {
    return new Promise(async (resolve, reject) => {
        if ((!(sym ?? undefined) && !(customtoken ?? undefined)) || !(from_broadcaster_id ?? undefined) || !(to_broadcaster_id ?? undefined)) return reject(Error(`sym and customtoken, from_broadcaster_id or to_broadcaster_id is undefined`));

        let clientid = i.apiclientData[sym]?._options?.clientid;

        if ((customtoken ?? undefined)) {
            await _validatetoken(undefined, customtoken)
                .then(a => {
                    clientid = a.client_id;
                    userid = a.user_id;
                })
                .catch();
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

        request(`${urls._url("twitch", "raid")}?from_broadcaster_id=${from_broadcaster_id}&to_broadcaster_id=${to_broadcaster_id}`, { method: urls.twitch.raid.method, headers: urls.twitch._headers(sym, customtoken, clientid) }, (e, r) => {
            if (e || r.statusCode !== urls._code("twitch", "raid")) return reject(Error(e ?? r.body));

            let dat = JSON.parse(r.body);
            return resolve(dat);
        });
    });
};

module.exports = raid;