"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.joinQueue = void 0;
const __1 = require("..");
const _createws_1 = require("../functions/_createws");
let isTriggered = {};
let q = {};
function joinQueue(sym, timeout, chan, res, rej) {
    if (!q[sym])
        q[sym] = {};
    q[sym][chan] = { res: res, rej: rej };
    if (isTriggered[sym])
        return;
    isTriggered[sym] = true;
    let timeout_ = timeout ?? (__1.i.clientData[sym]._options.ignoreJoinLimits ? 1000 : 10000);
    let int = setInterval(triggerQueue, timeout_);
    function triggerQueue() {
        if (!__1.i.clientData[sym])
            return;
        if ((__1.i.clientData[sym].queue?.join ?? []).length > 0) {
            const channelNum = (__1.i.clientData[sym]._options?.botStatus ?? "default") === "verified" ||
                __1.i.clientData[sym]._options.ignoreJoinLimits
                ? 100
                : 20;
            const channels = __1.i.clientData[sym].queue.join.splice(0, channelNum);
            channels.forEach(async (channel) => {
                if (!__1.i.clientData[sym].queueData.join)
                    __1.i.clientData[sym].queueData.join = {};
                __1.i.clientData[sym].queueData.join[Date.now()] = channel;
                let wsnum = __1.i.clientData[sym].currentKnecht;
                if (__1.i.clientData[sym].knechtSockets[wsnum].channels.length >=
                    __1.i.clientData[sym]._options.max_channels_per_ws) {
                    clearInterval(int);
                    await (0, _createws_1._createws)(sym)
                        .then((a) => {
                        wsnum = a;
                    })
                        .finally(() => {
                        int = setInterval(triggerQueue, timeout_);
                    });
                }
                await __1.i
                    .emitTwitchAction(sym, wsnum, "JOIN", channel)
                    .then(() => {
                    if (!__1.i.clientData[sym])
                        return clearInterval(int);
                    if (!__1.i.clientData[sym].channels)
                        __1.i.clientData[sym].channels = [];
                    if (!__1.i.clientData[sym].channels.includes(channel))
                        __1.i.clientData[sym].channels.push(channel);
                    __1.i.clientData[sym].knechtSockets.channels[channel] = wsnum;
                    if (!__1.i.clientData[sym].knechtSockets[wsnum].channels)
                        __1.i.clientData[sym].knechtSockets[wsnum].channels = [];
                    if (!__1.i.clientData[sym].knechtSockets[wsnum].channels.includes(channel))
                        __1.i.clientData[sym].knechtSockets[wsnum].channels.push(channel);
                    q[sym][channel]?.res(this);
                    delete q[sym][channel];
                })
                    .catch((e) => {
                    if (!__1.i.clientData[sym])
                        return clearInterval(int);
                    q[sym][channel]?.rej(e);
                    delete q[sym][channel];
                });
            });
        }
        else {
            isTriggered[sym] = false;
            clearInterval(int);
        }
    }
}
exports.joinQueue = joinQueue;
