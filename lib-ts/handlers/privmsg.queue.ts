import { i } from "..";

let isTriggered = false;
let q = {};
export type mobjtype = { "channel": string, "message": string, "preContent"?: string };

export function privmsgQueue(sym: string, timeout: number | undefined, mobj: mobjtype, res: Function, rej: Function) {
    q[JSON.stringify(mobj)] = { res: res, rej: rej };
    if (isTriggered) return;
    isTriggered = true;
    let int = setInterval(triggerQueue, (timeout ?? 30000));

    function triggerQueue() {
        if ((i.clientData[sym].queue?.privmsg ?? []).length > 0) {
            const messageNum = ((i.clientData[sym]._options?.isAlwaysMod ?? false) ? 100 : 20);

            let channelMessages = {};
            i.clientData[sym].queue.privmsg.map((a: mobjtype) => {
                if (!channelMessages[a.channel]) channelMessages[a.channel] = [];
                if (channelMessages[a.channel].length < messageNum) channelMessages[a.channel].push(a);
            });

            Object.keys(channelMessages).forEach((channel: string) => {
                if (!i.clientData[sym].queueData.privmsg) i.clientData[sym].queueData.privmsg = {};
                if (!i.clientData[sym].queueData.privmsg[channel]) i.clientData[sym].queueData.privmsg[channel] = {};
                if (!i.clientData[sym].queueData.privmsg._all) i.clientData[sym].queueData.privmsg._all = {};

                channelMessages[channel].forEach((message: mobjtype) => {
                    i.clientData[sym].queueData.privmsg[channel][Date.now()] = message;
                    i.clientData[sym].queueData.privmsg._all[Date.now()] = message;

                    i.emitTwitchAction(sym, undefined, "PRIVMSG", `${message.channel} :${message.message}`, (message.preContent ?? undefined))
                        .then(() => {
                            if (!i.clientData[sym]) return clearInterval(int);

                            q[JSON.stringify(message)]?.res(this);
                            delete q[JSON.stringify(message)];
                        })
                        .catch(e => {
                            if (!i.clientData[sym]) return clearInterval(int);

                            q[JSON.stringify(message)]?.rej(e);
                            delete q[JSON.stringify(message)];
                        });
                });
            });
        } else {
            isTriggered = false;
            clearInterval(int);
        };
    };
};