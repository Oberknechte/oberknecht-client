const request = require("request");
const i = require("..");
const _getuser = require("../operations/_getuser");
const urls = require("../variables/urls");
const _validatetoken = require("./_validatetoken");

/** @param {Symbol} sym @param {string} broadcaster_id @param {string?} customtoken */
async function cancelraid(sym, broadcaster_id, customtoken) {
    return new Promise(async (resolve, reject) => {
        if ((!(sym ?? undefined) && !(customtoken ?? undefined)) || !(broadcaster_id ?? undefined)) return reject(Error(`sym and customtoken or broadcaster_id is undefined`));

        let clientid = i.apiclientData[sym]?._options?.clientid;

        if ((customtoken ?? undefined)) {
            await _validatetoken(undefined, customtoken)
                .then(a => {
                    clientid = a.client_id;
                    userid = a.user_id;
                })
                .catch();
        };

        if (!i.regex.numregex().test(broadcaster_id) && i.regex.twitch.usernamereg().test(broadcaster_id)) {
            await _getuser(sym, broadcaster_id)
                .then(u => {
                    broadcaster_id = u[1];
                })
                .catch();
        };

        request(`${urls._url("twitch", "cancelraid")}?broadcaster_id=${broadcaster_id}`, { method: urls.twitch.cancelraid.method, headers: urls.twitch._headers(sym, customtoken, clientid) }, (e, r) => {
            if (e || r.statusCode !== urls._code("twitch", "cancelraid")) return reject(Error(e ?? r.body));

            return resolve();
        });
    });
};

module.exports = cancelraid;