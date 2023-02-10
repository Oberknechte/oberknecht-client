const apiEndpoints = require("./api/apiEndpoints");

/**
 * @param {Symbol} sym 
 * @param {string} from_broadcaster_id 
 * @param {string} to_broadcaster_id 
 */
async function shoutout(sym, from_broadcaster_id, to_broadcaster_id){
    return apiEndpoints.twitch.shoutout(sym, from_broadcaster_id, to_broadcaster_id);
};

module.exports = shoutout;