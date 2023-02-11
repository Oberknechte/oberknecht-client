const privmsgMessage = require("../parser/PRIVMSG.Message");

const onPRIVMSGcallback = 
/**
 * @param {privmsgMessage} privmsg 
 * @param {string} channelName 
 * @param {string} senderUsername
 * @param {string} messageText
*/ (privmsg, channelName, senderUsername, messageText) => { };
module.exports = onPRIVMSGcallback;