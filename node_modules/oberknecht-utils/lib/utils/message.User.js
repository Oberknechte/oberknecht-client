/** @param {rawMessage} rawMessage */
function messageUser(rawMessage) {
    let match = rawMessage?.match(/(?<=^:)\w+(?=!)/g);
    if (!(rawMessage ?? undefined) || !(match ?? undefined)) return undefined;
    return match[0]
};

module.exports = messageUser;