import { i } from "..";
import { _createws } from "../functions/_createws";

let isTriggered = false;
let q = {};
export function joinQueue(sym: string, timeout: number | undefined, chan: string, res: Function, rej: Function) {
    q[chan] = { res: res, rej: rej };
    if (isTriggered) return;
    isTriggered = true;
    let timeout_ = (timeout ?? (i.clientData[sym]._options.ignoreJoinLimits ? 1000 : 10000));
    let int = setInterval(triggerQueue, timeout_);

    function triggerQueue() {
        if (!i.clientData[sym]) return;
        if ((i.clientData[sym].queue?.join ?? []).length > 0) {
            const channelNum = ((((i.clientData[sym]._options?.botStatus ?? "default") === "verified") || i.clientData[sym]._options.ignoreJoinLimits) ? 2000 : 20);
            const channels = i.clientData[sym].queue.join.splice(0, channelNum);

            channels.forEach(async (channel: string) => {
                if (!i.clientData[sym].queueData.join) i.clientData[sym].queueData.join = {};

                i.clientData[sym].queueData.join[Date.now()] = channel;

                let wsnum = i.clientData[sym].currentKnecht;

                if (i.clientData[sym].knechtSockets[wsnum].channels.length >= i.clientData[sym]._options.max_channels_per_ws) {
                    clearInterval(int);
                    await _createws(sym)
                        .then((a: number) => {
                            wsnum = a;
                        })
                        .finally(() => {
                            int = setInterval(triggerQueue, timeout_);
                        });
                };

                await i.emitTwitchAction(sym, wsnum, "JOIN", channel)
                    .then(() => {
                        if (!i.clientData[sym]) return clearInterval(int);

                        if (!i.clientData[sym].channels) i.clientData[sym].channels = [];
                        if (!i.clientData[sym].channels.includes(channel)) i.clientData[sym].channels.push(channel);
                        i.clientData[sym].knechtSockets.channels[channel] = wsnum;
                        if (!i.clientData[sym].knechtSockets[wsnum].channels) i.clientData[sym].knechtSockets[wsnum].channels = [];
                        if (!i.clientData[sym].knechtSockets[wsnum].channels.includes(channel)) i.clientData[sym].knechtSockets[wsnum].channels.push(channel);

                        q[channel]?.res(this);
                        delete q[channel];
                    })
                    .catch(e => {
                        if (!i.clientData[sym]) return clearInterval(int);

                        q[channel]?.rej(e);
                        delete q[channel];
                    });
            });
        } else {
            isTriggered = false;
            clearInterval(int);
        };
    };
};