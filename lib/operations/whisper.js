const i = require("..")
const apiEndpoints = require("./api/apiEndpoints");
const getuser = require("./api/getuser");

/**
 * @param {Symbol} sym 
 * @param {string} targetUser 
 * @param {string} message 
 */
async function whisper(sym, targetUser, message){
    return apiEndpoints.twitch.whisper(sym, i.clientData[sym]._options.userid, targetUser, message);
};

module.exports = whisper;