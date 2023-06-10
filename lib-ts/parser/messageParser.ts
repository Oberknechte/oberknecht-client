import { messageCommand } from "oberknecht-utils";
import { joinAll } from "../operations/joinAll";
import * as messageTypes from "./Message.Types";
import { _getclientid } from "../operations/_getclientid";
import { handleNotice } from "../handlers/handleNotice";
import { i } from "..";

export function messageParser(sym: string, rawMessage: string, wsnum?: number) {
  if (!(rawMessage ?? undefined)) throw Error("rawMessage is undefined");
  rawMessage = rawMessage.replace(/\r\n$/g, "");
  let wsnum_: number = wsnum ?? i.clientData[sym].currentKnecht;
  let IRCCommand = messageCommand(rawMessage);

  i.OberknechtEmitter[sym].emit(
    ["irc:_message", `irc:${wsnum_}:_message`],
    rawMessage
  );
  i.OberknechtActionEmitter[sym].emit(IRCCommand, rawMessage);
  i.OberknechtActionEmitter[sym].emit(`${wsnum_}:${IRCCommand}`, rawMessage);

  if (IRCCommand === "NOTICE") return handleNotice(sym, rawMessage, wsnum_);

  switch (IRCCommand) {
    case "CLEARCHAT":
    case "CLEARMSG":
    case "GLOBALUSERSTATE":
    case "NOTICE":
    case "ROOMSTATE":
    case "USERNOTICE":
    case "USERSTATE":
    case "WHISPER": {
      i.OberknechtEmitter[sym].emit(
        [
          `irc:${IRCCommand.toLowerCase()}`,
          `irc:${wsnum_}:${IRCCommand.toLowerCase()}`,
          IRCCommand,
        ],
        new messageTypes[`${IRCCommand.toLowerCase()}Message`](sym, rawMessage)
      );
      break;
    }

    case "PRIVMSG": {
      const privmsg = new messageTypes.privmsgMessage(sym, rawMessage);
      i.OberknechtEmitter[sym].emit(
        [
          `irc:${IRCCommand.toLowerCase()}`,
          `irc:${wsnum_}:${IRCCommand.toLowerCase()}`,
          IRCCommand,
        ],
        privmsg,
        privmsg.channelName,
        privmsg.senderUserName,
        privmsg.messageText
      );
      break;
    }

    case "PING": {
      i.OberknechtEmitter[sym].emit(["irc:ping", `irc:${wsnum_}:ping`, "PING"]);
      i.reconnectingKnechtClient[sym][wsnum_].send("PONG");
      break;
    }

    case "PONG": {
      i.OberknechtEmitter[sym].emit(["irc:pong", `irc:${wsnum_}:pong`, "PONG"]);
      break;
    }

    case "375": {
      (async () => {
        if (!i.clientData[sym]._options.clientid) {
          await _getclientid(sym, i.clientData[sym]._options.token);
        }
        if (!i.clientData[sym]) return;
        if (wsnum_ == 0) i.OberknechtEmitter[sym].emit(["ready"], rawMessage);
        i.OberknechtEmitter[sym].emit(
          ["client:ready", `irc:${wsnum_}:ready`, "irc:open", "irc:ready"],
          rawMessage
        );
      })();

      if (
        i.clientData[sym]._options.channels &&
        i.clientData[sym]._options.channels.length > 0
      ) {
        if (wsnum_ == 0) {
          joinAll(sym, i.clientData[sym]._options.channels)
            .then(() => {
              if (!i.clientData[sym]) return;
              i.OberknechtEmitter[sym]?.emit(
                ["client:autojoin", "autojoin"],
                i.clientData[sym]._options.channels
              );
            })
            .catch((e) => {
              if (!i.clientData[sym]) return;
              i.OberknechtEmitter[sym]?.emit(
                ["error", "unhandledRejection"],
                e
              );
            });
        }
      }
      break;
    }
  }
}
