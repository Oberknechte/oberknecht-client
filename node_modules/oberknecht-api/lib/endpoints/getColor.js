const request = require("request");
const i = require("..");
const _joinurlquery = require("../functions/_joinurlquery");
const urls = require("../variables/urls");
const _validatetoken = require("./_validatetoken");

/** @param {Symbol} sym @param {string | Array<string>} userid @param {string?} customtoken */
async function getColor(sym, userid, customtoken) {
    return new Promise(async (resolve, reject) => {
        if ((!(sym ?? undefined) && !(customtoken ?? undefined))) return reject(Error(`sym and customtoken are undefined`));

        let clientid = i.apiclientData[sym]?._options?.clientid;
        userid = userid ?? i.apiclientData[sym]?._options?.userid;

        if ((customtoken ?? undefined)) {
            await _validatetoken(undefined, customtoken)
                .then(a => {
                    clientid = a.client_id;
                    userid = a.user_id;
                })
                .catch();
        };

        request(`${urls._url("twitch", "getcolor")}${_joinurlquery("user_id", userid, true)}`, { headers: urls.twitch._headers(sym, customtoken, clientid) }, (e, r) => {
            if (e || r.statusCode !== urls._code("twitch", "getcolor")) return reject(Error(e ?? r.body));

            let dat = JSON.parse(r.body);
            return resolve(dat);
        });
    });
};

module.exports = getColor;