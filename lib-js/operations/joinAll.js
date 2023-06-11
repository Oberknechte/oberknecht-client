"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.joinAll = void 0;
let oberknecht_utils_1 = require("oberknecht-utils");
let twitchAction_1 = require("../handlers/twitchAction");
let __1 = require("..");
function joinAll(sym, channels) {
    return new Promise(async (resolve, reject) => {
        if (!(channels ?? undefined))
            return;
        let channels_ = (0, oberknecht_utils_1.convertToArray)(channels, false).map((a) => (0, oberknecht_utils_1.correctChannelName)(a));
        await Promise.all(channels_.map(async (v, idx) => {
            return new Promise(async (resolve2) => {
                setTimeout(() => {
                    twitchAction_1.twitchAction.join(sym, v).then(resolve2).catch(resolve2);
                }, (__1.i.clientData[sym]._options.asyncDelay ?? 10) * idx);
            });
        }))
            .then((joinchans) => {
            resolve(joinchans);
        })
            .catch(reject);
    });
}
exports.joinAll = joinAll;
