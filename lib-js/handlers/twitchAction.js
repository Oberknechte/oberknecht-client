"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.twitchAction = void 0;
const __1 = require("..");
const _checklimit_1 = require("../functions/_checklimit");
const _createws_1 = require("../functions/_createws");
const join_queue_1 = require("./join.queue");
const privmsg_queue_1 = require("./privmsg.queue");
class twitchAction {
    static join = async (sym, channel, wsnum) => {
        return new Promise(async (resolve, reject) => {
            if (!__1.i.clientData[sym].queueData.join)
                __1.i.clientData[sym].queueData.join = {};
            const isVerified = ((__1.i.clientData[sym]._options?.botStatus ?? "default") === "verified");
            const limit = (0, _checklimit_1._checklimit)(__1.i.clientData[sym].queueData.join, ((isVerified || __1.i.clientData[sym]._options?.ignoreJoinLimits) ? 2000 : 20), 10000);
            if (limit.isReached) {
                if (!__1.i.clientData[sym].queue.join)
                    __1.i.clientData[sym].queue.join = [];
                __1.i.clientData[sym].queue.join.push(channel);
                (0, join_queue_1.joinQueue)(sym, undefined, channel, resolve, reject);
            }
            ;
            __1.i.clientData[sym].queueData.join[Date.now()] = channel;
            wsnum = (wsnum ?? __1.i.clientData[sym].currentKnecht);
            if (__1.i.clientData[sym].knechtSockets[wsnum].channels.length >= __1.i.clientData[sym]._options.max_channels_per_ws) {
                await (0, _createws_1._createws)(sym)
                    .then((a) => {
                    wsnum = a;
                });
            }
            ;
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
                return resolve(this);
            })
                .catch(reject);
        });
    };
    static privmsg = async (sym, channel, message, preContent) => {
        return new Promise(async (resolve, reject) => {
            if (!__1.i.clientData[sym].queueData.privmsg)
                __1.i.clientData[sym].queueData.privmsg = {};
            const isVerified = ((__1.i.clientData[sym]._options?.botStatus ?? "default") === "verified");
            const limit = (0, _checklimit_1._checklimit)((__1.i.clientData[sym].queueData.privmsg?.[channel] ?? {}), (isVerified ? 2000 : 20), 10000);
            let messageobject = { "channel": channel, "message": message, "preContent": (preContent ?? undefined) };
            if (limit.isReached) {
                if (!__1.i.clientData[sym].queue.privmsg)
                    __1.i.clientData[sym].queue.privmsg = [];
                __1.i.clientData[sym].queue.privmsg.push(messageobject);
                (0, privmsg_queue_1.privmsgQueue)(sym, undefined, messageobject, resolve, reject);
            }
            ;
            if (!__1.i.clientData[sym].queueData.privmsg)
                __1.i.clientData[sym].queueData.privmsg = {};
            if (!__1.i.clientData[sym].queueData.privmsg[channel])
                __1.i.clientData[sym].queueData.privmsg[channel] = {};
            if (!__1.i.clientData[sym].queueData.privmsg._all)
                __1.i.clientData[sym].queueData.privmsg._all = {};
            __1.i.clientData[sym].queueData.privmsg[channel][Date.now()] = messageobject;
            __1.i.clientData[sym].queueData.privmsg._all[Date.now()] = messageobject;
            __1.i.emitTwitchAction(sym, undefined, "PRIVMSG", `${channel} :${message}`, (preContent ?? undefined))
                .then(resolve)
                .catch(reject);
        });
    };
}
exports.twitchAction = twitchAction;
;
