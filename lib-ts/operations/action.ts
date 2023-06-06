import { correctChannelName } from "oberknecht-utils";
import { twitchAction } from "../handlers/twitchAction";

export async function action(sym: string, channel: string, message: string) {
    if (!(channel ?? undefined) || !(message ?? undefined)) return new Promise((r, reject) => { return reject(Error(`channel or message is undefined`)) });

    let channel_ = correctChannelName(channel);

    return twitchAction.privmsg(sym, channel_, `\u0001ACTION ${message}\u0001`);
};