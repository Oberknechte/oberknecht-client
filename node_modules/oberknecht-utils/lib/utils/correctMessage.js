/** @param {String} message */
function correctMessage(message) {
    if (!(message ?? undefined)) return;

    return message.trim().replace(/\s+/g, " ");
};

module.exports = correctMessage;