import { convertToArray, correctChannelName } from "oberknecht-utils";
import { i } from "..";
import { part } from "./part";

/** @param {Symbol} sym @param {Array | string} channels */
export async function partAll(sym, channels) {
    if (!(channels ?? undefined)) return;

    let channels_ = convertToArray(channels, false).map((a: string) => correctChannelName(a));

    return Promise.all(channels_.map(async (v: string) => {
        return await part(sym, v);
    }))
        .then(parts => {
            parts.forEach(a => {
                if (i.clientData[sym].channels?.includes(a)) i.clientData[sym].channels.splice(i.clientData[sym].channels.indexOf(a), 1);
            });
        });
};