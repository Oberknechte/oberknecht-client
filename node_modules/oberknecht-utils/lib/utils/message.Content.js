/** @param {string} rawMessage */
function messageContent(rawMessage) {
    return rawMessage.split(" ")?.slice(4)?.join(" ")?.replace(/(^:|^\s|\s$)/g, "")?.replace(/[\s]{2,}/g, " ") ?? undefined;
};

module.exports = messageContent;