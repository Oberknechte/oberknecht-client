/**
 * @param {String} messageType 
 * @param {Śtring} messageContent 
 * @param {String | undefined} preContent
 * @param {String | undefined} rawContent
 */

async function emitTwitchAction(messageType, messageContent, preContent, rawContent) {
    return new Promise((resolve, reject) => {
        let i = require("../");
    
        return i.OberknechtactionEmitter.once(messageType.toUpperCase(), () => {i.reconnectingKnecht.send(((rawContent ? rawContent : `${((preContent ?? undefined) ? `${preContent} ` : "")}${messageType} ${messageContent ?? ""}`)))})
        .catch(e => {
            i.OberknechtEmitter.emit(["error", "actionemitter:error"], e);
        })
        .then(resolve)
        .catch(reject);
    });
};

module.exports = emitTwitchAction;