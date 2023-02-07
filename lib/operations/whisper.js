const i = require("..")
const apiEndpoints = require("./api/apiEndpoints");

/**
 * @param {Symbol} sym 
 * @param {string} targetUser 
 * @param {string} message 
 */
async function whisper(sym, targetUserID, message){
    return apiEndpoints.twitch.whisper(sym, i.clientData[sym]._options.userid, targetUserID, message);
};

module.exports = whisper;