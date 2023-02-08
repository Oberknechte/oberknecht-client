const request = require("request");
const urls = require("../../var/urls");
const _joinurlquery = require("../../functions/_joinurlquery");
const i = require("../..");
const getuser = require("./getuser");
let reqopts = urls.twitch.whispers;

/** 
 * @param {Symbol} sym 
 * @param {string} from_user_id 
 * @param {string} to_user_id 
 * @param {string} message 
 */
async function whisper(sym, from_user_id, to_user_id, message) {
    return new Promise(async (resolve, reject) => {
        if (!i.regex.numregex().test(from_user_id)) {
            await getuser(sym, from_user_id).then(f => { from_user_id = f.id; }).catch();
        };
        if (!i.regex.numregex().test(to_user_id)) {
            await getuser(sym, to_user_id).then(t => { to_user_id = t.id; }).catch();
        };
        request(`${urls._url("whispers")}${_joinurlquery(["from_user_id", "to_user_id"], [from_user_id, to_user_id], true)}`, { method: urls.twitch.whispers.method, headers: urls.twitch._headers(sym), body: JSON.stringify({ message: message }) }, (e, r) => {
            if (e || r.statusCode !== urls.twitch.whispers.code) return reject(e ?? r.body);
            return resolve();
        });
    });
};

module.exports = whisper;