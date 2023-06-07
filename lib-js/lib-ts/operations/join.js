"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.join = void 0;
let oberknecht_utils_1 = require("oberknecht-utils");
let twitchAction_1 = require("../handlers/twitchAction");
async function join(sym, channel) {
    if (!(channel ?? undefined))
        return;
    let channel_ = (0, oberknecht_utils_1.correctChannelName)(channel);
    return await twitchAction_1.twitchAction.join(sym, channel_);
}
exports.join = join;
;
