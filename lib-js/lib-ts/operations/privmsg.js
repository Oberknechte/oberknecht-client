"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.privmsg = void 0;
const oberknecht_utils_1 = require("oberknecht-utils");
const twitchAction_1 = require("../handlers/twitchAction");
async function privmsg(sym, channel, message) {
    return new Promise((resolve, reject) => {
        if (!(channel ?? undefined) || !(message ?? undefined))
            return reject(Error(`channel or message is undefined`));
        let channel_ = (0, oberknecht_utils_1.correctChannelName)(channel);
        twitchAction_1.twitchAction.privmsg(sym, channel_, message)
            .then(resolve)
            .catch(reject);
    });
}
exports.privmsg = privmsg;
;
