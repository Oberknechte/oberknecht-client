const request = require("request");
const i = require("../index");
const urls = require("../variables/urls");
const _getuser = require("../operations/_getuser");
const _validatetoken = require("./_validatetoken");

/** @param {Symbol} sym @param {string} broadcaster_id @param {string?} customtoken */
async function getChatSettings(sym, broadcaster_id, customtoken) {
    return new Promise(async (resolve, reject) => {
        if (!(broadcaster_id ?? undefined)) return reject(Error(`broadcaster_id and/or target_user_id is undefined`));
        broadcaster_id = broadcaster_id.toString();

        let moderator_id = i.apiclientData[sym]?._options?.userid;
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

        if (!i.regex.numregex().test(broadcaster_id)) {
            await _getuser(sym, broadcaster_id)
                .then(u => {
                    broadcaster_id = u[1];
                })
                .catch();
        };

        request(`${urls._url("twitch", "getchatsettings")}?broadcaster_id=${broadcaster_id}&moderator_id=${moderator_id}`, { headers: urls.twitch._headers(sym, customtoken, clientid) }, (e, r) => {
            if (e || (r.statusCode !== urls._code("twitch", "getchatsettings"))) return reject(Error(e ?? r.body));

            let dat = JSON.parse(r.body);
            return resolve(dat);
        });
    });
};

module.exports = getChatSettings;