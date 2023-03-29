require("./lib/endpoints/_validatetoken");
require("./lib/endpoints/ban");
require("./lib/endpoints/deleteMessage");
// require("./lib/endpoints/gedtUsers");
require("./lib/endpoints/shoutout");
require("./lib/endpoints/timeout");
require("./lib/endpoints/unban");
require("./lib/endpoints/whisper");

require("./lib/endpoints/announce");
require("./lib/endpoints/getChatSettings");
require("./lib/endpoints/getStreams");

require("./lib/arguments/chatSettings");
require("./lib/arguments/oberknechtAPIOptions");
require("./lib/arguments/getStreamsFilters");

const oberknechtAPI = require("./lib/api/oberknecht.api");

module.exports = class {
    static oberknechtAPI = oberknechtAPI;
};