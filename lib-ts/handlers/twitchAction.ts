import { i } from "..";
import { _checklimit } from "../functions/_checklimit";
import { _createws } from "../functions/_createws";
import { joinQueue } from "./join.queue";
import { privmsgQueue } from "./privmsg.queue";

export class twitchAction {
  static join = (sym: string, channel: string, wsnum?: number) => {
    if (!i.clientData[sym].queueData.join)
      i.clientData[sym].queueData.join = {};
    const isVerified =
      (i.clientData[sym]._options?.botStatus ?? "default") === "verified";
    const limit = _checklimit(
      i.clientData[sym].queueData.join,
      isVerified || i.clientData[sym]._options?.ignoreJoinLimits ? 2000 : 20,
      10000
    );

    return new Promise((resolve, reject) => {
      if (limit.isReached) {
        if (!i.clientData[sym].queue.join) i.clientData[sym].queue.join = [];

        i.clientData[sym].queue.join.push(channel);

        return joinQueue(sym, undefined, channel, resolve, reject);
      }

      i.clientData[sym].queueData.join[Date.now()] = channel;

      wsnum = wsnum ?? i.clientData[sym].currentKnecht;

      i.emitTwitchAction(sym, wsnum, "JOIN", channel)
        .then(() => {
          if (!i.clientData[sym].channels) i.clientData[sym].channels = [];
          if (!i.clientData[sym].channels.includes(channel))
            i.clientData[sym].channels.push(channel);
          i.clientData[sym].knechtSockets.channels[channel] = wsnum;
          if (!i.clientData[sym].knechtSockets[wsnum].channels)
            i.clientData[sym].knechtSockets[wsnum].channels = [];
          if (
            !i.clientData[sym].knechtSockets[wsnum].channels.includes(channel)
          )
            i.clientData[sym].knechtSockets[wsnum].channels.push(channel);
          return resolve({
            channel: channel,
            statusMessage: "Success",
            wsNum: wsnum,
          });
        })
        .catch((e) => {
          let e2 = e;
          if (!(e instanceof Error)) e = Error(e.toString());
          reject({ error: e, channel: channel, statusMessage: "Error" });
        });
    });
  };

  static privmsg = (
    sym: string,
    channel: string,
    message: string,
    preContent?: string
  ) => {
    if (!i.clientData[sym].queueData.privmsg)
      i.clientData[sym].queueData.privmsg = {};
    const isVerified =
      (i.clientData[sym]._options?.botStatus ?? "default") === "verified";
    const limit = _checklimit(
      i.clientData[sym].queueData.privmsg?.[channel] ?? {},
      isVerified ? 2000 : 20,
      10000
    );
    return new Promise((resolve, reject) => {
      let messageobject = {
        channel: channel,
        message: message,
        preContent: preContent ?? undefined,
      };

      if (limit.isReached) {
        if (!i.clientData[sym].queue.privmsg)
          i.clientData[sym].queue.privmsg = [];

        i.clientData[sym].queue.privmsg.push(messageobject);

        return privmsgQueue(sym, undefined, messageobject, resolve, reject);
      }

      if (!i.clientData[sym].queueData.privmsg)
        i.clientData[sym].queueData.privmsg = {};
      if (!i.clientData[sym].queueData.privmsg[channel])
        i.clientData[sym].queueData.privmsg[channel] = {};
      if (!i.clientData[sym].queueData.privmsg._all)
        i.clientData[sym].queueData.privmsg._all = {};

      i.clientData[sym].queueData.privmsg[channel][Date.now()] = messageobject;
      i.clientData[sym].queueData.privmsg._all[Date.now()] = messageobject;

      i.emitTwitchAction(
        sym,
        undefined,
        "PRIVMSG",
        `${channel} :${message}`,
        preContent ?? undefined
      )
        .then(resolve)
        .catch(reject);
    });
  };
}
