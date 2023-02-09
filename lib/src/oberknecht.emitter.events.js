const oberknechtEvents = ["ready", "error", "unhandledRejection"];
const twitchIRCTags = ["CLEARCHAT", "CLEARMSG", "GLOBALUSERSTATE", "NOTICE", "PRIVMSG", "ROOMSTATE", "USERNOTICE", "USERSTATE", "WHISPER", "PING", "PONG", ""];
const oberknechtTwitchIRCTags = [...twitchIRCTags.map(v => {return `irc:${v}`}), "irc:_message"];
const wsEvents = ["ws:open", "ws:close", "ws:error", "ws:message"];
const clientEvents = ["client:open", "client:close", "client:error"];

const oberknechtEmitterEvents = [...oberknechtEvents, ...twitchIRCTags, ...oberknechtTwitchIRCTags, ...wsEvents, ...clientEvents];
module.exports = oberknechtEmitterEvents;