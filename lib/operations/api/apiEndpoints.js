class apiEndpoints {
    static twitch = class {
        static whisper = require("./twitch/whisper");
        static users = require("./twitch/_getusers");
        static shoutout = require("./twitch/shoutout");
    };
};

module.exports = apiEndpoints;