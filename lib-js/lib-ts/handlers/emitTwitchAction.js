"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.emitTwitchAction = void 0;
let oberknecht_utils_1 = require("oberknecht-utils");
let _splitmsg_1 = require("../functions/_splitmsg");
let announcementColors_1 = require("oberknecht-api/lib-js/types/announcementColors");
let __1 = require("..");
async function emitTwitchAction(sym, wsnum, messageType, messageContent, preContent, rawContent) {
    return new Promise(async (resolve, reject) => {
        if (!__1.i.clientData[sym])
            return reject();
        if (messageType === "PRIVMSG" && __1.i.clientData[sym]._options?.executeOnOutgoingPrivmsg)
            messageContent = __1.i.clientData[sym]._options.executeOnOutgoingPrivmsg(messageContent);
        if (!["JOIN", "PART"].includes(messageType.toUpperCase()))
            wsnum = 0;
        if (["JOIN"].includes(messageType.toUpperCase())) {
            if (__1.i.clientData[sym].knechtSockets[wsnum].channels.length >= __1.i.clientData[sym]._options.max_channels_per_ws) {
                await require("../functions/_createws")(sym)
                    .then(a => {
                    wsnum = a;
                })
                    .catch(e => {
                    console.error(e);
                });
            }
            ;
        }
        ;
        let channel = messageContent?.match(/^#\w+/g)?.[0];
        let channeladd = (channel ? `${channel} :` : channel);
        // @ts-ignore
        let messages = (messageType === "PRIVMSG" ? (0, _splitmsg_1._splitmsg)(messageContent.replace(/^#\w+\s:/g, "")).map(a => channeladd + a) : [messageContent]);
        messages.forEach(async (message) => {
            // @ts-ignore
            let messageclean = message?.replace(channeladd, "");
            let slashcommand = messageclean?.match(function () { return /(?<=^\/+)\w+/; }());
            if (messageType === "PRIVMSG" && !__1.i.clientData[sym]._options?.disableSlashCommands && (slashcommand ?? undefined)) {
                // @ts-ignore
                slashcommand = slashcommand[0];
                // @ts-ignore
                let messageArguments = messageclean.split(" ");
                // @ts-ignore
                switch (slashcommand.toLowerCase()) {
                    case "ban":
                        {
                            if (!messageArguments[1])
                                return reject(Error("No user specified (messageArguments[1] is undefined)"));
                            __1.i.OberknechtAPI[sym].ban((0, oberknecht_utils_1.cleanChannelName)(channel), (0, oberknecht_utils_1.cleanChannelName)(messageArguments[1]), messageArguments.slice(2).join(" ")).then(resolve).catch(reject);
                            return;
                        }
                        ;
                    case "unban":
                    case "untimeout":
                        {
                            if (!messageArguments[1])
                                return reject(Error("No user specified (messageArguments[1] is undefined)"));
                            __1.i.OberknechtAPI[sym].unban((0, oberknecht_utils_1.cleanChannelName)(channel), (0, oberknecht_utils_1.cleanChannelName)(messageArguments[1])).then(resolve).catch(reject);
                            return;
                        }
                        ;
                    case "timeout":
                        {
                            if (!messageArguments[1])
                                return reject(Error("No user specified (messageArguments[1] is undefined)"));
                            __1.i.OberknechtAPI[sym].timeout((0, oberknecht_utils_1.cleanChannelName)(channel), (0, oberknecht_utils_1.cleanChannelName)(messageArguments[1])).then(resolve).catch(reject);
                            return;
                        }
                        ;
                    case "delete":
                    case "deletemessage":
                        {
                            if (!messageArguments[1])
                                return reject(Error("No messageID specified (messageArguments[1] is undefined)"));
                            __1.i.OberknechtAPI[sym].deleteMessage((0, oberknecht_utils_1.cleanChannelName)(channel), messageArguments[1]).then(resolve).catch(reject);
                            return;
                        }
                        ;
                    case "clear":
                        {
                            __1.i.OberknechtAPI[sym].clearChat((0, oberknecht_utils_1.cleanChannelName)(channel)).then(resolve).catch(reject);
                            return;
                        }
                        ;
                    case "shoutout":
                        {
                            if (!messageArguments[1])
                                return reject(Error("No target channel specified (messageArguments[1] is undefined)"));
                            __1.i.OberknechtAPI[sym].shoutout((0, oberknecht_utils_1.cleanChannelName)(channel), (0, oberknecht_utils_1.cleanChannelName)(messageArguments[1])).then(resolve).catch(reject);
                            return;
                        }
                        ;
                    case "announce":
                        {
                            if (!messageArguments[1])
                                return reject(Error("No announce message specified (messageArguments[1] is undefined)"));
                            let announcementColor;
                            // @ts-ignore
                            if (announcementColors_1.announcementColors.includes(messageArguments[1]))
                                announcementColor = messageArguments[1];
                            __1.i.OberknechtAPI[sym].announce((0, oberknecht_utils_1.cleanChannelName)(channel), (messageArguments.slice(((announcementColor ?? undefined) ? 2 : 1)).join(" ")), announcementColor).then(resolve).catch(reject);
                            return;
                        }
                        ;
                    case "slow":
                    case "slowmode":
                        {
                            __1.i.OberknechtAPI[sym].slow((0, oberknecht_utils_1.cleanChannelName)(channel), messageArguments[1]).then(resolve).catch(reject);
                            return;
                        }
                        ;
                    case "slowoff":
                    case "slowmodeoff":
                        {
                            __1.i.OberknechtAPI[sym].slowOff((0, oberknecht_utils_1.cleanChannelName)(channel)).then(resolve).catch(reject);
                            return;
                        }
                        ;
                    case "followers":
                    case "followersonly":
                        {
                            __1.i.OberknechtAPI[sym].followers((0, oberknecht_utils_1.cleanChannelName)(channel), messageArguments[1]).then(resolve).catch(reject);
                            return;
                        }
                        ;
                    case "followersoff":
                    case "followersonlyoff":
                        {
                            __1.i.OberknechtAPI[sym].followersOff((0, oberknecht_utils_1.cleanChannelName)(channel)).then(resolve).catch(reject);
                            return;
                        }
                        ;
                    case "subscribers":
                    case "subscribersonly":
                        {
                            __1.i.OberknechtAPI[sym].subscribers((0, oberknecht_utils_1.cleanChannelName)(channel)).then(resolve).catch(reject);
                            return;
                        }
                        ;
                    case "subscribersoff":
                    case "subscribersonlyoff":
                        {
                            __1.i.OberknechtAPI[sym].subscribersOff((0, oberknecht_utils_1.cleanChannelName)(channel)).then(resolve).catch(reject);
                            return;
                        }
                        ;
                    case "emoteonly":
                        {
                            __1.i.OberknechtAPI[sym].emote((0, oberknecht_utils_1.cleanChannelName)(channel)).then(resolve).catch(reject);
                            return;
                        }
                        ;
                    case "emoteonlyoff":
                        {
                            __1.i.OberknechtAPI[sym].emoteOff((0, oberknecht_utils_1.cleanChannelName)(channel)).then(resolve).catch(reject);
                            return;
                        }
                        ;
                    case "r9k":
                    case "r9kbeta":
                    case "uniquechat":
                        {
                            __1.i.OberknechtAPI[sym].r9k((0, oberknecht_utils_1.cleanChannelName)(channel)).then(resolve).catch(reject);
                            return;
                        }
                        ;
                    case "r9koff":
                    case "r9kbetaoff":
                    case "uniquechatoff":
                        {
                            __1.i.OberknechtAPI[sym].r9kOff((0, oberknecht_utils_1.cleanChannelName)(channel)).then(resolve).catch(reject);
                            return;
                        }
                        ;
                    case "mod":
                        {
                            if (!messageArguments[1])
                                return reject(Error("No user specified (messageArguments[1] is undefined)"));
                            __1.i.OberknechtAPI[sym].mod((0, oberknecht_utils_1.cleanChannelName)(messageArguments[1])).then(resolve).catch(reject);
                            return;
                        }
                        ;
                    case "unmod":
                        {
                            if (!messageArguments[1])
                                return reject(Error("No user specified (messageArguments[1] is undefined)"));
                            __1.i.OberknechtAPI[sym].unmod((0, oberknecht_utils_1.cleanChannelName)(messageArguments[1])).then(resolve).catch(reject);
                            return;
                        }
                        ;
                    case "vip":
                        {
                            if (!messageArguments[1])
                                return reject(Error("No user specified (messageArguments[1] is undefined)"));
                            __1.i.OberknechtAPI[sym].vip((0, oberknecht_utils_1.cleanChannelName)(messageArguments[1])).then(resolve).catch(reject);
                            return;
                        }
                        ;
                    case "unvip":
                        {
                            if (!messageArguments[1])
                                return reject(Error("No user specified (messageArguments[1] is undefined)"));
                            __1.i.OberknechtAPI[sym].unvip((0, oberknecht_utils_1.cleanChannelName)(messageArguments[1])).then(resolve).catch(reject);
                            return;
                        }
                        ;
                    case "raid":
                        {
                            if (!messageArguments[1])
                                return reject(Error("No user specified (messageArguments[1] is undefined)"));
                            __1.i.OberknechtAPI[sym].raid((0, oberknecht_utils_1.cleanChannelName)(channel), (0, oberknecht_utils_1.cleanChannelName)(messageArguments[1])).then(resolve).catch(reject);
                            return;
                        }
                        ;
                    case "unraid":
                        {
                            __1.i.OberknechtAPI[sym].cancelraid((0, oberknecht_utils_1.cleanChannelName)(channel)).then(resolve).catch(reject);
                            return;
                        }
                        ;
                    case "color":
                        {
                            if (!messageArguments[1])
                                return reject(Error("No color specified (messageArguments[1] is undefined)"));
                            __1.i.OberknechtAPI[sym].updateColor(messageArguments[1]).then(resolve).catch(reject);
                            return;
                        }
                        ;
                    case "test":
                        {
                            console.log("test");
                            resolve("test");
                            return;
                        }
                        ;
                }
                ;
            }
            ;
            __1.i.OberknechtActionEmitter[sym]?.once(messageType.toUpperCase(), () => { __1.i.reconnectingKnechtClient[sym]?.[wsnum]?.send(((rawContent ? rawContent : `${((preContent ?? undefined) ? `${preContent} ` : "")}${messageType} ${message ?? ""}`))); })
                .then(a => {
                return resolve(a);
            })
                .catch(e => {
                __1.i.OberknechtEmitter[sym]?.emit(["error", "actionemitter:error"], e);
                return reject(e);
            });
        });
    });
}
exports.emitTwitchAction = emitTwitchAction;
;
