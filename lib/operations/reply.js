const twitchAction = require("../handlers/twitchAction");

/** @param {Symbol} sym @param {string} replyMessage @param {string} replyMessageChannel @param {string} replyMessageParentID */
async function reply(sym, replyMessage, replyMessageChannel, replyMessageParentID) {
    if (!(replyMessage ?? undefined) || !(replyMessageChannel ?? undefined) || !(replyMessageParentID ?? undefined)) return;

    let i = require("../index");

    replyMessageChannel = i.utils.correctChannelName(replyMessageChannel);

    return twitchAction.privmsg(sym, replyMessageChannel, replyMessage, `@reply-parent-msg-id=${replyMessageParentID}`);
};

module.exports = reply;