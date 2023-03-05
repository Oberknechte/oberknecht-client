const i = require("..");

let isTriggered = false;
let q = {};
function joinQueue(sym, timeout, chan, res, rej) {
    q[chan] = {
        res: res,
        rej: rej
    };
    if (isTriggered) return;
    isTriggered = true;
    let int = setInterval(triggerQueue, (timeout ?? 10000));

    function triggerQueue() {
        if ((i.clientData[sym].queue?.join ?? []).length > 0) {
            const channelNum = ((i.clientData[sym]._options?.botStatus ?? "default") === "verified" ? 2000 : 20);
            const channels = i.clientData[sym].queue.join.splice(0, channelNum);
            channels.forEach(async channel => {
                if (!i.clientData[sym].queueData.join) i.clientData[sym].queueData.join = {};

                i.clientData[sym].queueData.join[Date.now()] = channel;

                let wsnum = i.clientData[sym].currentKnecht;

                await i.emitTwitchAction(sym, wsnum, "JOIN", channel)
                    .then(() => {
                        if (!i.clientData[sym].channels) i.clientData[sym].channels = [];
                        if (!i.clientData[sym].channels.includes(channel)) i.clientData[sym].channels.push(channel);
                        i.clientData[sym].knechtSockets.channels[channel] = wsnum;
                        if (!i.clientData[sym].knechtSockets[wsnum].channels) i.clientData[sym].knechtSockets[wsnum].channels = [];
                        if (!i.clientData[sym].knechtSockets[wsnum].channels.includes(channel)) i.clientData[sym].knechtSockets[wsnum].channels.push(channel);

                        q[channel]?.res(this);
                        delete q[channel];
                    })
                    .catch(e => {
                        q[channel]?.rej(e);
                        delete q[channel];
                    });
            });
        } else {
            isTriggered = false;
            clearInterval(int);
        }
    };
};

module.exports = joinQueue;