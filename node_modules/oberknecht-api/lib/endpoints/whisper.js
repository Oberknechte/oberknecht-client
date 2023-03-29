const request = require("request");
const i = require("../index");
const urls = require("../variables/urls");
const _joinurlquery = require("../functions/_joinurlquery");
const _getuser = require("../operations/_getuser");
const _validatetoken = require("./_validatetoken");

/** @param {Symbol} sym @param {string} from_user_id @param {string} to_user_id @param {string} message */
async function whisper(sym, from_user_id, to_user_id, message, customtoken) {
    return new Promise(async (resolve, reject) => {
        if (!(from_user_id ?? undefined) || !(to_user_id ?? undefined) || !(message ?? undefined)) return reject(Error(`from_user_id, to_user_id and/or message is undefined`));

        from_user_id = from_user_id ?? i.apiclientData[sym]?._options?.userid;
        let clientid;

        if ((customtoken ?? undefined)) {
            await _validatetoken(sym, customtoken)
                .then(a => {
                    clientid = a.client_id;
                })
                .catch();
        };

        if (!i.regex.numregex().test(from_user_id)) {
            await _getuser(sym, from_user_id)
                .then(f => {
                    from_user_id = f.id;
                })
                .catch();
        };

        if (!i.regex.numregex().test(to_user_id)) {
            await _getuser(sym, to_user_id)
                .then(t => {
                    to_user_id = t.id;
                })
                .catch();
        };

        let reqbody = {
            "message": message
        };

        request(`${urls._url("twitch", "whispers")}${_joinurlquery(["from_user_id", "to_user_id"], [from_user_id, to_user_id], true)}`, { method: urls.twitch.whispers.method, headers: urls.twitch._headers(sym, customtoken, clientid), body: JSON.stringify(reqbody) }, (e, r) => {
            if (e || (r.statusCode !== urls._code("twitch", "whispers"))) return reject(Error(e ?? r.body));

            return resolve();
        });
    });
};

module.exports = whisper;