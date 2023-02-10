require("./lib/parser/CLEARCHAT.Message");
require("./lib/parser/GLOBALUSERSTATE.Message");
require("./lib/parser/NOTICE.Message");
require("./lib/parser/PRIVMSG.Message");
require("./lib/parser/USERNOTICE.Message");
require("./lib/parser/USERSTATE.Message");
require("./lib/parser/WHISPER.Message");

require("./lib/emitters/oberknecht.emitter");
require("./lib/emitters/oberknecht.action.emitter");

require("./lib/operations/action");
require("./lib/operations/join");
require("./lib/operations/joinAll");
require("./lib/operations/part");
require("./lib/operations/partAll");
require("./lib/operations/ping");
require("./lib/operations/pong");
require("./lib/operations/privmsg");
require("./lib/operations/reply");
require("./lib/operations/sendraw");
require("./lib/operations/whisper");
// This is all because JS won't show any values on the callbacks unless I import them here  FeelsWeirdMan

module.exports = class {
    static oberknechtClient = require("./lib/client/oberknecht.client");
    static messageTypes = require("./lib/parser/Message.Types");
};