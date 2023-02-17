const oberknechtAPI = require("oberknecht-api");

const clientOptions = {
    token: String(),
    // Token link generator: https://jubewe.github.io/oauthlink
    username: String(),
    channels: Array(),
    prefix: String(),
    clientid: String() || undefined,
    secure: Boolean(),
    botStatus: "verified" || "none",
    isAlwaysMod: Boolean(),
    oberknechtApi: undefined ?? oberknechtAPI,
    reconnectMultiplier: Number()
};

module.exports = clientOptions;