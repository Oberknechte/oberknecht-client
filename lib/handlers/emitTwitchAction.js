const { cleanChannelName } = require("oberknecht-utils");
const _splitmsg = require("../functions/_splitmsg");
const annoucementColors = require("oberknecht-api/lib/arguments/endpoints/annoucement.colors");

/** @param {Symbol} sym @param {string} messageType @param {string} messageContent @param {String | undefined} preContent @param {String | undefined} rawContent */
async function emitTwitchAction(sym, wsnum, messageType, messageContent, preContent, rawContent) {
    return new Promise(async (resolve, reject) => {
        let i = require("../index");
        if (!i.clientData[sym]) return reject();
        if (messageType === "PRIVMSG" && i.clientData[sym]._options?.executeOnOutgoingPrivmsg) messageContent = i.clientData[sym]._options.executeOnOutgoingPrivmsg(messageContent);
        if (!["JOIN", "PART"].includes(messageType.toUpperCase())) wsnum = 0;
        if (["JOIN"].includes(messageType.toUpperCase())) {
            if (i.clientData[sym].knechtSockets[wsnum].channels.length >= i.clientData[sym]._options.max_channels_per_ws) {
                await require("../functions/_createws")(sym)
                    .then(a => {
                        wsnum = a;
                    })
                    .catch(e => {
                        console.error(e);
                    });
            };
        };

        let channel = messageContent?.match(/^#\w+/g)?.[0];
        let channeladd = (channel ? `${channel} :` : channel);
        let messages = (messageType === "PRIVMSG" ? _splitmsg(messageContent.replace(/^#\w+\s:/g, "")).map(a => channeladd + a) : [messageContent]);

        messages.forEach(async message => {
            let messageclean = message?.replace(channeladd, "");
            let slashcommand = messageclean?.match(function () { return /(?<=^\/+)\w+/ }());
            if (messageType === "PRIVMSG" && !i.clientData[sym]._options?.disableSlashCommands && (slashcommand ?? undefined)) {
                slashcommand = slashcommand[0];
                let messageArguments = messageclean.split(" ");
                switch (slashcommand.toLowerCase()) {
                    case "ban": {
                        if (!messageArguments[1]) return reject(Error("No user specified (messageArguments[1] is undefined)"));
                        i.OberknechtAPI[sym].ban(cleanChannelName(channel), cleanChannelName(messageArguments[1]), messageArguments.slice(2).join(" ")).then(resolve).catch(reject);
                        return;
                    };

                    case "unban":
                    case "untimeout": {
                        if (!messageArguments[1]) return reject(Error("No user specified (messageArguments[1] is undefined)"));
                        i.OberknechtAPI[sym].unban(cleanChannelName(channel), cleanChannelName(messageArguments[1])).then(resolve).catch(reject);
                        return;
                    };

                    case "timeout": {
                        if (!messageArguments[1]) return reject(Error("No user specified (messageArguments[1] is undefined)"));
                        i.OberknechtAPI[sym].timeout(cleanChannelName(channel), cleanChannelName(messageArguments[1])).then(resolve).catch(reject);
                        return;
                    };

                    case "delete":
                    case "deletemessage": {
                        if (!messageArguments[1]) return reject(Error("No messageID specified (messageArguments[1] is undefined)"));
                        i.OberknechtAPI[sym].deleteMessage(cleanChannelName(channel), messageArguments[1]).then(resolve).catch(reject);
                        return;
                    };

                    case "clear": {
                        i.OberknechtAPI[sym].clearChat(cleanChannelName(channel)).then(resolve).catch(reject);
                        return;
                    };

                    case "shoutout": {
                        if (!messageArguments[1]) return reject(Error("No target channel specified (messageArguments[1] is undefined)"));
                        i.OberknechtAPI[sym].shoutout(cleanChannelName(channel), cleanChannelName(messageArguments[1])).then(resolve).catch(reject);
                        return;
                    };

                    case "announce": {
                        if (!messageArguments[1]) return reject(Error("No announce message specified (messageArguments[1] is undefined)"));
                        let announcementColor;
                        if (annoucementColors.includes(messageArguments[1])) announcementColor = messageArguments[1];
                        i.OberknechtAPI[sym].announce(cleanChannelName(channel), (messageArguments.slice(((announcementColor ?? undefined) ? 2 : 1)).join(" ")), announcementColor).then(resolve).catch(reject);
                        return;
                    };

                    case "slow":
                    case "slowmode": {
                        i.OberknechtAPI[sym].slow(cleanChannelName(channel), messageArguments[1]).then(resolve).catch(reject);
                        return;
                    };

                    case "slowoff":
                    case "slowmodeoff": {
                        i.OberknechtAPI[sym].slowOff(cleanChannelName(channel)).then(resolve).catch(reject);
                        return;
                    };

                    case "followers":
                    case "followersonly": {
                        i.OberknechtAPI[sym].followers(cleanChannelName(channel), messageArguments[1]).then(resolve).catch(reject);
                        return;
                    };

                    case "followersoff":
                    case "followersonlyoff": {
                        i.OberknechtAPI[sym].followersOff(cleanChannelName(channel)).then(resolve).catch(reject);
                        return;
                    };

                    case "subscribers":
                    case "subscribersonly": {
                        i.OberknechtAPI[sym].subscribers(cleanChannelName(channel)).then(resolve).catch(reject);
                        return;
                    };

                    case "subscribersoff":
                    case "subscribersonlyoff": {
                        i.OberknechtAPI[sym].subscribersOff(cleanChannelName(channel)).then(resolve).catch(reject);
                        return;
                    };

                    case "emoteonly": {
                        i.OberknechtAPI[sym].emote(cleanChannelName(channel)).then(resolve).catch(reject);
                        return;
                    };

                    case "emoteonlyoff": {
                        i.OberknechtAPI[sym].emoteOff(cleanChannelName(channel)).then(resolve).catch(reject);
                        return;
                    };

                    case "r9k":
                    case "r9kbeta":
                    case "uniquechat": {
                        i.OberknechtAPI[sym].r9k(cleanChannelName(channel)).then(resolve).catch(reject);
                        return;
                    };

                    case "r9koff":
                    case "r9kbetaoff":
                    case "uniquechatoff": {
                        i.OberknechtAPI[sym].r9kOff(cleanChannelName(channel)).then(resolve).catch(reject);
                        return;
                    };

                    case "mod": {
                        if (!messageArguments[1]) return reject(Error("No user specified (messageArguments[1] is undefined)"));
                        i.OberknechtAPI[sym].mod(cleanChannelName(messageArguments[1])).then(resolve).catch(reject);
                        return;
                    };

                    case "unmod": {
                        if (!messageArguments[1]) return reject(Error("No user specified (messageArguments[1] is undefined)"));
                        i.OberknechtAPI[sym].unmod(cleanChannelName(messageArguments[1])).then(resolve).catch(reject);
                        return;
                    };

                    case "vip": {
                        if (!messageArguments[1]) return reject(Error("No user specified (messageArguments[1] is undefined)"));
                        i.OberknechtAPI[sym].vip(cleanChannelName(messageArguments[1])).then(resolve).catch(reject);
                        return;
                    };

                    case "unvip": {
                        if (!messageArguments[1]) return reject(Error("No user specified (messageArguments[1] is undefined)"));
                        i.OberknechtAPI[sym].unvip(cleanChannelName(messageArguments[1])).then(resolve).catch(reject);
                        return;
                    };

                    case "raid": {
                        if (!messageArguments[1]) return reject(Error("No user specified (messageArguments[1] is undefined)"));
                        i.OberknechtAPI[sym].raid(cleanChannelName(channel), cleanChannelName(messageArguments[1])).then(resolve).catch(reject);
                        return;
                    };

                    case "unraid": {
                        i.OberknechtAPI[sym].cancelraid(cleanChannelName(channel)).then(resolve).catch(reject);
                        return;
                    };

                    case "color": {
                        if (!messageArguments[1]) return reject(Error("No color specified (messageArguments[1] is undefined)"));
                        i.OberknechtAPI[sym].updateColor(messageArguments[1]).then(resolve).catch(reject);
                        return;
                    };

                    case "test": {
                        console.log("test");
                        resolve("test")
                        return;
                    };
                };
            };

            i.OberknechtActionEmitter[sym]?.once(messageType.toUpperCase(), () => { i.reconnectingKnechtClient[sym]?.[wsnum]?.send(((rawContent ? rawContent : `${((preContent ?? undefined) ? `${preContent} ` : "")}${messageType} ${message ?? ""}`))) })
                .then(a => {
                    return resolve(a);
                })
                .catch(e => {
                    // i.OberknechtEmitter[sym]?.emit(["error", "actionemitter:error"], e);
                    return reject(e);
                });
        });
    });
};

module.exports = emitTwitchAction;