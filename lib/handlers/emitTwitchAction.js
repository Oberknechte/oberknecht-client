/**
 * @param {String} messageType 
 * @param {Śtring} messageContent 
 * @param {String | undefined} preContent
 * @param {String | undefined} rawContent
 */

async function emitTwitchAction(messageType, messageContent, preContent, rawContent) {
    let i = require("..");

    return new Promise((resolve, reject) => {
        i.OberknechtActionEmitter.once(messageType.toUpperCase(), () => {i.reconnectingKnecht.send(((rawContent ? rawContent : `${((preContent ?? undefined) ? `${preContent} ` : "")}${messageType} ${messageContent ?? ""}`)))})
        .then(a => {
            // console.log("\t\t", a);
            return resolve(a);
        })
        .catch(e => {
            i.OberknechtEmitter.emit(["error", "actionemitter:error"], e);
            return reject(e);
        })
    })
};

module.exports = emitTwitchAction;