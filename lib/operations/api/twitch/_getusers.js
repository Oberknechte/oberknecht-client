const request = require("request");
let i = require("../../..");
const _joinurlquery = require("../../../functions/_joinurlquery");
const urls = require("../../../var/urls");

/**
 * @param {Symbol} sym 
 * @param {Array?} logins 
 * @param {Array?} ids 
 */
function getusers(sym, logins, ids) {
    return new Promise((resolve, reject) => {
        if (!(sym ?? undefined) || !((logins ?? undefined) || (ids ?? undefined))) return reject(Error("sym or logins and ids undefined"));
        logins = (logins && !Array.isArray(logins) ? [logins] : []);
        ids = (ids && !Array.isArray(ids) ? [ids] : []);

        request(`${urls._url("twitch", "users")}${_joinurlquery("login", logins, true)}${_joinurlquery("id", ids, ((logins ?? undefined) ? false : true))}`, { headers: urls.twitch._headers(sym) }, (e, r) => {
            if ((e || r.statusCode !== urls._code("twitch", "users"))) return reject(Error(e ?? r.body));

            let dat = JSON.parse(r.body);
            return resolve(dat);
        });
    });
};

module.exports = getusers;