import { correctChannelName } from "oberknecht-utils";
import { twitchAction } from "../handlers/twitchAction";

export async function privmsg(sym: string, channel: string, message: string) {
    return new Promise((resolve, reject) => {
        if (!(channel ?? undefined) || !(message ?? undefined)) return reject(Error(`channel or message is undefined`));

        let channel_ = correctChannelName(channel);

        twitchAction.privmsg(sym, channel_, message)
            .then(resolve)
            .catch(reject);
    });
};