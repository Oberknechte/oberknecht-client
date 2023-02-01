/**
 * @param {String} replyMessage 
 * @param {String} replyMessageChannel 
 * @param {String} replyMessageParentID
 */
async function reply(replyMessage, replyMessageChannel, replyMessageParentID){
    if(!(replyMessage ?? undefined) || !(replyMessageChannel ?? undefined) || !(replyMessageParentID ?? undefined)) return;
    let i = require("../index");
    replyMessageChannel = i.utils.correctChannelName(replyMessageChannel);

    return i.emitTwitchAction("PRIVMSG", `${replyMessageChannel} :${replyMessage}`, `@reply-parent-msg-id=${replyMessageParentID}`);
};

module.exports = reply;