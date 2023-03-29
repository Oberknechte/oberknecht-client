/** @param {String} channel */
function correctChannelName(channel) {
    if (!(channel ?? undefined)) return undefined;
    return `#${channel.toLowerCase().trim().replace(/^#/g, "")}`
};

module.exports = correctChannelName;