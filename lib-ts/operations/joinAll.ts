import { convertToArray, correctChannelName, sleep } from "oberknecht-utils";
import { twitchAction } from "../handlers/twitchAction";

export function joinAll(sym: string, channels: string | string[]) {
    return new Promise(async (resolve, reject) => {
        if (!(channels ?? undefined)) return;
        let channels_ = convertToArray(channels, false).map((a: string) => correctChannelName(a));

        await Promise.all(channels_.map(async (v: string) => {
            return await twitchAction.join(sym, v)
        }))
            .then(joinchans => {
                resolve(joinchans);
            })
            .catch(reject);
    });
};