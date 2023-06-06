import { correctChannelName } from "oberknecht-utils";
import { twitchAction } from "../handlers/twitchAction";

export async function reply(sym: string, replyMessage: string, replyMessageChannel: string, replyMessageParentID: string) {
    return new Promise((resolve, reject) => {
        if (!(replyMessage ?? undefined) || !(replyMessageChannel ?? undefined) || !(replyMessageParentID ?? undefined)) return;

        let replyMessageChannel_ = correctChannelName(replyMessageChannel);

        twitchAction.privmsg(sym, replyMessageChannel_, replyMessage, `@reply-parent-msg-id=${replyMessageParentID}`)
            .then(resolve)
            .catch(reject);
    });
};