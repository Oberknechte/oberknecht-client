/**
 * @param {string} rawMessage 
 */
function messagePrefix(rawMessage){
    if(!rawMessage) return null;
    return rawMessage.split(" ").filter((v, i) => {return i <= 2 && /^:\w+\!\w+@\w+\.tmi\.twitch\.tv/g.test(v)})[0] || null;
};

module.exports = messagePrefix;