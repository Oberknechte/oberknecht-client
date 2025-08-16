"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.twitchAction = void 0;
let __1 = require("..");
let _checklimit_1 = require("../functions/_checklimit");
let join_queue_1 = require("./join.queue");
let privmsg_queue_1 = require("./privmsg.queue");
class twitchAction {
    static join = (sym, channel, wsnum) => {
        if (!__1.i.clientData[sym].queueData.join)
            __1.i.clientData[sym].queueData.join = {};
        const isVerified = (__1.i.clientData[sym]._options?.botStatus ?? "default") === "verified";
        const limit = (0, _checklimit_1._checklimit)(__1.i.clientData[sym].queueData.join, isVerified || __1.i.clientData[sym]._options?.ignoreJoinLimits ? 2000 : 20, 10000);
        return new Promise((resolve, reject) => {
            if (limit.isReached) {
                if (!__1.i.clientData[sym].queue.join)
                    __1.i.clientData[sym].queue.join = [];
                __1.i.clientData[sym].queue.join.push(channel);
                return (0, join_queue_1.joinQueue)(sym, undefined, channel, resolve, reject);
            }
            __1.i.clientData[sym].queueData.join[Date.now()] = channel;
            wsnum = wsnum ?? __1.i.clientData[sym].currentKnecht;
            __1.i.emitTwitchAction(sym, wsnum, "JOIN", channel)
                .then(() => {
                if (!__1.i.clientData[sym].channels)
                    __1.i.clientData[sym].channels = [];
                if (!__1.i.clientData[sym].channels.includes(channel))
                    __1.i.clientData[sym].channels.push(channel);
                __1.i.clientData[sym].knechtSockets.channels[channel] = wsnum;
                if (!__1.i.clientData[sym].knechtSockets[wsnum].channels)
                    __1.i.clientData[sym].knechtSockets[wsnum].channels = [];
                if (!__1.i.clientData[sym].knechtSockets[wsnum].channels.includes(channel))
                    __1.i.clientData[sym].knechtSockets[wsnum].channels.push(channel);
                return resolve({
                    channel: channel,
                    statusMessage: "Success",
                    wsNum: wsnum,
                });
            })
                .catch((e) => {
                let e2 = e;
                if (!(e instanceof Error))
                    e = Error(e.toString());
                reject({ error: e, channel: channel, statusMessage: "Error" });
            });
        });
    };
    static privmsg = (sym, channel, message, preContent) => {
        if (!__1.i.clientData[sym].queueData.privmsg)
            __1.i.clientData[sym].queueData.privmsg = {};
        const isVerified = (__1.i.clientData[sym]._options?.botStatus ?? "default") === "verified";
        const limit = (0, _checklimit_1._checklimit)(__1.i.clientData[sym].queueData.privmsg?.[channel] ?? {}, isVerified ? 2000 : 20, 10000);
        return new Promise((resolve, reject) => {
            let messageobject = {
                channel: channel,
                message: message,
                preContent: preContent ?? undefined,
            };
            if (limit.isReached) {
                if (!__1.i.clientData[sym].queue.privmsg)
                    __1.i.clientData[sym].queue.privmsg = [];
                __1.i.clientData[sym].queue.privmsg.push(messageobject);
                return (0, privmsg_queue_1.privmsgQueue)(sym, undefined, messageobject, resolve, reject);
            }
            if (!__1.i.clientData[sym].queueData.privmsg)
                __1.i.clientData[sym].queueData.privmsg = {};
            if (!__1.i.clientData[sym].queueData.privmsg[channel])
                __1.i.clientData[sym].queueData.privmsg[channel] = {};
            if (!__1.i.clientData[sym].queueData.privmsg._all)
                __1.i.clientData[sym].queueData.privmsg._all = {};
            __1.i.clientData[sym].queueData.privmsg[channel][Date.now()] = messageobject;
            __1.i.clientData[sym].queueData.privmsg._all[Date.now()] = messageobject;
            __1.i.emitTwitchAction(sym, undefined, "PRIVMSG", `${channel} :${message}`, preContent ?? undefined)
                .then(resolve)
                .catch(reject);
        });
    };
}
exports.twitchAction = twitchAction;
