const _splitmsg = require("../functions/_splitmsg");

/** @param {Symbol} sym @param {string} messageType @param {string} messageContent @param {String | undefined} preContent @param {String | undefined} rawContent */
async function emitTwitchAction(sym, messageType, messageContent, preContent, rawContent) {
    return new Promise((resolve, reject) => {
        let i = require("../index");
        let messages = (messageType === "PRIVMSG" ? _splitmsg(messageContent): [messageContent]);

        if(messageType === "PRIVMSG" && i.clientData[sym]._options?.executeOnOutgoingPrivmsg) messages.forEach(a => {messages[a] = i.clientData[sym]._options.executeOnOutgoingPrivmsg(a)});

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