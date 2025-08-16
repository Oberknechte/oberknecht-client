"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.action = void 0;
let oberknecht_utils_1 = require("oberknecht-utils");
let twitchAction_1 = require("../handlers/twitchAction");
async function action(sym, channel, message) {
    if (!(channel ?? undefined) || !(message ?? undefined))
        return new Promise((r, reject) => {
            return reject(Error(`channel or message is undefined`));
        });
    let channel_ = (0, oberknecht_utils_1.correctChannelName)(channel);
    return twitchAction_1.twitchAction.privmsg(sym, channel_, `\u0001ACTION ${message}\u0001`);
}
exports.action = action;
