"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.reply = void 0;
let oberknecht_utils_1 = require("oberknecht-utils");
let twitchAction_1 = require("../handlers/twitchAction");
async function reply(sym, replyMessage, replyMessageChannel, replyMessageParentID) {
    return new Promise((resolve, reject) => {
        if (!(replyMessage ?? undefined) || !(replyMessageChannel ?? undefined) || !(replyMessageParentID ?? undefined))
            return;
        let replyMessageChannel_ = (0, oberknecht_utils_1.correctChannelName)(replyMessageChannel);
        twitchAction_1.twitchAction.privmsg(sym, replyMessageChannel_, replyMessage, `@reply-parent-msg-id=${replyMessageParentID}`)
            .then(resolve)
            .catch(reject);
    });
}
exports.reply = reply;
;
