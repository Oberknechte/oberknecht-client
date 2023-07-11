import { correctChannelName } from "oberknecht-utils";
import { i } from "..";

export async function part(sym: string, channel: string) {
  if (!(channel ?? undefined)) return;

  let channel_ = correctChannelName(channel);

  return new Promise((resolve, reject) => {
    let wsnum = i.clientData[sym].knechtSockets.channels[channel_];
    i.emitTwitchAction(sym, wsnum, "PART", channel_)
      .then(() => {
        if (i.clientData[sym].channels?.includes(channel_))
          i.clientData[sym].channels.splice(
            i.clientData[sym].channels.indexOf(channel_),
            1
          );
        if (i.clientData[sym].knechtSockets[wsnum]?.channels?.includes(channel_))
          i.clientData[sym].knechtSockets[wsnum].channels.splice(
            i.clientData[sym].knechtSockets[wsnum].channels.indexOf(channel_),
            1
          );
        if (i.clientData[sym].knechtSockets.channels[channel_])
          delete i.clientData[sym].knechtSockets.channels[channel_];

        resolve(channel_);
      })
      .catch(reject);
  });
}
