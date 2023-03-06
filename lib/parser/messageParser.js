const { messageCommand } = require("oberknecht-utils");
const joinAll = require("../operations/joinAll");
const messageTypes = require("./Message.Types");
const _getclientid = require("../operations/_getclientid");
const handleNotice = require("../handlers/handleNotice");

/** @param {string} rawMessage */
function messageParser(sym, rawMessage, wsnum) {
    let i = require("../index");

    if (!(rawMessage ?? undefined)) throw Error("rawMessage is undefined");
    rawMessage = rawMessage.replace(/\r\n$/g, "");
    wsnum = (wsnum ?? i.clientData[sym].currentKnecht);
    let ircCommand = messageCommand(rawMessage);

    i.OberknechtEmitter[sym].emit(["irc:_message", `irc:${wsnum}:_message`], rawMessage);
    i.OberknechtActionEmitter[sym].emit(ircCommand, rawMessage);
    i.OberknechtActionEmitter[sym].emit(`${wsnum}:${ircCommand}`, rawMessage);

    if (ircCommand === "NOTICE") return handleNotice(sym, rawMessage, wsnum);

    switch (ircCommand) {
        case "CLEARCHAT":
        case "CLEARMSG":
        case "GLOBALUSERSTATE":
        case "NOTICE":
        case "ROOMSTATE":
        case "USERNOTICE":
        case "USERSTATE":
        case "WHISPER": {
            i.OberknechtEmitter[sym].emit([`irc:${ircCommand.toLowerCase()}`, `irc:${wsnum}:${ircCommand.toLowerCase()}`, ircCommand], new messageTypes[`${ircCommand.toLowerCase()}Message`](sym, rawMessage));
            break;
        };

        case "PRIVMSG": {
            const privmsg = new messageTypes.privmsgMessage(sym, rawMessage);
            i.OberknechtEmitter[sym].emit([`irc:${ircCommand.toLowerCase()}`, `irc:${wsnum}:${ircCommand.toLowerCase()}`, ircCommand], privmsg, privmsg.channelName, privmsg.senderUserName, privmsg.messageText);
            break;
        };

        case "PING": {
            i.OberknechtEmitter[sym].emit(["irc:ping", `irc:${wsnum}:ping`, "PING"]);
            i.reconnectingKnechtClient[sym][wsnum].send("PONG");
            break;
        };

        case "PONG": {
            i.OberknechtEmitter[sym].emit(["irc:pong", `irc:${wsnum}:pong`, "PONG"]);
            break;
        }

        case "375": {
            (async () => {
                if (!i.clientData[sym]._options.clientid) {
                    await _getclientid(sym, i.clientData[sym]._options.token);
                };
                if (!i.clientData[sym]) return;
                if (wsnum == 0) i.OberknechtEmitter[sym].emit(["ready"], rawMessage);
                i.OberknechtEmitter[sym].emit(["client:ready", `irc:${wsnum}:ready`, "irc:open", "irc:ready"], rawMessage);
            })();

            if (i.clientData[sym]._options.channels && i.clientData[sym]._options.channels.length > 0) {
                if (wsnum == 0) {
                    joinAll(sym, i.clientData[sym]._options.channels)
                        .then(() => {
                            if (!i.clientData[sym]) return;
                            i.OberknechtEmitter[sym]?.emit(["client:autojoin", "autojoin"], i.clientData[sym]._options.channels);
                        })
                        .catch(e => {
                            if (!i.clientData[sym]) return;
                            i.OberknechtEmitter[sym]?.emit(["error", "unhandledRejection"], e);
                        })
                }
            };
            break;
        };
    };
};

module.exports = messageParser;