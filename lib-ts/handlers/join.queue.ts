import { i } from "..";
import { _createws } from "../functions/_createws";

let isTriggered = {};
let q = {};
export function joinQueue(
  sym: string,
  timeout: number | undefined,
  chan: string,
  res: Function,
  rej: Function
) {
  if (!q[sym]) q[sym] = {};
  q[sym][chan] = { res: res, rej: rej };
  if (isTriggered[sym]) return;
  isTriggered[sym] = true;
  let timeout_ =
    timeout ?? (i.clientData[sym]._options.ignoreJoinLimits ? 1000 : 10000);
  let int = setInterval(triggerQueue, timeout_);

  function triggerQueue() {
    if (!i.clientData[sym]) return;
    if ((i.clientData[sym].queue?.join ?? []).length > 0) {
      const channelNum =
        (i.clientData[sym]._options?.botStatus ?? "default") === "verified" ||
        i.clientData[sym]._options.ignoreJoinLimits
          ? 100
          : 20;
      const channels = i.clientData[sym].queue.join.splice(0, channelNum);

      channels.forEach(async (channel: string) => {
        if (!i.clientData[sym].queueData.join)
          i.clientData[sym].queueData.join = {};

        i.clientData[sym].queueData.join[Date.now()] = channel;

        let wsnum = i.clientData[sym].currentKnecht;

        if (
          i.clientData[sym].knechtSockets[wsnum].channels.length >=
          i.clientData[sym]._options.max_channels_per_ws
        ) {
          clearInterval(int);
          await _createws(sym)
            .then((a: number) => {
              wsnum = a;
            })
            .finally(() => {
              int = setInterval(triggerQueue, timeout_);
            });
        }

        await i
          .emitTwitchAction(sym, wsnum, "JOIN", channel)
          .then(() => {
            if (!i.clientData[sym]) return clearInterval(int);

            if (!i.clientData[sym].channels) i.clientData[sym].channels = [];
            if (!i.clientData[sym].channels.includes(channel))
              i.clientData[sym].channels.push(channel);
            i.clientData[sym].knechtSockets.channels[channel] = wsnum;
            if (!i.clientData[sym].knechtSockets[wsnum].channels)
              i.clientData[sym].knechtSockets[wsnum].channels = [];
            if (
              !i.clientData[sym].knechtSockets[wsnum].channels.includes(channel)
            )
              i.clientData[sym].knechtSockets[wsnum].channels.push(channel);

            q[sym][channel]?.res(this);
            delete q[sym][channel];
          })
          .catch((e) => {
            if (!i.clientData[sym]) return clearInterval(int);

            q[sym][channel]?.rej(e);
            delete q[sym][channel];
          });
      });
    } else {
      isTriggered[sym] = false;
      clearInterval(int);
    }
  }
}
