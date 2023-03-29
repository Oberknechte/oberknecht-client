/**
 * @param {String} channel 
 * @returns {String}
 */
function correctChannelName(channel){
    if(!(channel ?? undefined)) return undefined;
    return `#${channel.trim().replace(/^#/g, "")}`
};

module.exports = correctChannelName;