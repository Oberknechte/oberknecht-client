"use strict";
var __createBinding = (this && this.__createBinding) || (Object.create ? (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    var desc = Object.getOwnPropertyDescriptor(m, k);
    if (!desc || ("get" in desc ? !m.__esModule : desc.writable || desc.configurable)) {
      desc = { enumerable: true, get: function() { return m[k]; } };
    }
    Object.defineProperty(o, k2, desc);
}) : (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    o[k2] = m[k];
}));
var __setModuleDefault = (this && this.__setModuleDefault) || (Object.create ? (function(o, v) {
    Object.defineProperty(o, "default", { enumerable: true, value: v });
}) : function(o, v) {
    o["default"] = v;
});
var __importStar = (this && this.__importStar) || function (mod) {
    if (mod && mod.__esModule) return mod;
    var result = {};
    if (mod != null) for (var k in mod) if (k !== "default" && Object.prototype.hasOwnProperty.call(mod, k)) __createBinding(result, mod, k);
    __setModuleDefault(result, mod);
    return result;
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.messageParser = void 0;
const oberknecht_utils_1 = require("oberknecht-utils");
const joinAll_1 = require("../operations/joinAll");
const messageTypes = __importStar(require("./Message.Types"));
const _getclientid_1 = require("../operations/_getclientid");
const handleNotice_1 = require("../handlers/handleNotice");
const __1 = require("..");
function messageParser(sym, rawMessage, wsnum) {
    if (!(rawMessage ?? undefined))
        throw Error("rawMessage is undefined");
    rawMessage = rawMessage.replace(/\r\n$/g, "");
    let wsnum_ = (wsnum ?? __1.i.clientData[sym].currentKnecht);
    let IRCCommand = (0, oberknecht_utils_1.messageCommand)(rawMessage);
    __1.i.OberknechtEmitter[sym].emit(["irc:_message", `irc:${wsnum_}:_message`], rawMessage);
    __1.i.OberknechtActionEmitter[sym].emit(IRCCommand, rawMessage);
    __1.i.OberknechtActionEmitter[sym].emit(`${wsnum_}:${IRCCommand}`, rawMessage);
    if (IRCCommand === "NOTICE")
        return (0, handleNotice_1.handleNotice)(sym, rawMessage, wsnum_);
    switch (IRCCommand) {
        case "CLEARCHAT":
        case "CLEARMSG":
        case "GLOBALUSERSTATE":
        case "NOTICE":
        case "ROOMSTATE":
        case "USERNOTICE":
        case "USERSTATE":
        case "WHISPER":
            {
                __1.i.OberknechtEmitter[sym].emit([`irc:${IRCCommand.toLowerCase()}`, `irc:${wsnum_}:${IRCCommand.toLowerCase()}`, IRCCommand], new messageTypes[`${IRCCommand.toLowerCase()}Message`](sym, rawMessage));
                break;
            }
            ;
        case "PRIVMSG":
            {
                const privmsg = new messageTypes.privmsgMessage(sym, rawMessage);
                __1.i.OberknechtEmitter[sym].emit([`irc:${IRCCommand.toLowerCase()}`, `irc:${wsnum_}:${IRCCommand.toLowerCase()}`, IRCCommand], privmsg, privmsg.channelName, privmsg.senderUserName, privmsg.messageText);
                break;
            }
            ;
        case "PING":
            {
                __1.i.OberknechtEmitter[sym].emit(["irc:ping", `irc:${wsnum_}:ping`, "PING"]);
                __1.i.reconnectingKnechtClient[sym][wsnum_].send("PONG");
                break;
            }
            ;
        case "PONG": {
            __1.i.OberknechtEmitter[sym].emit(["irc:pong", `irc:${wsnum_}:pong`, "PONG"]);
            break;
        }
        case "375":
            {
                (async () => {
                    if (!__1.i.clientData[sym]._options.clientid) {
                        await (0, _getclientid_1._getclientid)(sym, __1.i.clientData[sym]._options.token);
                    }
                    ;
                    if (!__1.i.clientData[sym])
                        return;
                    if (wsnum_ == 0)
                        __1.i.OberknechtEmitter[sym].emit(["ready"], rawMessage);
                    __1.i.OberknechtEmitter[sym].emit(["client:ready", `irc:${wsnum_}:ready`, "irc:open", "irc:ready"], rawMessage);
                })();
                if (__1.i.clientData[sym]._options.channels && __1.i.clientData[sym]._options.channels.length > 0) {
                    if (wsnum_ == 0) {
                        (0, joinAll_1.joinAll)(sym, __1.i.clientData[sym]._options.channels)
                            .then(() => {
                            if (!__1.i.clientData[sym])
                                return;
                            __1.i.OberknechtEmitter[sym]?.emit(["client:autojoin", "autojoin"], __1.i.clientData[sym]._options.channels);
                        })
                            .catch(e => {
                            if (!__1.i.clientData[sym])
                                return;
                            __1.i.OberknechtEmitter[sym]?.emit(["error", "unhandledRejection"], e);
                        });
                    }
                }
                ;
                break;
            }
            ;
    }
    ;
}
exports.messageParser = messageParser;
;
