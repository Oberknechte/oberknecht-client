const request = require("request");
const i = require("..");
const urls = require("../variables/urls");
const _validatetoken = require("./_validatetoken");

/** @param {Symbol} sym @param {"blue" | "blue_violet" | "cadet_blue" | "chocolate" | "coral" | "dodger_blue" | "firebrick" | "golden_rod" | "green" | "hot_pink" | "orange_red" | "red" | "sea_green" | "spring_green" | "yellow_green"} color @param {string?} customtoken */
async function updatecolor(sym, color, customtoken) {
    return new Promise(async (resolve, reject) => {
        if ((!(sym ?? undefined) && !(customtoken ?? undefined)) || !(color ?? undefined)) return reject(Error(`sym and customtoken or color is undefined`));

        let clientid = i.apiclientData[sym]?._options?.clientid;
        let userid = i.apiclientData[sym]?._options?.userid;

        if ((customtoken ?? undefined)) {
            await _validatetoken(undefined, customtoken)
                .then(a => {
                    clientid = a.client_id;
                    userid = a.user_id;
                })
                .catch();
        };

        request(`${urls._url("twitch", "updatecolor")}?user_id=${userid}&color=${color}`, { method: urls.twitch.updatecolor.method, headers: urls.twitch._headers(sym, customtoken, clientid) }, (e, r) => {
            if (e || r.statusCode !== urls._code("twitch", "updatecolor")) return reject(Error(e ?? r.body));

            return resolve();
        });
    });
};

module.exports = updatecolor;