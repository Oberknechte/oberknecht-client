const _splitmsg = require("../functions/_splitmsg");

/** @param {Symbol} sym @param {string} messageType @param {string} messageContent @param {String | undefined} preContent @param {String | undefined} rawContent */
async function emitTwitchAction(sym, messageType, messageContent, preContent, rawContent) {
    return new Promise((resolve, reject) => {
        let i = require("../index");
        if(messageType === "PRIVMSG" && i.clientData[sym]._options?.executeOnOutgoingPrivmsg) messageContent = i.clientData[sym]._options.executeOnOutgoingPrivmsg(messageContent);

        let channel = messageContent?.match(/^#\w+/g)?.[0];
        let channeladd = (channel ? `${channel} :` : channel);
        let messages = (messageType === "PRIVMSG" ? _splitmsg(messageContent.replace(/^#\w+\s:/g, "")).map(a => channeladd + a): [messageContent]);

        messages.forEach(message => {
            i.OberknechtActionEmitter[sym].once(messageType.toUpperCase(), () => { i.reconnectingKnechtClient[sym].send(((rawContent ? rawContent : `${((preContent ?? undefined) ? `${preContent} ` : "")}${messageType} ${message ?? ""}`))) })
                .then(a => {
                    return resolve(a);
                })
                .catch(e => {
                    i.OberknechtEmitter[sym].emit(["error", "actionemitter:error"], e);
                    return reject(e);
                })
        });
    })
};

module.exports = emitTwitchAction;