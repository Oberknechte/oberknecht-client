"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.privmsgQueue = void 0;
let __1 = require("..");
let isTriggered = false;
let q = {};
function privmsgQueue(sym, timeout, mobj, res, rej) {
    q[JSON.stringify(mobj)] = { res: res, rej: rej };
    if (isTriggered)
        return;
    isTriggered = true;
    let int = setInterval(triggerQueue, (timeout ?? 30000));
    function triggerQueue() {
        if ((__1.i.clientData[sym].queue?.privmsg ?? []).length > 0) {
            const messageNum = ((__1.i.clientData[sym]._options?.isAlwaysMod ?? false) ? 100 : 20);
            let channelMessages = {};
            __1.i.clientData[sym].queue.privmsg.map((a) => {
                if (!channelMessages[a.channel])
                    channelMessages[a.channel] = [];
                if (channelMessages[a.channel].length < messageNum)
                    channelMessages[a.channel].push(a);
            });
            Object.keys(channelMessages).forEach((channel) => {
                if (!__1.i.clientData[sym].queueData.privmsg)
                    __1.i.clientData[sym].queueData.privmsg = {};
                if (!__1.i.clientData[sym].queueData.privmsg[channel])
                    __1.i.clientData[sym].queueData.privmsg[channel] = {};
                if (!__1.i.clientData[sym].queueData.privmsg._all)
                    __1.i.clientData[sym].queueData.privmsg._all = {};
                channelMessages[channel].forEach((message) => {
                    __1.i.clientData[sym].queueData.privmsg[channel][Date.now()] = message;
                    __1.i.clientData[sym].queueData.privmsg._all[Date.now()] = message;
                    __1.i.emitTwitchAction(sym, undefined, "PRIVMSG", `${message.channel} :${message.message}`, (message.preContent ?? undefined))
                        .then(() => {
                        if (!__1.i.clientData[sym])
                            return clearInterval(int);
                        q[JSON.stringify(message)]?.res(this);
                        delete q[JSON.stringify(message)];
                    })
                        .catch(e => {
                        if (!__1.i.clientData[sym])
                            return clearInterval(int);
                        q[JSON.stringify(message)]?.rej(e);
                        delete q[JSON.stringify(message)];
                    });
                });
            });
        }
        else {
            isTriggered = false;
            clearInterval(int);
        }
        ;
    }
    ;
}
exports.privmsgQueue = privmsgQueue;
;
