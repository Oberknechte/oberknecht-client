const i = require("..");
const _checklimit = require("../functions/_checklimit");
const joinQueue = require("./join.queue");
const privmsgQueue = require("./privmsg.queue");

class twitchAction {
    static join = async (sym, channel, wsnum) => {
        if (!i.clientData[sym].queueData.join) i.clientData[sym].queueData.join = {};
        const isVerified = ((i.clientData[sym]._options?.botStatus ?? "default") === "verified");
        const limit = _checklimit(i.clientData[sym].queueData.join, (isVerified ? 2000 : 20), 10000);

        if (limit.isReached) {
            if (!i.clientData[sym].queue.join) i.clientData[sym].queue.join = [];

            i.clientData[sym].queue.join.push(channel);

            return new Promise((resolve, reject) => {
                joinQueue(sym, undefined, channel, resolve, reject);
            });
        };

        i.clientData[sym].queueData.join[Date.now()] = channel;

        wsnum = (wsnum ?? i.clientData[sym].currentKnecht);

        return await i.emitTwitchAction(sym, wsnum, "JOIN", channel)
            .then(() => {
                if (!i.clientData[sym].channels) i.clientData[sym].channels = [];
                if (!i.clientData[sym].channels.includes(channel)) i.clientData[sym].channels.push(channel);
                i.clientData[sym].knechtSockets.channels[channel] = wsnum;
                if (!i.clientData[sym].knechtSockets[wsnum].channels) i.clientData[sym].knechtSockets[wsnum].channels = [];
                if (!i.clientData[sym].knechtSockets[wsnum].channels.includes(channel)) i.clientData[sym].knechtSockets[wsnum].channels.push(channel);
            });
    };

    static privmsg = async (sym, channel, message, preContent) => {
        if (!i.clientData[sym].queueData.privmsg) i.clientData[sym].queueData.privmsg = {};
        const isVerified = ((i.clientData[sym]._options?.botStatus ?? "default") === "verified");
        const limit = _checklimit((i.clientData[sym].queueData.privmsg?.[channel] ?? {}), (isVerified ? 2000 : 20), 10000);
        let messageobject = { "channel": channel, "message": message, "preContent": (preContent ?? undefined) };

        if (limit.isReached) {
            if (!i.clientData[sym].queue.privmsg) i.clientData[sym].queue.privmsg = [];

            i.clientData[sym].queue.privmsg.push(messageobject);

            return new Promise((resolve, reject) => {
                privmsgQueue(sym, undefined, messageobject, resolve, reject);
            });
        };

        if (!i.clientData[sym].queueData.privmsg) i.clientData[sym].queueData.privmsg = {};
        if (!i.clientData[sym].queueData.privmsg[channel]) i.clientData[sym].queueData.privmsg[channel] = {};
        if (!i.clientData[sym].queueData.privmsg._all) i.clientData[sym].queueData.privmsg._all = {};

        i.clientData[sym].queueData.privmsg[channel][Date.now()] = messageobject;
        i.clientData[sym].queueData.privmsg._all[Date.now()] = messageobject;

        return await i.emitTwitchAction(sym, undefined, "PRIVMSG", `${channel} :${message}`, (preContent ?? undefined));
    };
};

module.exports = twitchAction;