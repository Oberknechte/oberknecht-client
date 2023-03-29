const request = require("request");
const i = require("../index");
const urls = require("../variables/urls");
const _getuser = require("../operations/_getuser");
const _validatetoken = require("./_validatetoken");

const chatSettings = require("../arguments/chatSettings");

const ignoredIfFalsy = {
    "slow_mode": "slow_mode_wait_time",
    "follower_mode": "follower_mode_duration",
    "non_moderator_chat_delay": "non_moderator_chat_delay_duration"
};

/** @param {Symbol} sym @param {string} broadcaster_id @param {chatSettings} settings @param {string?} customtoken */
async function updateChatSettings(sym, broadcaster_id, settings, customtoken) {
    return new Promise(async (resolve, reject) => {
        if (!(broadcaster_id ?? undefined) || !(settings ?? undefined)) return reject(Error(`broadcaster_id and/or settings is undefined`));
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

        let reqbody = {};

        Object.keys(settings).forEach(setting => {
            if(!Object.keys(chatSettings).includes(setting) || (Object.values(ignoredIfFalsy).includes(setting) && (settings[Object.keys(ignoredIfFalsy)[Object.values(ignoredIfFalsy).indexOf(setting)]] === false))) return;
            reqbody[setting] = settings[setting];
        });

        request(`${urls._url("twitch", "updatechatsettings")}?broadcaster_id=${broadcaster_id}&moderator_id=${moderator_id}`, { method: urls.twitch.updatechatsettings.method, headers: urls.twitch._headers(sym, customtoken, clientid), body: JSON.stringify(reqbody) }, (e, r) => {
            if (e || (r.statusCode !== urls._code("twitch", "updatechatsettings"))) return reject(Error(e ?? r.body));

            let dat = JSON.parse(r.body);
            return resolve(dat);
        });
    });
};

module.exports = updateChatSettings;