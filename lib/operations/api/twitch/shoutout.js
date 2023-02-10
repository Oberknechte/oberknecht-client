const request = require("request");
const i = require("../../..");
const _joinurlquery = require("../../../functions/_joinurlquery");
const urls = require("../../../var/urls");
const getuser = require("../getuser");
const _validatetoken = require("./_validatetoken");

/**
 * @param {Symbol} sym 
 * @param {string} from_broadcaster_id 
 * @param {string} to_broadcaster_id 
 */
async function shoutout(sym, from_broadcaster_id, to_broadcaster_id, customtoken) {
    return new Promise(async (resolve, reject) => {
        let moderator_id = i.clientData[sym]?._options?.userid;
        let clientid = i.clientData[sym]?._options?.clientid;
        if (customtoken) {
            await _validatetoken(undefined, customtoken)
                .then(a => {
                    moderator_id = a.user_id;
                    clientid = a.client_id;
                })
                .catch(e => {
                    if (!sym) return reject(e);
                    i.OberknechtEmitter[sym]?.emitError(e);
                    moderator_id = i.clientData[sym]._options.userid;
                    clientid = i.clientData[sym]._options.clientid;
                });
        };

        if(!i.regex.numregex().test(from_broadcaster_id) && i.regex.twitch.usernamereg().test(from_broadcaster_id)){
            await getuser(sym, from_broadcaster_id)
            .then(u => {
                from_broadcaster_id = u[1];
            })
            .catch();
        };
        
        if(!i.regex.numregex().test(to_broadcaster_id) && i.regex.twitch.usernamereg().test(to_broadcaster_id)){
            await getuser(sym, to_broadcaster_id)
            .then(u => {
                to_broadcaster_id = u[1];
            })
            .catch();
        };

        request(`${urls._url("twitch", "chat", "shoutouts")}${_joinurlquery(["moderator_id", "from_broadcaster_id", "to_broadcaster_id"], [moderator_id, from_broadcaster_id, to_broadcaster_id], true)}`, { headers: urls.twitch._headers(sym, customtoken, clientid), method: urls.twitch.shoutouts.method }, (e, r) => {
            if(e || r.statusCode !== urls._code("twitch", "shoutouts")) return reject(e ?? r.body);

            return resolve(r.body);
        })
    });
};

module.exports = shoutout;