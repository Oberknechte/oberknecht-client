/** @param {Symbol} sym @param {string} targetUserID @param {string} message */
async function whisper(sym, targetUserID, message) {
    let i = require("../index");

    return i.OberknechtAPI[sym].whisper(i.clientData[sym]?._options?.userid, targetUserID, message);
};

module.exports = whisper; u