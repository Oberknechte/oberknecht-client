class apiEndpoints {
    static _validatetoken = require("./_validatetoken");
    static ban = require("./ban");
    static deleteMessage = require("./deleteMessage");
    static getusers = require("./getusers");
    static shoutout = require("./shoutout");
    static timeout = require("./timeout");
    static unban = require("./unban");
    static whisper = require("./whisper");
    
    static announce = require("./announce");
    static updateChatSettings = require("./updateChatSettings");
    static _updateSingleChatSetting = require("../operations/_updateSingleChatSetting");
    static getChatSettings = require("./getChatSettings");
    static getStreams = require("./getStreams");
};

module.exports = apiEndpoints;