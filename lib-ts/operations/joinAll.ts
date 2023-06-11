import { convertToArray, correctChannelName, sleep } from "oberknecht-utils";
import { twitchAction } from "../handlers/twitchAction";
import { i } from "..";

export function joinAll(sym: string, channels: string | string[]) {
  return new Promise(async (resolve, reject) => {
    if (!(channels ?? undefined)) return;
    let channels_ = convertToArray(channels, false).map((a: string) =>
      correctChannelName(a)
    );

    await Promise.all(
      channels_.map(async (v: string, idx) => {
        return new Promise(async (resolve2) => {
          setTimeout(() => {
            twitchAction.join(sym, v).then(resolve2).catch(resolve2);
          }, (i.clientData[sym]._options.asyncDelay ?? 10) * idx);
        });
      })
    )
      .then((joinchans) => {
        resolve(joinchans);
      })
      .catch(reject);
  });
}
