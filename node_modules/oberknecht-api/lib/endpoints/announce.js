const request = require("request");
const i = require("../index");
const urls = require("../variables/urls");
const _getuser = require("../operations/_getuser");
const _validatetoken = require("./_validatetoken");

const announcementColors = ["blue", "green", "orange", "purple", "primary"];

/** @param {Symbol} sym @param {string} broadcaster_id @param {string} message @param {string?} color @default color "primary" */
async function announce(sym, broadcaster_id, message, color, customtoken) {
    return new Promise(async (resolve, reject) => {
        if (!(broadcaster_id ?? undefined) || !(message ?? undefined)) return reject(Error(`broadcaster_id and/or message is undefined`));
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
                    moderator_id = i.apiclientData[sym]?._options?.userid;
                    clientid = i.apiclientData[sym]?._options?.clientid;
                });
        };

        if (!i.regex.numregex().test(broadcaster_id)) {
            await _getuser(sym, broadcaster_id)
                .then(u => {
                    broadcaster_id = u[1];
                })
                .catch();
        };

        let reqbody = {
            "message": message
        };

        if ((color ?? undefined) && announcementColors.includes(color.toLowerCase())) reqbody["color"] = color;

        request(`${urls._url("twitch", "announcement")}?broadcaster_id=${broadcaster_id}&moderator_id=${moderator_id}`, { method: urls.twitch.announcement.method, headers: urls.twitch._headers(sym, customtoken, clientid), body: JSON.stringify(reqbody) }, (e, r) => {
            if (e || (r.statusCode !== urls._code("twitch", "announcement"))) return reject(Error(e ?? r.body));

            return resolve();
        });
    });
};

module.exports = announce;