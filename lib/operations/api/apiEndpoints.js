class apiEndpoints {
    static twitch = class {
        static whisper = require("./whisper");
        static users = require("./twitch/_getusers");
    };
};

module.exports = apiEndpoints;