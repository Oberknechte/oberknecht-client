const _splitmsg = require("../functions/_splitmsg");

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

        messages.forEach(message => {
            i.OberknechtActionEmitter[sym]?.once(messageType.toUpperCase(), () => { i.reconnectingKnechtClient[sym]?.[wsnum]?.send(((rawContent ? rawContent : `${((preContent ?? undefined) ? `${preContent} ` : "")}${messageType} ${message ?? ""}`))) })
                .then(a => {
                    return resolve(a);
                })
                .catch(e => {
                    i.OberknechtEmitter[sym]?.emit(["error", "actionemitter:error"], e);
                    return reject(e);
                })
        });
    })
};

module.exports = emitTwitchAction;