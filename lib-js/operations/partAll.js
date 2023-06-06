"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.partAll = void 0;
const oberknecht_utils_1 = require("oberknecht-utils");
const __1 = require("..");
const part_1 = require("./part");
/** @param {Symbol} sym @param {Array | string} channels */
async function partAll(sym, channels) {
    if (!(channels ?? undefined))
        return;
    let channels_ = (0, oberknecht_utils_1.convertToArray)(channels, false).map((a) => (0, oberknecht_utils_1.correctChannelName)(a));
    return Promise.all(channels_.map(async (v) => {
        return await (0, part_1.part)(sym, v);
    }))
        .then(parts => {
        parts.forEach(a => {
            if (__1.i.clientData[sym].channels?.includes(a))
                __1.i.clientData[sym].channels.splice(__1.i.clientData[sym].channels.indexOf(a), 1);
        });
    });
}
exports.partAll = partAll;
;
