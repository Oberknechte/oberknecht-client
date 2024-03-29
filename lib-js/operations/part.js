"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.part = void 0;
const oberknecht_utils_1 = require("oberknecht-utils");
const __1 = require("..");
async function part(sym, channel) {
    if (!(channel ?? undefined))
        return;
    let channel_ = (0, oberknecht_utils_1.correctChannelName)(channel);
    return new Promise((resolve, reject) => {
        let wsnum = __1.i.clientData[sym].knechtSockets?.channels?.[channel_];
        if (!wsnum)
            return reject(Error("could not get channel of knechtSocket channels"));
        __1.i.emitTwitchAction(sym, wsnum, "PART", channel_)
            .then(() => {
            if (__1.i.clientData[sym].channels?.includes(channel_))
                __1.i.clientData[sym].channels.splice(__1.i.clientData[sym].channels.indexOf(channel_), 1);
            if (__1.i.clientData[sym].knechtSockets[wsnum]?.channels?.includes(channel_))
                __1.i.clientData[sym].knechtSockets[wsnum].channels.splice(__1.i.clientData[sym].knechtSockets[wsnum].channels.indexOf(channel_), 1);
            if (__1.i.clientData[sym].knechtSockets.channels[channel_])
                delete __1.i.clientData[sym].knechtSockets.channels[channel_];
            resolve(channel_);
        })
            .catch(reject);
    });
}
exports.part = part;
