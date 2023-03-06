const oberknechtAPI = require("oberknecht-api");

const clientOptions = {
    token: String(),
    // Token link generator: https://jubewe.github.io/oauthlink
    username: String(),
    channels: Array(),
    prefix: String(),
    clientid: String() || undefined,
    secure: Boolean(),
    anonymus: Boolean(),
    botStatus: "verified" || "none",
    isAlwaysMod: Boolean(),
    oberknechtApi: undefined ?? oberknechtAPI,
    reconnectMultiplier: Number(),
    executeOnOutgoingPrivmsg: Function(),
    max_channels_per_ws: Number(),
    debug: Number(),
    apiStartPath: String(),
    saveIDs: Boolean() ?? true
};

module.exports = clientOptions;