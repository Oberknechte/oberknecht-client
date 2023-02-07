/**
 * @param {Symbol} sym
 * @param {string} replyMessage 
 * @param {string} replyMessageChannel 
 * @param {string} replyMessageParentID
 */
async function reply(sym, replyMessage, replyMessageChannel, replyMessageParentID){
    if(!(replyMessage ?? undefined) || !(replyMessageChannel ?? undefined) || !(replyMessageParentID ?? undefined)) return;
    let i = require("../index");
    replyMessageChannel = i.utils.correctChannelName(replyMessageChannel);

    return i.emitTwitchAction(sym, "PRIVMSG", `${replyMessageChannel} :${replyMessage}`, `@client-nonce=reply-parent-msg-id=${replyMessageParentID}`);
};

module.exports = reply;