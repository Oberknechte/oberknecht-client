"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.joinAll = void 0;
const oberknecht_utils_1 = require("oberknecht-utils");
const twitchAction_1 = require("../handlers/twitchAction");
function joinAll(sym, channels) {
    return new Promise(async (resolve, reject) => {
        if (!(channels ?? undefined))
            return;
        let channels_ = (0, oberknecht_utils_1.convertToArray)(channels, false).map((a) => (0, oberknecht_utils_1.correctChannelName)(a));
        await Promise.all(channels_.map(async (v) => {
            return await twitchAction_1.twitchAction.join(sym, v);
        }))
            .then(joinchans => {
            resolve(joinchans);
        })
            .catch(reject);
    });
}
exports.joinAll = joinAll;
;
